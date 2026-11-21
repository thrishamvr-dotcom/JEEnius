const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '127.0.0.1';
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'users.json');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readUsers() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeUsers(users) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data), 'application/json; charset=utf-8');
}

function cleanUser(payload) {
  const username = String(payload.username || payload.name || '').trim();
  const exam = String(payload.exam || '').trim();
  const qpd = Math.round(Number(payload.qpd));
  const date = String(payload.date || '');
  if (!/^[A-Za-z0-9_.]{3,20}$/.test(username)) {
    return { error: 'Username must be 3 to 20 letters, numbers, dots, or underscores.' };
  }
  if (exam !== 'JEE Main' && exam !== 'JEE Advanced') {
    return { error: 'Choose JEE Main or JEE Advanced.' };
  }
  if (!Number.isFinite(qpd) || qpd < 5 || qpd > 200) {
    return { error: 'Daily question goal must be between 5 and 200.' };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: 'Exam date is missing.' };
  }
  return { username, exam, qpd, date };
}

function registerUser(payload) {
  const cleaned = cleanUser(payload);
  if (cleaned.error) return { status: 400, body: { error: cleaned.error } };
  const users = readUsers();
  const key = cleaned.username.toLowerCase();
  const now = new Date().toISOString();
  const existing = users.find(user => user.username.toLowerCase() === key);
  if (existing) {
    existing.exam = cleaned.exam;
    existing.qpd = cleaned.qpd;
    existing.date = cleaned.date;
    existing.updatedAt = now;
    writeUsers(users);
    console.log('Updated signup: ' + existing.username + ' · ' + existing.exam);
    return { status: 200, body: { ok: true, created: false, user: existing } };
  }
  const user = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    username: cleaned.username,
    exam: cleaned.exam,
    qpd: cleaned.qpd,
    date: cleaned.date,
    registeredAt: now
  };
  users.unshift(user);
  writeUsers(users);
  console.log('New signup: ' + user.username + ' · ' + user.exam);
  return { status: 201, body: { ok: true, created: true, user } };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 100000) {
        reject(new Error('Body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function staticFile(urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  rel = rel.replace(/^\/+/, '');
  if (!rel || rel.includes('\0')) return null;
  const abs = path.resolve(ROOT, rel);
  const root = path.resolve(ROOT);
  if (abs !== root && !abs.startsWith(root + path.sep)) return null;
  const fromRoot = path.relative(root, abs);
  const blocked = fromRoot === 'server.js' || fromRoot === 'data' || fromRoot.startsWith('data' + path.sep);
  if (blocked) return null;
  return abs;
}

const adminPage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>JEEnius signups</title>
<style>
  :root { --gold:#f5b335; --blue:#3b8cf0; --line:rgba(255,255,255,.12); }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; background:#07090d; color:#e8e6df; font-family:"Segoe UI",system-ui,sans-serif; }
  main { width:min(960px, calc(100% - 32px)); margin:32px auto 48px; }
  h1 { margin:0 0 6px; font-size:32px; background:linear-gradient(90deg,var(--blue),var(--gold)); -webkit-background-clip:text; background-clip:text; color:transparent; }
  p { margin:0; color:#8a94a3; }
  .top { display:flex; justify-content:space-between; gap:16px; align-items:flex-end; margin-bottom:18px; }
  .count { font-size:42px; font-weight:750; line-height:1; color:#fff; }
  .count span { display:block; margin-top:4px; font-size:13px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#8a94a3; }
  table { width:100%; border-collapse:collapse; background:#10151d; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
  th, td { padding:14px 16px; text-align:left; border-bottom:1px solid var(--line); }
  th { font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#8a94a3; }
  tr:last-child td { border-bottom:0; }
  tr.new td { background:rgba(245,179,53,.12); }
  .empty { padding:28px 16px; color:#8a94a3; }
  .status { min-height:20px; margin-top:12px; font-size:13px; color:#8a94a3; }
  a { color:var(--gold); }
</style>
</head>
<body>
<main>
  <div class="top">
    <div>
      <h1>New JEEnius users</h1>
      <p>This list updates on its own when someone finishes signup.</p>
    </div>
    <div class="count" id="count">0<span>signups</span></div>
  </div>
  <table>
    <thead>
      <tr><th>Username</th><th>Exam</th><th>Questions / day</th><th>Exam date</th><th>Registered</th></tr>
    </thead>
    <tbody id="rows"><tr><td class="empty" colspan="5">Waiting for the first signup.</td></tr></tbody>
  </table>
  <p class="status" id="status">Checking for signups…</p>
</main>
<script>
  const rows = document.getElementById('rows');
  const count = document.getElementById('count');
  const status = document.getElementById('status');
  let known = new Set();
  let ready = false;
  function when(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }
  function paint(users) {
    count.firstChild.nodeValue = String(users.length);
    if (!users.length) {
      rows.innerHTML = '<tr><td class="empty" colspan="5">Waiting for the first signup.</td></tr>';
      return;
    }
    rows.innerHTML = users.map(user => {
      const fresh = ready && !known.has(user.id);
      return '<tr class="' + (fresh ? 'new' : '') + '"><td>' + escapeHtml(user.username) + '</td><td>' + escapeHtml(user.exam) + '</td><td>' + user.qpd + '</td><td>' + escapeHtml(user.date) + '</td><td>' + escapeHtml(when(user.registeredAt)) + '</td></tr>';
    }).join('');
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  }
  async function load() {
    try {
      const response = await fetch('/api/users', { cache: 'no-store' });
      const data = await response.json();
      const users = Array.isArray(data.users) ? data.users : [];
      paint(users);
      known = new Set(users.map(user => user.id));
      ready = true;
      status.textContent = 'Updated ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (error) {
      status.textContent = 'Could not reach the server.';
    }
  }
  load();
  setInterval(load, 3000);
</script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  if (req.method === 'OPTIONS') {
    send(res, 204, '');
    return;
  }
  if (url.pathname === '/api/register' && req.method === 'POST') {
    try {
      const payload = JSON.parse(await readBody(req) || '{}');
      const result = registerUser(payload);
      sendJson(res, result.status, result.body);
    } catch (error) {
      sendJson(res, 400, { error: 'Send the signup as JSON.' });
    }
    return;
  }
  if (url.pathname === '/api/users' && req.method === 'GET') {
    const users = readUsers().slice().sort((a, b) => String(b.registeredAt).localeCompare(String(a.registeredAt)));
    sendJson(res, 200, { users });
    return;
  }
  if (url.pathname === '/admin') {
    send(res, 200, adminPage, 'text/html; charset=utf-8');
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed');
    return;
  }
  const file = staticFile(url.pathname);
  if (!file) {
    send(res, 404, 'Not found');
    return;
  }
  fs.readFile(file, (error, buffer) => {
    if (error) {
      send(res, error.code === 'ENOENT' ? 404 : 500, error.code === 'ENOENT' ? 'Not found' : 'Could not read file');
      return;
    }
    send(res, 200, buffer, TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
  });
});

server.listen(PORT, HOST, () => {
  console.log('JEEnius app:    http://localhost:' + PORT);
  console.log('New signups:    http://localhost:' + PORT + '/admin');
});
