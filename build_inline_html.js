const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { quizStyles } = require('./quiz_css.js');
const { dashboardAdditions } = require('./additions.js');
const { quizClientJS } = require('./quiz_js.js');

const orig = fs.readFileSync('C:/Users/thris/.gemini/antigravity/brain/91fed35b-fb59-4e7c-884d-d9f4e10cb1fc/.user_uploaded/media_1794678946665_73845991.html', 'utf8');
const logoPath = path.join(__dirname, 'jeenius-logo.png');
if (!fs.existsSync(logoPath)) {
  throw new Error(`JEEnius logo image not found at ${logoPath}`);
}
const logoDataURI = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;

// 1. Extract dsrc
const dsrcStart = orig.indexOf('<script type="text/html" id="dsrc">') + 35;
const dsrcEnd = orig.indexOf('</script>', dsrcStart);
const dsrcRaw = orig.substring(dsrcStart, dsrcEnd);

// Extract styles from dsrc
const styleStart = dsrcRaw.indexOf('<style>') + 7;
const styleEnd = dsrcRaw.indexOf('</style>');
let dashStyles = dsrcRaw.substring(styleStart, styleEnd);
const logoSpacingRule = '.logo{text-align:center;margin-bottom:22px}';
if (!dashStyles.includes(logoSpacingRule)) {
  throw new Error('Could not locate the sidebar logo spacing rule.');
}
dashStyles = dashStyles.replace(logoSpacingRule, '.logo{text-align:center;margin-bottom:8px}');
dashStyles += `
#dash .logo{width:auto;height:auto;animation:none;mix-blend-mode:normal;flex:none;justify-content:center}
#dash .logo>b,#dash .logo>small{display:none}
#dash .crest{width:180px;height:auto;aspect-ratio:2.2;border-radius:0;margin:0 auto 8px;overflow:visible;background:transparent;box-shadow:none}
#dash .crest img{width:100%;height:100%;display:block;object-fit:contain}
@media(max-width:700px){#dash .crest{width:136px}}
`;

// Extract body HTML from dsrc
const bodyStart = dsrcRaw.indexOf('<body>') + 6;
const scriptStartInDsrc = dsrcRaw.indexOf('<script>');
let dashBodyHTML = dsrcRaw.substring(bodyStart, scriptStartInDsrc).trim();

// Replace the mixed Study Hub shortcuts with exam-specific practice panels.
const studyHubRegex = /    <div class="home-only hub-h">[\s\S]*?    <\/section>\r?\n\r?\n    <section class="home-only bot">/;
if (!studyHubRegex.test(dashBodyHTML)) {
  throw new Error('Could not locate the Study Hub markup.');
}
dashBodyHTML = dashBodyHTML.replace(studyHubRegex, `    <div class="home-only hub-h"><svg><use href="#i-spark"/></svg><h2>JEE Practice</h2><span>Choose an exam and practice mode</span></div>
    <section class="home-only study-exam-panels" aria-label="Exam practice">
      <article class="study-exam-panel">
        <div class="study-exam-heading"><span class="study-exam-icon">M</span><div><h3>JEE Main</h3><p>Practice with the available question bank.</p></div></div>
        <div class="study-exam-actions">
          <button class="tile" id="btnSubjectwise" onclick="window.showSubjectwise()"><svg class="e"><use href="#i-atom"/></svg><div>Subject-wise<small>Physics • Chemistry • Mathematics</small></div></button>
          <button class="tile" id="btnChapterwise" onclick="window.showChapterwise()"><svg class="e"><use href="#i-cubes"/></svg><div>Chapter-wise<small>Practice by chapter</small></div></button>
          <button class="tile" id="btnMockMode"><svg class="e"><use href="#i-clip"/></svg><div>Mock Test<small>Build a custom mock</small></div></button>
        </div>
      </article>
      <article class="study-exam-panel study-exam-advanced">
        <div class="study-exam-heading"><span class="study-exam-icon">A</span><div><h3>JEE Advanced</h3><p>150 questions from your Advanced practice set.</p></div></div>
        <div class="study-exam-actions">
          <button class="tile" id="btnAdvancedSubjectwise" type="button"><svg class="e"><use href="#i-atom"/></svg><div>Subject-wise<small>Physics • Chemistry • Mathematics</small></div></button>
          <button class="tile" id="btnAdvancedChapterwise" type="button"><svg class="e"><use href="#i-cubes"/></svg><div>Chapter-wise<small>Practice by chapter</small></div></button>
          <button class="tile" id="btnAdvancedMockMode" type="button"><svg class="e"><use href="#i-clip"/></svg><div>Mock Test<small>Build a custom mock</small></div></button>
        </div>
      </article>
    </section>
    <section class="home-only spin-dashboard" aria-labelledby="spinDashboardTitle">
      <div class="spin-dashboard-heading">
        <div>
          <span class="spin-eyebrow">DAILY CHAPTER CHALLENGE</span>
          <h2 id="spinDashboardTitle">Spin a Chapter</h2>
          <p>Ten chapters from Physics, Chemistry, and Mathematics. Spin to pick your next test.</p>
        </div>
        <label class="spin-exam-field" for="spinExamSelect">Exam
          <select id="spinExamSelect" class="subj-sel">
            <option value="main">JEE Main</option>
            <option value="advanced">JEE Advanced</option>
          </select>
        </label>
      </div>
      <div class="spin-dashboard-layout">
        <div class="spin-wheel-card">
          <div class="spin-wheel-wrap">
            <span class="spin-pointer" aria-hidden="true"></span>
            <canvas id="chapterSpinWheel" class="spin-wheel-canvas" width="460" height="460" role="img" aria-label="Wheel with 10 chapters from all three subjects"></canvas>
            <span class="spin-wheel-center" aria-hidden="true">J</span>
          </div>
          <button type="button" class="chap-btn spin-button" id="btnSpinChapter">Spin for a chapter</button>
          <p class="spin-status" id="spinStatus" aria-live="polite">Ready when you are — spin to choose one of 10 chapters.</p>
        </div>
        <div class="spin-settings">
          <h3>Chapter test settings</h3>
          <div class="spin-test-fields">
            <label class="quiz-builder-field" for="spinQuestionCount">Number of questions
              <input id="spinQuestionCount" type="number" min="1" max="15" value="10" inputmode="numeric">
            </label>
            <label class="quiz-builder-field" for="spinDuration">Time limit
              <select id="spinDuration" class="subj-sel">
                <option value="10">10 minutes</option>
                <option value="20" selected>20 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </label>
          </div>
          <div class="spin-selected-chapter" id="spinSelectedChapter" aria-live="polite">Your selected chapter will appear here.</div>
          <p class="quiz-builder-error" id="spinError" role="alert" aria-live="polite"></p>
          <button type="button" class="chap-btn quiz-generate-btn" id="btnStartSpinTest" disabled>Take Chapter Test →</button>
        </div>
      </div>
    </section>
    <section class="home-only study-resources" aria-label="Study tools">
      <button class="tile" id="btnPocketNotes"><svg class="e"><use href="#i-book"/></svg><div>Pocket Notes<small>Write and draw study notes</small></div></button>
      <button class="tile"><svg class="e"><use href="#i-check"/></svg><div>To-Do List<small>Plan tasks and exams</small></div></button>
    </section>

    <section class="home-only bot">`);

const questionTrackerTarget = `<div class="qt">
          <div><h3>JEE Main</h3><div class="n">0 <span>/ 1800</span></div><div class="bar"><i style="width:0"></i></div><small>0%</small></div>
          <div><h3>JEE Advanced</h3><div class="n">0 <span>/ 1200</span></div><div class="bar"><i style="width:0"></i></div><small>0%</small></div>
        </div>`;
if (!dashBodyHTML.includes(questionTrackerTarget)) {
  throw new Error('Could not locate the JEE Main and JEE Advanced question tracker markup.');
}
dashBodyHTML = dashBodyHTML.replace(questionTrackerTarget, '<div class="qt"></div>');
dashBodyHTML = dashBodyHTML.replace(/^[ \t]*<button class="pill">View Details →<\/button>\r?\n/m, '');
dashBodyHTML = dashBodyHTML.replace(/^[ \t]*<div class="cardfoot"><button class="pill">View Progress →<\/button><\/div>\r?\n/m, '');
dashBodyHTML = dashBodyHTML.replace(/^[ \t]*<div class="cardfoot"><button class="pill">View Stats →<\/button><\/div>\r?\n/m, '');

const levelCardRegex = /(<div class="card">\s*<h2>Your Level<\/h2>)[\s\S]*?(?=\s*<div class="card">\s*<h2>Question Tracker<\/h2>)/;
if (!levelCardRegex.test(dashBodyHTML)) {
  throw new Error('Could not locate the level tracker markup.');
}
dashBodyHTML = dashBodyHTML.replace(levelCardRegex, `$1
        <div class="level-progress">
          <div class="level-progress-head">
            <div>
              <span class="level-eyebrow">CURRENT LEVEL</span>
              <div class="level-number">Level <strong id="levelNumber">1</strong></div>
            </div>
            <div class="level-total-xp"><strong id="levelTotalXP">0</strong><span>Total XP</span></div>
          </div>
          <div class="level-progress-copy">
            <span id="levelMessage">Just getting started</span>
            <span id="levelXPRemaining">100 XP to next level</span>
          </div>
          <div class="bar"><i id="levelProgressBar" style="width:0"></i></div>
        </div>
      </div>
      `);

// Update nav in dashBodyHTML
const navReplacement = `<nav id="nav">
      <button class="on" id="navHome" onclick="window.showHome()"><span class="i"><svg><use href="#i-home"/></svg></span>Home</button>
      <button id="navQuestions" onclick="window.showChapterwise()"><span class="i"><svg><use href="#i-qs"/></svg></span>Questions<span class="chev">▾</span></button>
      <button id="navSubject" onclick="window.showSubjectwise()"><span class="i"><svg><use href="#i-atom"/></svg></span>Subject Practice</button>
      <button id="navNotes" onclick="window.showPocketNotes()"><span class="i"><svg><use href="#i-notes"/></svg></span>Notes</button>
      <button id="navTodo" onclick="window.showTodo()"><span class="i"><svg><use href="#i-todo"/></svg></span>To-Do List</button>
      <button id="navSpin" type="button" onclick="window.showSpinWheel()"><span class="i"><svg><use href="#i-cubes"/></svg></span>Spin a Chapter</button>
      <button id="navTreasure" onclick="window.showTreasureBox()"><span class="i"><svg><use href="#i-box"/></svg></span>Treasure Box</button>
      <button id="navProfile" onclick="window.showProfile()"><span class="i"><svg><use href="#i-user"/></svg></span>Profile</button>
    </nav>`;

if (!/<nav id="nav">[\s\S]*?<\/nav>/.test(dashBodyHTML)) {
  throw new Error('Could not locate the dashboard navigation.');
}
dashBodyHTML = dashBodyHTML.replace(/<nav id="nav">[\s\S]*?<\/nav>/, navReplacement);
const settingsRow = '      <div class="row"><span><svg><use href="#i-gear"/></svg></span>Settings</div>\n';
if (!dashBodyHTML.includes(settingsRow)) {
  throw new Error('Could not locate the sidebar Settings option.');
}
dashBodyHTML = dashBodyHTML.replace(settingsRow, '');

// Inject dashboardAdditions before </main> in dashBodyHTML
const mainCloseIdx = dashBodyHTML.lastIndexOf('</main>');
dashBodyHTML = dashBodyHTML.slice(0, mainCloseIdx) + '\n' + dashboardAdditions + '\n' + dashBodyHTML.slice(mainCloseIdx);

const pocketNotesPath = path.join(__dirname, '..', 'jee   2027 reg', 'pocket_notes.html');
if (!fs.existsSync(pocketNotesPath)) {
  throw new Error(`Pocket Notes page not found at ${pocketNotesPath}`);
}
const pocketNotesHTML = fs.readFileSync(pocketNotesPath, 'utf8');
const pocketNotesSrcdoc = pocketNotesHTML
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
dashBodyHTML = dashBodyHTML.replace(
  '<iframe id="pocketNotesFrame" title="Pocket Notes" srcdoc=""></iframe>',
  `<iframe id="pocketNotesFrame" title="Pocket Notes" srcdoc="${pocketNotesSrcdoc}"></iframe>`
);

const plannerPath = path.join(__dirname, '..', 'jee   2027 reg', 'plan-notebook-window.html');
if (!fs.existsSync(plannerPath)) {
  throw new Error(`Study planner page not found at ${plannerPath}`);
}
const plannerHTML = fs.readFileSync(plannerPath, 'utf8');
const plannerSrcdoc = plannerHTML
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
dashBodyHTML = dashBodyHTML.replace(
  '<iframe id="todoPlannerFrame" title="Study Planner" srcdoc=""></iframe>',
  `<iframe id="todoPlannerFrame" title="Study Planner" srcdoc="${plannerSrcdoc}"></iframe>`
);
const todayPlanRegex = /      <div class="card plan">[\s\S]*?      <\/div>\r?\n(?=      <div class="card perf">)/;
if (!todayPlanRegex.test(dashBodyHTML)) {
  throw new Error('Could not locate the dashboard Today’s Plan card.');
}
dashBodyHTML = dashBodyHTML.replace(todayPlanRegex, '');

const dashboardBottomCardsRegex = /    <section class="home-only bot">[\s\S]*?    <\/section>/;
if (!dashboardBottomCardsRegex.test(dashBodyHTML)) {
  throw new Error('Could not locate the dashboard Treasure Box and performance cards.');
}
dashBodyHTML = dashBodyHTML.replace(dashboardBottomCardsRegex, '');

// Extract dashboard script from dsrc
const dashScriptStart = scriptStartInDsrc + 8;
const dashScriptEnd = dsrcRaw.indexOf('<\\/script>');
let dashScript = dsrcRaw.substring(dashScriptStart, dashScriptEnd).trim();

const performanceChartScriptRegex = /const data=\{[^\r\n]*\};\s*function draw\(k\)\{[\s\S]*?\n\}\s*draw\('1W'\);\s*document\.getElementById\('tabs'\)\.addEventListener\('click',[\s\S]*?\n\}\);/;
if (!performanceChartScriptRegex.test(dashScript)) {
  throw new Error('Could not locate the dashboard performance chart script.');
}
dashScript = dashScript.replace(performanceChartScriptRegex, '');

// Remove duplicate const $
dashScript = dashScript.replace('const $=s=>document.querySelector(s);', '// const $ already declared');
dashScript = dashScript.replace(
  `  $('#planList').innerHTML=T.slice(0,3).map(t=>\`<button class="task \${t.d?'done':''}" data-id="\${t.id}"><span class="bx"></span>\${esc(t.t)}</button>\`).join('')||'<p class="empty">No tasks yet. Add one in your To-Do List.</p>';`,
  `  const planList=$('#planList');\n  if(planList)planList.innerHTML=T.slice(0,3).map(t=>\`<button class="task \${t.d?'done':''}" data-id="\${t.id}"><span class="bx"></span>\${esc(t.t)}</button>\`).join('')||'<p class="empty">No tasks yet. Add one in your To-Do List.</p>';`
);
dashScript = dashScript.replace(
  `  $('#count').textContent=T.length+(T.length===1?' task':' tasks');`,
  `  const taskCount=$('#count');\n  if(taskCount)taskCount.textContent=T.length+(T.length===1?' task':' tasks');`
);

// Update goTodo and nav listeners in dashScript
const goTodoTarget = `function goTodo(){$('main').classList.add('todo');document.querySelectorAll('#nav button').forEach((b,i)=>b.classList.toggle('on',i===3))}`;
const goTodoReplacement = `function goTodo(){
  const m = document.querySelector('#dash main');
  if (m) {
    m.classList.remove('chapter-mode', 'subject-mode', 'mock-mode', 'quiz-mode', 'result-mode', 'notes-mode');
    m.classList.add('todo');
  }
  document.querySelectorAll('#nav button').forEach(b => {
    b.classList.toggle('on', b.textContent.trim() === 'To-Do List');
  });
}
window.goTodo = goTodo;`;

dashScript = dashScript.replace(goTodoTarget, goTodoReplacement);

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

dashScript = dashScript.replace(navListenTarget, navListenReplacement);

const initUserRegex = /window\.initUser=function\(p\)\{[\s\S]*?\n\};/;
if (!initUserRegex.test(dashScript)) {
  throw new Error('Could not locate dashboard user initialization logic.');
}
dashScript = dashScript.replace(initUserRegex, `window.initUser=function(p){
  const now=new Date(),examDate=new Date(p.date+'T00:00:00'),heading=document.querySelector('#dash main header h1');
  if(!heading)throw new Error('Dashboard greeting is missing.');
  heading.firstChild.nodeValue='Good '+(now.getHours()<12?'Morning':now.getHours()<17?'Afternoon':'Evening')+', ';
  heading.querySelector('b').textContent=p.username+'!';
  document.querySelector('#dash .av').textContent=p.username[0].toUpperCase();
  document.querySelector('#dash .exam h3').textContent=p.exam+' '+examDate.getFullYear();
  document.querySelector('#dash .exam small').textContent='('+examDate.toLocaleDateString('en-US',{month:'short',year:'numeric'})+')';
  const days=Math.max(0,Math.round((Date.UTC(examDate.getFullYear(),examDate.getMonth(),examDate.getDate())-Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()))/86400000));
  document.querySelector('#dash .exam .big em').textContent=days;
  const goalEl=document.getElementById('goal');
  if(goalEl)goalEl.textContent='Goal: '+p.qpd+' questions a day, about '+(days*p.qpd).toLocaleString('en-IN')+' by exam day';
  KEY='jeenius.tasks.v2.'+p.username.toLowerCase();
  try{T=JSON.parse(localStorage.getItem(KEY))}catch(e){T=null}
  if(!Array.isArray(T))T=[];
  render();
  const plannerFrame=document.getElementById('todoPlannerFrame');
  if(plannerFrame){
    const syncPlannerExam=()=>plannerFrame.contentWindow.postMessage({type:'jeenius-exam-date',exam:p.exam,date:p.date},'*');
    plannerFrame.addEventListener('load',syncPlannerExam,{once:true});
    syncPlannerExam();
  }
};`);

// Extract outer HTML and script
const dashDivIdx = orig.indexOf('<div id="dash"');
let outerHeadAndStage = orig.substring(0, dashDivIdx);
const splashLogoTag = /(<img class="logo" src=")[^"]+(" alt="JEEnius logo">)/;
if (!splashLogoTag.test(outerHeadAndStage)) {
  throw new Error('Could not locate the splash-page logo image.');
}
outerHeadAndStage = outerHeadAndStage.replace(splashLogoTag, `$1${logoDataURI}$2`);
const dashboardLogoTag = /(<div class="crest"><img src=")[^"]+(" alt="JEEnius logo"><\/div>)/;
if (!dashboardLogoTag.test(dashBodyHTML)) {
  throw new Error('Could not locate the dashboard logo image.');
}
dashBodyHTML = dashBodyHTML.replace(dashboardLogoTag, `$1${logoDataURI}$2`);

const afterDsrcIdx = orig.indexOf('</script>', dsrcStart) + 9;
let outerScriptRaw = orig.substring(afterDsrcIdx).trim();

const outerScriptStart = outerScriptRaw.indexOf('<script>') + 8;
const outerScriptEnd = outerScriptRaw.indexOf('</script>');
let outerScript = outerScriptRaw.substring(outerScriptStart, outerScriptEnd).trim();
outerScript += `
const dashboardTourSteps = [
  {
    selector: '#dash .study-exam-panel:not(.study-exam-advanced) .study-exam-actions',
    title: 'Choose your test type',
    description: 'Choose JEE Main or JEE Advanced, then build Subject-wise or Chapter-wise practice and custom mock tests from the available question banks.'
  },
  {
    selector: '#dash .spin-dashboard',
    title: 'Spin for a chapter',
    description: 'Choose JEE Main or JEE Advanced, then spin the wheel to pick one of 10 chapters across Physics, Chemistry, and Mathematics. Set your question count and time to start a focused test.'
  },
  {
    selector: '#notesView .notes-frame-wrap',
    view: 'notes',
    title: 'Explore Pocket Notes',
    description: 'Pocket Notes opens a workspace with a Formula Vault, searchable notes, and a drawing canvas. Write or sketch, add notes to the canvas, then save them or export your work as a PNG.'
  },
  {
    selector: '#todoPlannerView .todo-planner-frame-wrap',
    view: 'todo',
    title: 'Explore your To-Do List',
    description: 'The To-Do List opens your study planner. Add a task or exam, choose a date, time, and subject, set reminders, and switch between Day, Week, and Month views to track your plan.'
  },
  {
    selector: '#dash #navTreasure',
    title: 'Review your mistakes',
    description: 'Treasure Box saves questions you get wrong, so you can revisit them and practice similar questions.'
  },
  {
    selector: '#dash .level-progress',
    title: 'Build your level and XP',
    description: 'Earn XP as you complete practice. Your level, total XP, and progress toward the next level are tracked here.'
  },
  {
    selector: null,
    title: 'You’re ready to go',
    description: 'That’s your JEEnius dashboard. Explore at your own pace and start practicing whenever you’re ready.'
  }
];
let dashboardTourIndex = 0;
let dashboardTourUser = '';
let dashboardTourView = 'home';
const dashboardTour = document.getElementById('dashboardTour');
const dashboardTourCard = dashboardTour && dashboardTour.querySelector('.tour-card');
const dashboardTourBackdrop = dashboardTour && dashboardTour.querySelector('.tour-backdrop');
const dashboardTourSpotlight = dashboardTour && dashboardTour.querySelector('.tour-spotlight');

function positionDashboardTour() {
  if (!dashboardTour || !dashboardTour.classList.contains('visible')) return;
  const step = dashboardTourSteps[dashboardTourIndex];
  const target = step.selector ? document.querySelector(step.selector) : null;
  dashboardTour.classList.toggle('has-target', Boolean(target));
  if (target) {
    target.scrollIntoView({ block: 'center', inline: 'nearest' });
    const rect = target.getBoundingClientRect();
    const padding = 8;
    const left = Math.max(4, rect.left - padding);
    const top = Math.max(4, rect.top - padding);
    const right = Math.min(window.innerWidth - 4, rect.right + padding);
    const bottom = Math.min(window.innerHeight - 4, rect.bottom + padding);
    const leftX = (left / window.innerWidth * 100).toFixed(3) + '%';
    const rightX = (right / window.innerWidth * 100).toFixed(3) + '%';
    const topY = (top / window.innerHeight * 100).toFixed(3) + '%';
    const bottomY = (bottom / window.innerHeight * 100).toFixed(3) + '%';
    dashboardTourBackdrop.style.clipPath = \`polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, \${leftX} \${topY}, \${rightX} \${topY}, \${rightX} \${bottomY}, \${leftX} \${bottomY}, \${leftX} \${topY})\`;
    dashboardTourSpotlight.style.left = left + 'px';
    dashboardTourSpotlight.style.top = top + 'px';
    dashboardTourSpotlight.style.width = Math.max(0, right - left) + 'px';
    dashboardTourSpotlight.style.height = Math.max(0, bottom - top) + 'px';
  } else {
    dashboardTourBackdrop.style.clipPath = 'none';
  }

  dashboardTourCard.classList.toggle('centered', !target);
  if (!target) {
    dashboardTourCard.style.left = '50%';
    dashboardTourCard.style.top = '50%';
    dashboardTourCard.style.transform = 'translate(-50%, -50%)';
    return;
  }

  dashboardTourCard.style.transform = 'none';
  const cardRect = dashboardTourCard.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const cardLeft = Math.min(Math.max(16, rect.left + rect.width / 2 - cardRect.width / 2), window.innerWidth - cardRect.width - 16);
  let cardTop = rect.bottom + 18;
  if (cardTop + cardRect.height > window.innerHeight - 8) {
    const aboveTarget = rect.top - cardRect.height - 8;
    if (aboveTarget >= 8) cardTop = aboveTarget;
    else if (rect.bottom + cardRect.height + 8 <= window.innerHeight - 8) cardTop = rect.bottom + 8;
    else cardTop = Math.max(8, (window.innerHeight - cardRect.height) / 2);
  }
  dashboardTourCard.style.left = cardLeft + 'px';
  dashboardTourCard.style.top = cardTop + 'px';
}

function showDashboardTourStep() {
  const step = dashboardTourSteps[dashboardTourIndex];
  const nextView = step.view || 'home';
  if (nextView !== dashboardTourView) {
    if (nextView === 'notes') window.showPocketNotes();
    else if (nextView === 'todo') window.showTodo();
    else window.showHome();
    dashboardTourView = nextView;
  }
  const finalStep = dashboardTourIndex === dashboardTourSteps.length - 1;
  dashboardTour.querySelector('.tour-step').textContent = finalStep
    ? 'WELCOME TO JEENIUS'
    : 'GETTING STARTED • ' + (dashboardTourIndex + 1) + ' OF ' + (dashboardTourSteps.length - 1);
  dashboardTour.querySelector('#tour-title').textContent = step.title;
  dashboardTour.querySelector('#tour-copy').textContent = step.description;
  dashboardTour.querySelector('.tour-back-button').disabled = dashboardTourIndex === 0;
  dashboardTour.querySelector('.tour-next').textContent = finalStep ? 'Enter dashboard' : 'Next';
  positionDashboardTour();
}

function finishDashboardTour() {
  const storageKey = 'jeenius.dashboardTour.v1.' + dashboardTourUser.trim().toLowerCase();
  try {
    localStorage.setItem(storageKey, 'complete');
  } catch (error) {
    console.error('Unable to save dashboard tour completion:', error);
  }
  if (dashboardTourView !== 'home') window.showHome();
  dashboardTourView = 'home';
  const firstPracticeAction = document.querySelector('#dash .study-exam-panel:not(.study-exam-advanced) button');
  if (firstPracticeAction) firstPracticeAction.focus({ preventScroll: true });
  dashboardTour.classList.remove('visible', 'has-target');
  dashboardTour.setAttribute('aria-hidden', 'true');
}

window.startDashboardTour = function(username) {
  dashboardTourUser = String(username || 'student');
  const storageKey = 'jeenius.dashboardTour.v1.' + dashboardTourUser.trim().toLowerCase();
  try {
    if (localStorage.getItem(storageKey) === 'complete') return;
  } catch (error) {
    console.error('Unable to check dashboard tour completion:', error);
  }
  dashboardTourIndex = 0;
  dashboardTourView = 'home';
  dashboardTour.setAttribute('aria-hidden', 'false');
  dashboardTour.classList.add('visible');
  showDashboardTourStep();
  dashboardTour.querySelector('.tour-next').focus();
};

dashboardTour.querySelector('.tour-next').addEventListener('click', () => {
  if (dashboardTourIndex >= dashboardTourSteps.length - 1) {
    finishDashboardTour();
    return;
  }
  dashboardTourIndex++;
  showDashboardTourStep();
  dashboardTour.querySelector('.tour-next').focus();
});
dashboardTour.querySelector('.tour-back-button').addEventListener('click', () => {
  if (dashboardTourIndex === 0) return;
  dashboardTourIndex--;
  showDashboardTourStep();
  dashboardTour.querySelector('.tour-back-button').focus();
});
window.addEventListener('resize', positionDashboardTour);
window.addEventListener('keydown', event => {
  if (!dashboardTour.classList.contains('visible')) return;
  if (event.key === 'ArrowRight') dashboardTour.querySelector('.tour-next').click();
  else if (event.key === 'ArrowLeft') dashboardTour.querySelector('.tour-back-button').click();
});
`;

// Update openDash in outerScript
const openDashRegex = /function openDash\(p\)\{[\s\S]*?\n\}/;
const openDashReplacement = `function openDash(p){
  $('#fx').style.display='none';
  $('#dash').classList.add('show');
  if (typeof window.initUser === 'function') {
    window.initUser(p);
  }
  window.setTimeout(() => window.startDashboardTour(p && p.username), 850);
}
window.openDash = openDash;
`;

outerScript = outerScript.replace(openDashRegex, openDashReplacement);

// In outerHeadAndStage, inject styles
const outerStyleEnd = outerHeadAndStage.indexOf('</style>');
const combinedStyles = `
/* Embedded Dashboard Styles */
${dashStyles}

/* Use a quiet gradient backdrop and subtle 3D logo motion for the intro. */
#fx {
  display: none;
}

#intro {
  isolation: isolate;
}

#intro::before {
  content: "";
  position: fixed;
  z-index: -1;
  inset: -20%;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 30% 45%, rgba(245,179,53,.17), transparent 34%),
    radial-gradient(ellipse at 72% 54%, rgba(59,140,240,.16), transparent 38%),
    linear-gradient(118deg, #030711 10%, #07101f 48%, #040812 88%);
  background-size: 130% 130%;
  animation: introAurora 18s ease-in-out infinite alternate;
}

#intro .halo,
#intro .ring,
#intro .pulse,
#intro .orbit {
  display: none;
}

#intro .logo-wrap {
  width: min(88vw, 78vh, 560px);
  aspect-ratio: 2.2;
  perspective: 1000px;
  transform-style: preserve-3d;
}

#intro .core {
  border-radius: 0;
  overflow: visible;
  animation: premiumFloat 7s ease-in-out infinite 2s;
}

#intro .logo {
  display: block;
  animation: none;
  transform: translateZ(24px);
  filter: drop-shadow(0 18px 22px rgba(0,0,0,.32));
  backface-visibility: hidden;
  object-fit: contain;
  mix-blend-mode: normal;
}

@keyframes introAurora {
  from { transform: translate3d(-2%, 1%, 0) scale(1); }
  to { transform: translate3d(2%, -1%, 0) scale(1.05); }
}

@keyframes premiumFloat {
  0%, 100% { transform: translateY(0) rotateX(0) rotateY(0) scale(1); }
  25% { transform: translateY(-4px) rotateX(1.5deg) rotateY(-2deg) scale(1.005); }
  75% { transform: translateY(-7px) rotateX(-1deg) rotateY(2deg) scale(1.008); }
}

.dashboard-tour {
  position: fixed;
  z-index: 99999;
  inset: 0;
  display: none;
  color: #f8fafc;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.dashboard-tour.visible {
  display: block;
}

.tour-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(3, 8, 20, .58);
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
}

.tour-spotlight {
  position: fixed;
  display: none;
  border: 1px solid rgba(255, 207, 112, .95);
  border-radius: 14px;
  box-shadow: 0 0 0 5px rgba(245, 179, 53, .16), 0 0 36px rgba(245, 179, 53, .24);
  pointer-events: none;
  transition: left .25s ease, top .25s ease, width .25s ease, height .25s ease;
}

.dashboard-tour.has-target .tour-spotlight {
  display: block;
}

.tour-card {
  position: fixed;
  width: min(390px, calc(100vw - 32px));
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 18px;
  background: linear-gradient(145deg, #13213a, #081323);
  box-shadow: 0 22px 70px rgba(0, 0, 0, .55), inset 0 1px rgba(255, 255, 255, .08);
}

.tour-card .tour-step {
  margin-bottom: 8px;
  color: #f5b335;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.tour-card h2 {
  margin: 0 0 8px;
  font-size: 21px;
  line-height: 1.3;
}

.tour-card p {
  margin: 0;
  color: #c3cde0;
  font-size: 14px;
  line-height: 1.6;
}

.tour-card .tour-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.tour-card button {
  min-height: 40px;
  padding: 9px 14px;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 10px;
  color: #e7edf7;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.tour-card .tour-next {
  border-color: #f5b335;
  background: linear-gradient(110deg, #ffd479, #f5b335 55%, #d98c10);
  color: #1a1100;
}

.tour-card .tour-back-button:disabled {
  opacity: .4;
  cursor: default;
}

@media (max-width: 600px) {
  .tour-card {
    padding: 18px;
  }
}

:root[data-theme="light"] .dashboard-tour .tour-card {
  color: #f8fafc;
}

@media (prefers-reduced-motion: reduce) {
  .tour-spotlight { transition: none; }
}

/* Embedded Quiz & Practice Styles */
${quizStyles}

/* Direct Dashboard Container */
#dash {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: none;
  background: var(--bg, #050b18);
  overflow-y: auto;
  overflow-x: hidden;
}
#dash.show {
  display: block;
}
.tile * {
  pointer-events: none;
}
.bot {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.bot > :first-child {
  grid-column: auto;
}
@media (max-width: 820px) {
  .bot {
    grid-template-columns: 1fr;
  }
}
`;

outerHeadAndStage = outerHeadAndStage.slice(0, outerStyleEnd) + '\n' + combinedStyles + '\n' + outerHeadAndStage.slice(outerStyleEnd);

// Add direct demo button on welcome screen
const nextBtnTarget = '<button id="next">Get Started &rarr;</button>';
if (outerHeadAndStage.includes(nextBtnTarget)) {
  outerHeadAndStage = outerHeadAndStage.replace(nextBtnTarget, `
    <button id="next">Get Started &rarr;</button>
    <button id="directDash" style="margin-top:10px;padding:10px 24px;border-radius:24px;border:1px solid rgba(245,179,53,0.4);background:rgba(245,179,53,0.12);color:var(--gold);font:600 13px inherit;cursor:pointer;transition:all .2s;">Open Dashboard Directly &rarr;</button>
  `);
}

// Build the complete combined HTML
const finalHTML = `${outerHeadAndStage.trim()}

<div id="dash" aria-label="JEEnius dashboard">
${dashBodyHTML}
</div>
<div id="dashboardTour" class="dashboard-tour" aria-hidden="true">
  <div class="tour-backdrop"></div>
  <div class="tour-spotlight" aria-hidden="true"></div>
  <section class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-copy">
    <div class="tour-step">GETTING STARTED</div>
    <h2 id="tour-title"></h2>
    <p id="tour-copy"></p>
    <div class="tour-actions">
      <div>
        <button class="tour-back-button" type="button">Back</button>
        <button class="tour-next" type="button">Next</button>
      </div>
    </div>
  </section>
</div>

<script>
// --- Outer & Landing Logic ---
${outerScript}

// --- Dashboard Logic ---
${dashScript}

// --- Quiz & Chapter Practice System ---
${quizClientJS}

// Direct dashboard demo trigger
const dDashBtn = document.getElementById('directDash');
if (dDashBtn) {
  dDashBtn.addEventListener('click', () => {
    openDash({ username: 'JEEnius Aspirant', exam: 'JEE Main', qpd: 50, date: '2027-01-21' });
  });
}
</script>
</body>
</html>
`;

console.log('Validating finalHTML script syntax...');
const scriptMatches = [...finalHTML.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
console.log('Script blocks count in finalHTML:', scriptMatches.length);

let allValid = true;
scriptMatches.forEach((m, idx) => {
  try {
    new vm.Script(m[1]);
    console.log(`Script block ${idx + 1} (${m[1].length} chars): Syntax OK`);
  } catch (err) {
    allValid = false;
    console.error(`Script block ${idx + 1} Syntax ERROR:`, err.message);
    const lines = m[1].split('\n');
    if (err.stack) {
      console.error(err.stack.split('\n').slice(0, 5).join('\n'));
    }
  }
});

if (allValid) {
  fs.writeFileSync('C:/Users/thris/OneDrive/Desktop/JEEnius/jeenius.html', finalHTML, 'utf8');
  fs.writeFileSync('C:/Users/thris/OneDrive/Desktop/JEEnius/index.html', finalHTML, 'utf8');
  console.log('Successfully written jeenius.html and index.html!');
} else {
  console.error('Validation FAILED!');
}
