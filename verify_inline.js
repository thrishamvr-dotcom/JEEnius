const fs = require('fs');
const vm = require('vm');
const advancedData = require('./advanced_data.json');

const html = fs.readFileSync('jeenius.html', 'utf8');
const logoDataURI = `data:image/png;base64,${fs.readFileSync('jeenius-logo.png').toString('base64')}`;
const logoOccurrences = html.split(logoDataURI).length - 1;
const suppliedLogosEmbedded = logoOccurrences === 2;
console.log(`Supplied logo embedded on splash and dashboard: ${suppliedLogosEmbedded ? 'OK' : 'FAIL'}`);
if (!suppliedLogosEmbedded) process.exitCode = 1;
const advancedQuestionCount = Object.values(advancedData)
  .reduce((total, chapters) => total + chapters.reduce((chapterTotal, chapter) => chapterTotal + chapter.questions.length, 0), 0);
const advancedBankValid = advancedQuestionCount === 150 &&
  Object.values(advancedData).every(chapters => chapters.length === 5 && chapters.every(chapter =>
    chapter.questions.length === 10 && chapter.questions.every(question => question.q && question.exp)
  ));
console.log(`Advanced PDF question bank (150 questions): ${advancedBankValid ? 'OK' : 'FAIL'}`);
if (!advancedBankValid) process.exitCode = 1;

const checks = [
  'id="btnChapterwise"',
  'onclick="window.showChapterwise()"',
  'id="btnSubjectwise"',
  'onclick="window.showSubjectwise()"',
  'study-exam-panels',
  '<h3>JEE Main</h3>',
  '<h3>JEE Advanced</h3>',
  'id="btnAdvancedSubjectwise"',
  'id="btnAdvancedChapterwise"',
  'id="btnAdvancedMockMode"',
  '150 questions from your Advanced practice set.',
  'study-resources',
  'class="home-only spin-dashboard"',
  'id="spinDashboardTitle"',
  'id="chapterSpinWheel"',
  'Wheel with 10 chapters from all three subjects',
  'id="spinExamSelect"',
  'id="spinQuestionCount"',
  'id="spinDuration"',
  'id="btnStartSpinTest"',
  'function spinForChapter()',
  'function startSpinChapterQuiz()',
  'window.showSpinWheel',
  'spinItems.length < 10',
  'new MutationObserver(drawChapterSpinWheel)',
  'id="navQuestions"',
  'id="navSubject"',
  'id="navSpin"',
  'onclick="window.showSpinWheel()"',
  'b.id === \'navSpin\'',
  'id="chapterView"',
  'id="subjectView"',
  'id="chapterQuizChapters"',
  'id="chapterQuizSelectAll"',
  'id="chapterQuizClearAll"',
  'id="chapterQuizCount"',
  'id="chapterQuizDuration"',
  'id="btnGenerateChapterQuiz"',
  'id="subjectQuizSubject"',
  'id="subjectQuizChapters"',
  'id="subjectQuizSelectAll"',
  'id="subjectQuizClearAll"',
  'id="subjectQuizCount"',
  'id="subjectQuizDuration"',
  'id="btnGenerateSubjectQuiz"',
  'Select at least one chapter to generate your quiz.',
  'function renderQuizBuilderChapters(mode)',
  'data-builder-subject-toggle=',
  'data-builder-chapter=',
  'chapterId: chapter.id',
  'getSelectedQuizChapters(mode)',
  'Choose a time limit between 1 and 300 minutes.',
  'function startConfiguredQuiz(mode)',
  'id="btnMockMode"',
  'id="mockView"',
  'id="notesView"',
  'id="pocketNotesFrame"',
  'srcdoc="&lt;!DOCTYPE html&gt;',
  '&lt;title&gt;Pocket Notes — Draw &amp; Write&lt;/title&gt;',
  'id="navTodo"',
  'id="todoPlannerView"',
  'id="todoPlannerFrame"',
  '&lt;title&gt;Study planner&lt;/title&gt;',
  'id="navTreasure"',
  'id="treasureView"',
  'id="treasureList"',
  'function recordWrongQuestions(questions)',
  'function renderTreasureBox()',
  'Practice similar questions',
  'data-practice-treasure="${index}"',
  'window.showTreasureBox',
  'id="navProfile"',
  'id="profileView"',
  'id="profileDetails"',
  'id="dashboardTour"',
  'role="dialog"',
  'class="tour-back-button"',
  'class="tour-next"',
  'Choose your test type',
  '#dash .study-exam-panel:not(.study-exam-advanced) .study-exam-actions',
  "target.scrollIntoView({ block: 'center', inline: 'nearest' });",
  'Spin for a chapter',
  '#dash .spin-dashboard',
  'spin the wheel to pick one of 10 chapters',
  'Explore Pocket Notes',
  "view: 'notes'",
  '#notesView .notes-frame-wrap',
  'Formula Vault, searchable notes, and a drawing canvas',
  'export your work as a PNG',
  'Explore your To-Do List',
  "view: 'todo'",
  '#todoPlannerView .todo-planner-frame-wrap',
  'Add a task or exam, choose a date, time, and subject',
  'switch between Day, Week, and Month views',
  "if (nextView === 'notes') window.showPocketNotes();",
  "else if (nextView === 'todo') window.showTodo();",
  'Review your mistakes',
  'Build your level and XP',
  'You’re ready to go',
  'jeenius.dashboardTour.v1.',
  'window.startDashboardTour(p && p.username)',
  "firstPracticeAction.focus({ preventScroll: true });",
  'backdrop-filter: blur(7px);',
  'polygon(evenodd,',
  'window.showProfile',
  'function renderProfile()',
  'Target exam',
  'Daily question goal',
  ':root[data-theme="light"] #dash .q-text',
  ':root[data-theme="light"] #dash .res-btn.secondary',
  '--card: var(--glass)',
  'color:var(--text);">Worked Solutions &amp; Explanations',
  'id=&quot;planNote&quot;',
  'id=&quot;ntForm&quot;',
  'id=&quot;ntBody&quot;',
  'window.showTodo',
  'type:\'jeenius-exam-date\'',
  '#fx {\n  display: none;',
  '#intro .halo,\n#intro .ring,\n#intro .pulse,\n#intro .orbit {\n  display: none;',
  '#intro .core {\n  border-radius: 0;\n  overflow: visible;\n  animation: premiumFloat 7s ease-in-out infinite 2s;',
  '@keyframes introAurora',
  'mix-blend-mode: normal;',
  '#dash .crest{width:180px;height:auto;aspect-ratio:2.2',
  'transform: translateZ(24px);',
  'rotateX(1.5deg) rotateY(-2deg)',
  'jeeExam={name:data.exam,date:data.date}',
  'plannerFrame.contentWindow.postMessage',
  'exam: dashboardProfile.exam',
  'id=&quot;ntQ&quot;',
  'let P=load(KEY,[])',
  'Your planner is empty. Add a task or an exam below to get started.',
  'Add your first task',
  'data-tool=&quot;line&quot;',
  'data-tool=&quot;rect&quot;',
  'data-tool=&quot;circle&quot;',
  'drawShape(drawingOrigin,end)',
  'function saveCurrentNote()',
  'if(!saveCurrentNote())return;',
  'id=&quot;recentNotes&quot;',
  'id=&quot;recentGrid&quot;',
  'const libraryKey=\'pocket-notes-library\'',
  'function renderRecentNotes()',
  'Open a note saved on this device.',
  'id=&quot;formulaVault&quot;',
  'id=&quot;formulaGrid&quot;',
  'data-formula-subject=&quot;Physics&quot;',
  'data-formula-subject=&quot;Chemistry&quot;',
  'data-formula-subject=&quot;Mathematics&quot;',
  'const formulas=[',
  'addEventListener(\'input\',renderFormulaVault)',
  'Add to note',
  'id="navNotes"',
  'onclick="window.showPocketNotes()"',
  'id="btnPocketNotes"',
  'id="mockChapters"',
  'id="mockSelectAllSubjects"',
  'id="mockClearAllSubjects"',
  'data-mock-subject="${sub}"',
  'data-mock-chapter="${ch.id}"',
  'Full Mock: All Subjects',
  'id="mockQuestionsPerSubject"',
  'id="mockIntegerPhysics"',
  'id="mockIntegerChemistry"',
  'id="mockIntegerMaths"',
  'class="mock-integer-section"',
  '<h4>Integer-answer questions</h4>',
  'data-mock-integer-hint="physics"',
  'data-mock-integer-hint="chemistry"',
  'data-mock-integer-hint="maths"',
  'id="mockDurationMinutes"',
  'qtDailyGoal',
  "Today\\'s question goal",
  'jeenius.progress.v1.',
  'renderLevelProgress',
  'renderExamDate',
  'class="level-progress"',
  'id="levelNumber"',
  'id="levelTotalXP"',
  'id="levelProgressBar"',
  'recordQuizProgress(reviewItems, xpGained)',
  'Questions per selected subject',
  'Enter your integer answer',
  'Enter your numerical answer',
  'Select all correct options.',
  'numericAnswer',
  'ADVANCED_CHAPTERS_DATA',
  'integerAnswer',
  'integerAnswer: getIntegerAnswer(question)',
  "type: 'integer'",
  'options: []',
  'questionsPerSubject',
  'id="quizView"',
  'id="quizSubjectMenu"',
  'data-quiz-subject="${escapeHTML(tab.key)}"',
  'subject: subject.sub',
  'id="resultView"',
  'window.showChapterwise',
  'window.showSubjectwise',
  'window.showMockBuilder',
  'window.showPocketNotes',
  'window.startChapterQuiz',
  'window.startSubjectQuiz',
  'window.startMockQuiz',
  'window.submitQuiz',
  'window.initUser',
  'window.openDash'
];

console.log('=== Element & Handler Verification ===');
let missing = 0;
const brickOverlayRemoved = !html.includes('brick-build') && !html.includes('brickJoin');
console.log(`${'Brick overlay removed'.padEnd(38)}: ${brickOverlayRemoved ? 'OK' : 'FAIL'}`);
if (!brickOverlayRemoved) missing++;
checks.forEach(c => {
  const ok = html.includes(c);
  console.log(`${c.padEnd(38)}: ${ok ? 'OK' : 'FAIL'}`);
  if (!ok) missing++;
});

const tourSkipRemoved =
  !html.includes('class="tour-skip"') &&
  !html.includes('Skip tour') &&
  !html.includes("if (event.key === 'Escape') finishDashboardTour();");
console.log(`${'Dashboard tour has no skip option'.padEnd(38)}: ${tourSkipRemoved ? 'OK' : 'FAIL'}`);
if (!tourSkipRemoved) missing++;

const levelCard = html.match(/<h2>Your Level<\/h2>([\s\S]*?)<\/div>\s*<div class="card">/);
const levelLogoRemoved = Boolean(levelCard && !levelCard[1].includes('class="ring"'));
console.log(`${'Level ring removed'.padEnd(38)}: ${levelLogoRemoved ? 'OK' : 'FAIL'}`);
if (!levelLogoRemoved) missing++;

const topDashboard = html.match(/<section class="home-only top">([\s\S]*?)<\/section>/);
const topCardCount = topDashboard ? (topDashboard[1].match(/<div class="card(?:\s|")/g) || []).length : 0;
const topGridValid = topCardCount === 3;
console.log(`${'Dashboard top grid (3 cards)'.padEnd(38)}: ${topGridValid ? 'OK' : 'FAIL'}`);
if (!topGridValid) missing++;

const todayPlanRemoved =
  !html.includes('class="card plan"') &&
  html.includes('if(planList)planList.innerHTML=') &&
  html.includes('if(taskCount)taskCount.textContent=');
console.log(`${'Today’s Plan card removed safely'.padEnd(38)}: ${todayPlanRemoved ? 'OK' : 'FAIL'}`);
if (!todayPlanRemoved) missing++;

const pocketNotesControlsRemoved =
  !html.includes('Attach a file or image') &&
  !html.includes('data-filter=&quot;archived&quot;') &&
  !html.includes('id=&quot;attachBtn&quot;') &&
  !html.includes('data-filter=&quot;pinned&quot;') &&
  !html.includes('id=&quot;pin&quot;');
console.log(`${'Attachment, Archived, and Pinned controls removed'.padEnd(48)}: ${pocketNotesControlsRemoved ? 'OK' : 'FAIL'}`);
if (!pocketNotesControlsRemoved) missing++;

const plannerStart = html.indexOf('&lt;title&gt;Study planner&lt;/title&gt;');
const plannerEnd = plannerStart < 0 ? -1 : html.indexOf('&lt;/html&gt;', plannerStart);
const plannerHTML = plannerStart < 0 || plannerEnd < 0 ? '' : html.slice(plannerStart, plannerEnd);
const plannerStartsEmpty =
  plannerHTML.length > 0 &&
  plannerHTML.includes('if(!Array.isArray(P))P=[];') &&
  plannerHTML.includes('const sampleTasks=') &&
  plannerHTML.includes('if(P.length===sampleTasks.length') &&
  plannerHTML.includes('Your planner is empty. Add a task or an exam below to get started.');
console.log(`${'Planner starts without sample tasks'.padEnd(48)}: ${plannerStartsEmpty ? 'OK' : 'FAIL'}`);
if (!plannerStartsEmpty) missing++;

const sidebarMatch = html.match(/<nav id="nav">([\s\S]*?)<\/nav>/);
const sidebarHasNoAnalytics = Boolean(sidebarMatch) && !sidebarMatch[1].includes('Analytics');
console.log(`${'Analytics removed from sidebar'.padEnd(48)}: ${sidebarHasNoAnalytics ? 'OK' : 'FAIL'}`);
if (!sidebarHasNoAnalytics) missing++;

const dashboardCardsRemoved =
  !html.includes('class="home-only bot"') &&
  !html.includes('class="card tb"') &&
  !html.includes('class="card perf"') &&
  !html.includes('<h2>Your Performance</h2>');
console.log(`${'Treasure Box and performance dashboard cards removed'.padEnd(48)}: ${dashboardCardsRemoved ? 'OK' : 'FAIL'}`);
if (!dashboardCardsRemoved) missing++;

const performanceChartScriptRemoved =
  !html.includes("document.getElementById('line').setAttribute") &&
  !html.includes("document.getElementById('tabs').addEventListener");
console.log(`${'Removed performance chart script'.padEnd(48)}: ${performanceChartScriptRemoved ? 'OK' : 'FAIL'}`);
if (!performanceChartScriptRemoved) missing++;

const sidebarSettingsRemoved = !html.includes('<div class="row"><span><svg><use href="#i-gear"/></svg></span>Settings</div>');
console.log(`${'Settings option removed'.padEnd(48)}: ${sidebarSettingsRemoved ? 'OK' : 'FAIL'}`);
if (!sidebarSettingsRemoved) missing++;

const sidebarLogoGapReduced = html.includes('.logo{text-align:center;margin-bottom:8px}') &&
  !html.includes('.logo{text-align:center;margin-bottom:22px}');
const sidebarLogoSizingFixed = html.includes('#dash .logo{width:auto;height:auto;animation:none;mix-blend-mode:normal;flex:none;justify-content:center}') &&
  html.includes('#dash .crest{width:180px;height:auto;aspect-ratio:2.2');
console.log(`${'Sidebar logo size and gap fixed'.padEnd(48)}: ${sidebarLogoGapReduced && sidebarLogoSizingFixed ? 'OK' : 'FAIL'}`);
if (!sidebarLogoGapReduced || !sidebarLogoSizingFixed) missing++;

// Verify script syntax
const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
console.log('\n=== Script Blocks Syntax Verification ===');
console.log('Total script blocks:', scriptMatches.length);
scriptMatches.forEach((m, idx) => {
  try {
    new vm.Script(m[1]);
    console.log(`Script block ${idx + 1} (${m[1].length} chars): Syntax VALID`);
  } catch (err) {
    console.error(`Script block ${idx + 1} Syntax ERROR:`, err.message);
    missing++;
  }
});

console.log(`\nVerification Result: ${missing === 0 ? 'ALL CHECKS PASSED (0 errors)' : missing + ' CHECKS FAILED'}`);
process.exit(missing === 0 ? 0 : 1);
