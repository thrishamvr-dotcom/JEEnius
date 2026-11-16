const fs = require('fs');
const { quizStyles } = require('./quiz_css.js');
const { dashboardAdditions } = require('./additions.js');
const { quizClientJS } = require('./quiz_js.js');

// Base HTML template reading from original jeenius.html source
const orig = fs.readFileSync('C:/Users/thris/.gemini/antigravity/brain/91fed35b-fb59-4e7c-884d-d9f4e10cb1fc/.user_uploaded/media_1794678946665_73845991.html', 'utf8');

// 1. In the outer HTML, add instant demo button on #home for quick testing
let modified = orig;

// Add direct demo button on welcome screen
const nextBtnTarget = '<button id="next">Get Started &rarr;</button>';
if (modified.includes(nextBtnTarget)) {
  modified = modified.replace(nextBtnTarget, `
    <button id="next">Get Started &rarr;</button>
    <button id="directDash" style="margin-top:10px;padding:10px 24px;border-radius:24px;border:1px solid rgba(245,179,53,0.4);background:rgba(245,179,53,0.12);color:var(--gold);font:600 13px inherit;cursor:pointer;transition:all .2s;">Open Dashboard Directly &rarr;</button>
  `);
}

// 2. In dsrc styles, inject quizStyles right before closing </style> of dashboard
const dsrcIdx = modified.indexOf('id="dsrc"');
const dsrcStyleClose = modified.indexOf('</style>', dsrcIdx);
if (dsrcStyleClose !== -1) {
  modified = modified.slice(0, dsrcStyleClose) + '\n' + quizStyles + '\n' + modified.slice(dsrcStyleClose);
}

// 3. In dsrc nav, update the navigation items to have explicit onclick handlers and add Subject Practice button
const navTarget = `<nav id="nav">
      <button class="on"><span class="i"><svg><use href="#i-home"/></svg></span>Home</button>
      <button><span class="i"><svg><use href="#i-qs"/></svg></span>Questions<span class="chev">▾</span></button>
      <button><span class="i"><svg><use href="#i-notes"/></svg></span>Notes</button>
      <button><span class="i"><svg><use href="#i-todo"/></svg></span>To-Do List</button>
      <button><span class="i"><svg><use href="#i-box"/></svg></span>Treasure Box</button>
      <button><span class="i"><svg><use href="#i-chart"/></svg></span>Analytics</button>
      <button><span class="i"><svg><use href="#i-user"/></svg></span>Profile</button>
    </nav>`;

const navReplacement = `<nav id="nav">
      <button class="on" id="navHome" onclick="window.showHome()"><span class="i"><svg><use href="#i-home"/></svg></span>Home</button>
      <button id="navQuestions" onclick="window.showChapterwise()"><span class="i"><svg><use href="#i-qs"/></svg></span>Questions<span class="chev">▾</span></button>
      <button id="navSubject" onclick="window.showSubjectwise()"><span class="i"><svg><use href="#i-atom"/></svg></span>Subject Practice</button>
      <button><span class="i"><svg><use href="#i-notes"/></svg></span>Notes</button>
      <button id="navTodo" onclick="window.showTodo()"><span class="i"><svg><use href="#i-todo"/></svg></span>To-Do List</button>
      <button><span class="i"><svg><use href="#i-box"/></svg></span>Treasure Box</button>
      <button><span class="i"><svg><use href="#i-chart"/></svg></span>Analytics</button>
      <button><span class="i"><svg><use href="#i-user"/></svg></span>Profile</button>
    </nav>`;

if (modified.includes(navTarget)) {
  modified = modified.replace(navTarget, navReplacement);
} else {
  console.log('navTarget not matched exactly, trying regex');
  modified = modified.replace(/<nav id="nav">[\s\S]*?<\/nav>/, navReplacement);
}

// 4. In Study Hub tiles: replace the chapterwise and subjectwise buttons with direct onclick and IDs
const tilesTarget = `<button class="tile"><svg class="e"><use href="#i-cubes"/></svg><div>Chapter-wise Questions</div></button>
      <button class="tile"><svg class="e"><use href="#i-atom"/></svg><div>Subject-wise Practice</div></button>`;

const tilesReplacement = `<button class="tile" id="btnChapterwise" onclick="window.showChapterwise()"><svg class="e"><use href="#i-cubes"/></svg><div>Chapter-wise Questions<small>PDF Question Bank • 30 Ch</small></div></button>
      <button class="tile" id="btnSubjectwise" onclick="window.showSubjectwise()"><svg class="e"><use href="#i-atom"/></svg><div>Subject-wise Practice<small>Physics • Chem • Math</small></div></button>`;

if (modified.includes(tilesTarget)) {
  modified = modified.replace(tilesTarget, tilesReplacement);
} else {
  console.log('tilesTarget not matched, replacing individual tiles');
  modified = modified.replace(/<button class="tile">[\s\S]*?Chapter-wise Questions[\s\S]*?<\/button>/,
    `<button class="tile" id="btnChapterwise" onclick="window.showChapterwise()"><svg class="e"><use href="#i-cubes"/></svg><div>Chapter-wise Questions<small>PDF Question Bank • 30 Ch</small></div></button>`);
  modified = modified.replace(/<button class="tile">[\s\S]*?Subject-wise Practice[\s\S]*?<\/button>/,
    `<button class="tile" id="btnSubjectwise" onclick="window.showSubjectwise()"><svg class="e"><use href="#i-atom"/></svg><div>Subject-wise Practice<small>Physics • Chem • Math</small></div></button>`);
}

const mockTileTarget = '<button class="tile"><svg class="e"><use href="#i-clip"/></svg><div>Full Mocks</div></button>';
const mockTileReplacement = '<button class="tile" id="btnMockMode"><svg class="e"><use href="#i-clip"/></svg><div>Full Mocks<small>Build a custom mock</small></div></button>';
modified = modified.replace(mockTileTarget, mockTileReplacement);

// 5. In dsrc HTML: inject dashboardAdditions right before closing </main>
const dsrcMainEnd = modified.indexOf('</main>', modified.indexOf('id="dsrc"'));
if (dsrcMainEnd !== -1) {
  modified = modified.slice(0, dsrcMainEnd) + '\n' + dashboardAdditions + '\n' + modified.slice(dsrcMainEnd);
}

// 6. In dsrc script: update goTodo and nav click listener, and inject quizClientJS
const goTodoTarget = `function goTodo(){$('main').classList.add('todo');document.querySelectorAll('#nav button').forEach((b,i)=>b.classList.toggle('on',i===3))}`;
const goTodoReplacement = `function goTodo(){
  const m = document.querySelector('#dash main');
  if (m) {
    m.classList.remove('chapter-mode', 'subject-mode', 'mock-mode', 'quiz-mode', 'result-mode');
    m.classList.add('todo');
  }
  document.querySelectorAll('#nav button').forEach(b => {
    b.classList.toggle('on', b.textContent.trim() === 'To-Do List');
  });
}
window.goTodo = goTodo;`;

if (modified.includes(goTodoTarget)) {
  modified = modified.replace(goTodoTarget, goTodoReplacement);
}

const navListenTarget = `document.getElementById('nav').addEventListener('click',e=>{const b=e.target.closest('button');if(b)$('main').classList.toggle('todo',b.textContent.trim()==='To-Do List')});`;
const navListenReplacement = `document.getElementById('nav').addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(!b)return;
  const txt = b.textContent.trim();
  if (txt === 'To-Do List') goTodo();
  else if (txt === 'Home') { if (window.showHome) window.showHome(); }
  else if (txt.startsWith('Questions')) { if (window.showChapterwise) window.showChapterwise(); }
  else if (txt.includes('Subject')) { if (window.showSubjectwise) window.showSubjectwise(); }
});`;

if (modified.includes(navListenTarget)) {
  modified = modified.replace(navListenTarget, navListenReplacement);
}

// Inject quizClientJS before the closing script tag of dsrc
// Note: In dsrc, script is closed with <\/script>
const dsrcScriptClose = modified.indexOf('<\\/script>', modified.indexOf('id="dsrc"'));
if (dsrcScriptClose !== -1) {
  modified = modified.slice(0, dsrcScriptClose) + '\n' + quizClientJS + '\n' + modified.slice(dsrcScriptClose);
}

// 7. In parent script: handle directDash click
const parentScriptEnd = modified.lastIndexOf('</script>');
const directDashCode = `
// Direct dashboard demo trigger
const dDashBtn = document.getElementById('directDash');
if (dDashBtn) {
  dDashBtn.addEventListener('click', () => {
    openDash({ username: 'JEEnius Aspirant', exam: 'JEE Main', qpd: 50, date: '2027-01-21' });
  });
}
`;
modified = modified.slice(0, parentScriptEnd) + '\n' + directDashCode + '\n' + modified.slice(parentScriptEnd);

// Write to jeenius.html and index.html
fs.writeFileSync('C:/Users/thris/OneDrive/Desktop/JEEnius/jeenius.html', modified, 'utf8');
fs.writeFileSync('C:/Users/thris/OneDrive/Desktop/JEEnius/index.html', modified, 'utf8');
console.log('Build completed! File sizes:');
console.log('jeenius.html:', fs.statSync('C:/Users/thris/OneDrive/Desktop/JEEnius/jeenius.html').size);
console.log('index.html:', fs.statSync('C:/Users/thris/OneDrive/Desktop/JEEnius/index.html').size);
