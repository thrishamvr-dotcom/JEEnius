const { CHAPTERS, getQuestions } = require('./qb_data.js');
const ADVANCED_DATA = require('./advanced_data.json');

// Export the complete client JS for the dashboard
const quizClientJS = `
// ==========================================
// Chapter-wise & Subject-wise Quiz System
// ==========================================
(function() {
  const CHAPTERS_DATA = ${JSON.stringify(CHAPTERS)};
  const ADVANCED_DATA = ${JSON.stringify(ADVANCED_DATA)};
  const ADVANCED_CHAPTERS_DATA = Object.fromEntries(
    Object.entries(ADVANCED_DATA).map(([subject, chapters]) => [
      subject,
      chapters.map(({ id, name }) => ({ id, name }))
    ])
  );
  let activeExam = 'main';

  const PHY_BASE = [
    { q: "A body has mass 2 kg and acceleration 3 m/s². Find the net force.", options: ["6 N", "5 N", "3 N", "3 N"], ans: "A", exp: "Newton's second law gives F = ma = 2 × 3 = 6 N." },
    { q: "A particle starts from rest and accelerates uniformly at 3 m/s² for 2 s. Its displacement is:", options: ["6 m", "12 m", "3 m", "24 m"], ans: "B", exp: "Using s = ut + ½at² with u = 0: s = ½ × 3 × (2)² = 6 m." },
    { q: "A 4 Ω resistor carries a current of 2 A. The potential difference is:", options: ["8 V", "2 V", "6 V", "16 V"], ans: "A", exp: "By Ohm's law, V = IR = 2 × 4 = 8 V." },
    { q: "A point mass of 5 kg is placed 5 m from an axis. Its moment of inertia is:", options: ["125 kg m²", "25 kg m²", "10 kg m²", "5 kg m²"], ans: "A", exp: "For a point mass, I = mr² = 5 × 5² = 125 kg m²." },
    { q: "A convex lens has focal length 60 cm. An object is placed at 2f. The image forms at:", options: ["120 cm", "60 cm", "30 cm", "Infinity"], ans: "A", exp: "For an object at 2f of a convex lens, the real image forms at 2f." }
  ];

  const CHM_EASY_BASE = [
    { q: "The number of moles in 18 g of water (molar mass 18 g mol⁻¹) is:", options: ["1 mol", "0.5 mol", "2 mol", "18 mol"], ans: "A", exp: "n = mass / molar mass = 18 / 18 = 1 mol." },
    { q: "Which quantum number determines the shape of an orbital?", options: ["Azimuthal quantum number (l)", "Principal quantum number (n)", "Magnetic quantum number (m)", "Spin quantum number"], ans: "A", exp: "The azimuthal quantum number l determines the subshell and orbital shape." },
    { q: "Across a period, the general trend in atomic radius is:", options: ["Decreases", "Increases", "Remains constant", "Changes randomly"], ans: "A", exp: "Effective nuclear charge generally increases across a period, pulling electrons closer." },
    { q: "The molecular shape of NH₃ is:", options: ["Trigonal pyramidal", "Trigonal planar", "Linear", "Tetrahedral"], ans: "A", exp: "NH₃ has three bond pairs and one lone pair; its molecular shape is trigonal pyramidal." },
    { q: "For a first-order reaction, the half-life is:", options: ["0.693/k", "k/0.693", "1/k²", "2.303k"], ans: "A", exp: "For first-order kinetics, t½ = ln 2 / k = 0.693/k." }
  ];

  const CHM_MED_HARD_BASE = [
    { q: "The number of moles in 36 g of water (molar mass 18 g mol⁻¹) is:", options: ["2 mol", "1 mol", "4 mol", "36 mol"], ans: "A", exp: "n = mass / molar mass = 36 / 18 = 2 mol." },
    CHM_EASY_BASE[1],
    CHM_EASY_BASE[2],
    CHM_EASY_BASE[3],
    CHM_EASY_BASE[4]
  ];

  const MATH_BASE = [
    { q: "The derivative of x² at x=2 is:", options: ["4", "4", "2", "8"], ans: "A", exp: "d(x²)/dx = 2x; at x=2, the value is 4." },
    { q: "The value of lim(x→0) sin x / x is:", options: ["1", "0", "−1", "∞"], ans: "A", exp: "This standard trigonometric limit equals 1 when x is in radians." },
    { q: "The sum of the first 4 positive integers is:", options: ["10", "16", "6", "8"], ans: "A", exp: "Sum = n(n+1)/2 = 4 × 5 / 2 = 10." },
    { q: "The determinant of [[a, b], [c, d]] is:", options: ["ad − bc", "ad + bc", "ab − cd", "ac − bd"], ans: "A", exp: "For a 2×2 matrix, determinant = ad − bc." },
    { q: "If two non-zero vectors are perpendicular, their dot product is:", options: ["0", "1", "−1", "Product of magnitudes"], ans: "A", exp: "a · b = |a||b| cos θ; for θ = 90°, cos θ = 0." }
  ];

  function getQuestionsForChapter(sub, chId) {
    const list = [];
    const diffs = ['Easy', 'Medium', 'Hard'];
    for (let d = 0; d < 3; d++) {
      const diff = diffs[d];
      for (let i = 0; i < 5; i++) {
        let b;
        if (sub === 'physics') b = PHY_BASE[i];
        else if (sub === 'chemistry') b = (d === 0) ? CHM_EASY_BASE[i] : CHM_MED_HARD_BASE[i];
        else b = MATH_BASE[i];
        list.push({
          num: list.length + 1,
          diff: diff,
          q: b.q,
          options: [...b.options],
          ans: b.ans,
          exp: b.exp
        });
      }
    }
    return list;
  }

  function getActiveChaptersData() {
    return getChaptersForExam(activeExam);
  }

  function setActiveExam(exam) {
    if (activeExam !== exam) {
      quizBuilderSelections.chapter.clear();
      quizBuilderSelections.subject.clear();
      const mockChapters = document.getElementById('mockChapters');
      if (mockChapters) mockChapters.innerHTML = '';
    }
    activeExam = exam;
  }

  function getChaptersForExam(exam) {
    return exam === 'advanced' ? ADVANCED_CHAPTERS_DATA : CHAPTERS_DATA;
  }

  function getQuestionsForExam(exam, sub, chId) {
    if (exam === 'advanced') {
      const chapter = (ADVANCED_DATA[sub] || []).find(item => Number(item.id) === Number(chId));
      return chapter ? chapter.questions : [];
    }
    return getQuestionsForChapter(sub, chId);
  }

  function getActiveQuestionsForChapter(sub, chId) {
    return getQuestionsForExam(activeExam, sub, chId);
  }

  function formatQuestionAnswer(question, answer, correct = false) {
    if (question.type === 'numeric') {
      return correct ? String(question.answerDisplay ?? question.numericAnswer) : String(answer ?? '');
    }
    if (question.type === 'integer') {
      return correct ? String(question.integerAnswer) : String(answer ?? '');
    }
    const choices = Array.isArray(answer) ? answer : [answer];
    return choices
      .filter(Boolean)
      .map(choice => question.options && question.options[OPTION_LETTERS.indexOf(choice)] || choice)
      .join(', ');
  }

  function hasUserAnswer(answer) {
    return Array.isArray(answer) ? answer.length > 0 : answer !== undefined && answer !== '';
  }

  // Safe string escaper
  const escapeHTML = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  function getIntegerAnswer(question) {
    const optionIndex = OPTION_LETTERS.indexOf(question.ans);
    if (optionIndex < 0 || !question.options || !question.options[optionIndex]) return null;
    const match = String(question.options[optionIndex]).trim().match(/^([-+]?\\d+)(?:\\s*[A-Za-z°%].*)?$/);
    return match ? Number(match[1]) : null;
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  let dashboardProfile = null;
  let dashboardRefreshTimer = null;
  const defaultExamDates = { 'JEE Main': '2027-01-21', 'JEE Advanced': '2027-05-23' };

  function localDateKey(date = new Date()) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  function validDateKey(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  function dashboardProgressKey() {
    const username = String(dashboardProfile && dashboardProfile.username || 'guest').toLowerCase();
    return 'jeenius.progress.v1.' + username;
  }

  function treasureStorageKey() {
    const username = String(dashboardProfile && dashboardProfile.username || 'guest').trim().toLowerCase();
    return 'jeenius.treasure.v1.' + (username || 'guest');
  }

  function loadTreasureQuestions() {
    try {
      const saved = JSON.parse(localStorage.getItem(treasureStorageKey()) || '[]');
      if (!Array.isArray(saved)) throw new Error('Saved Treasure Box data is not a question list.');
      return saved.filter(item => item && typeof item.id === 'string' && typeof item.q === 'string');
    } catch (error) {
      console.error('Unable to load Treasure Box questions:', error);
      const errorEl = document.getElementById('treasureError');
      if (errorEl) errorEl.textContent = 'Could not load saved questions from this browser.';
      return [];
    }
  }

  function saveTreasureQuestions(questions) {
    try {
      localStorage.setItem(treasureStorageKey(), JSON.stringify(questions));
      return true;
    } catch (error) {
      console.error('Unable to save Treasure Box questions:', error);
      const errorEl = document.getElementById('treasureError');
      if (errorEl) errorEl.textContent = 'Could not save wrong answers in this browser. Check available storage and try again.';
      return false;
    }
  }

  function recordWrongQuestions(questions) {
    const saved = loadTreasureQuestions();
    let changed = false;
    questions.filter(question => question.isAttempted && !question.isCorrect).forEach(question => {
      if (!question.subject || !question.chapterId || !question.q) return;
      const id = [
        ...(question.exam === 'advanced' ? ['advanced'] : []),
        question.subject,
        question.chapterId,
        question.q
      ].join('|');
      const previous = saved.find(item => item.id === id);
      if (previous) {
        previous.mistakes = (Number(previous.mistakes) || 1) + 1;
        previous.lastWrongAt = Date.now();
        previous.userAns = question.userAns;
      } else {
        saved.unshift({
          id,
          subject: question.subject,
          chapterId: question.chapterId,
          chapterName: question.chapterName || '',
          q: question.q,
          options: question.options || [],
          ans: question.ans,
          integerAnswer: question.integerAnswer,
          type: question.type,
          exam: question.exam || 'main',
          numericAnswer: question.numericAnswer,
          answerDisplay: question.answerDisplay,
          exp: question.exp || '',
          userAns: question.userAns,
          mistakes: 1,
          lastWrongAt: Date.now()
        });
      }
      changed = true;
    });
    if (changed && saveTreasureQuestions(saved)) {
      renderTreasureBox();
    }
  }

  function renderTreasureBox() {
    const list = document.getElementById('treasureList');
    const summary = document.getElementById('treasureSummary');
    const error = document.getElementById('treasureError');
    if (!list || !summary) return;
    if (error && !error.textContent.includes('Could not load saved questions')) error.textContent = '';
    const saved = loadTreasureQuestions();
    summary.textContent = saved.length
      ? saved.length + ' question' + (saved.length === 1 ? '' : 's') + ' saved for review'
      : 'Your saved questions will appear here after you answer a quiz incorrectly.';
    list.innerHTML = saved.length ? saved.map((item, index) => {
      const subjectName = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics' }[item.subject] || item.subject;
      const chapterName = item.chapterName || ((getChaptersForExam(item.exam)[item.subject] || []).find(ch => ch.id === Number(item.chapterId)) || {}).name || 'Chapter ' + item.chapterId;
      const correctAnswer = formatQuestionAnswer(item, item.ans, true) || 'Unavailable';
      return \`
        <article class="treasure-card">
          <div class="treasure-card-head">
            <h3 class="treasure-card-title">\${escapeHTML(item.q)}</h3>
            <span class="treasure-card-meta">\${escapeHTML(subjectName)} • \${escapeHTML(chapterName)} • Missed \${Number(item.mistakes) || 1} time\${Number(item.mistakes) === 1 ? '' : 's'}</span>
          </div>
          <div class="treasure-answer">Your answer: <b>\${escapeHTML(formatQuestionAnswer(item, item.userAns) || '—')}</b> · Correct answer: <b>\${escapeHTML(correctAnswer)}</b></div>
          <div class="treasure-explanation">\${escapeHTML(item.exp || 'Review this concept, then try related questions from the same chapter.')}</div>
          <button type="button" class="treasure-practice" data-practice-treasure="\${index}">Practice similar questions →</button>
        </article>
      \`;
    }).join('') : '<div class="treasure-empty">No wrong answers saved yet. Complete a quiz and any questions you get wrong will be collected here.</div>';
  }

  function startTreasurePractice(index) {
    const saved = loadTreasureQuestions();
    const item = saved[index];
    if (!item) return;
    const exam = item.exam || 'main';
    const chapter = (getChaptersForExam(exam)[item.subject] || []).find(ch => Number(ch.id) === Number(item.chapterId));
    if (!chapter) {
      const error = document.getElementById('treasureError');
      if (error) error.textContent = 'This question’s chapter is no longer available for practice.';
      return;
    }
    activeExam = exam;
    const pool = getQuestionsForExam(exam, item.subject, Number(item.chapterId));
    const related = pool.filter(question => question.q !== item.q);
    if (!related.length) {
      const error = document.getElementById('treasureError');
      if (error) error.textContent = 'No other questions are available for this chapter yet.';
      return;
    }
    const questions = shuffle([...related]).slice(0, Math.min(5, related.length)).map((question, questionIndex) => ({
      ...question,
      num: questionIndex + 1,
      subject: item.subject,
      chapterId: Number(item.chapterId),
      chapterName: item.chapterName || chapter.name
    }));
    startQuiz(
      'Similar Practice: ' + (item.chapterName || chapter.name),
      questions.length + ' related questions • ' + (item.chapterName || chapter.name),
      questions,
      questions.length * 75
    );
  }

  function loadDashboardProgress() {
    const today = localDateKey();
    const empty = { totals: { 'JEE Main': 0, 'JEE Advanced': 0 }, xp: 0, daily: { date: today, count: 0 } };
    try {
      const saved = JSON.parse(localStorage.getItem(dashboardProgressKey()) || 'null');
      if (!saved || typeof saved !== 'object') return empty;
      const progress = {
        totals: {
          'JEE Main': Math.max(0, Number(saved.totals && saved.totals['JEE Main']) || 0),
          'JEE Advanced': Math.max(0, Number(saved.totals && saved.totals['JEE Advanced']) || 0)
        },
        xp: Math.max(0, Number(saved.xp) || 0),
        daily: {
          date: validDateKey(saved.daily && saved.daily.date) ? saved.daily.date : today,
          count: Math.max(0, Number(saved.daily && saved.daily.count) || 0)
        }
      };
      if (progress.daily.date !== today) progress.daily = { date: today, count: 0 };
      return progress;
    } catch (error) {
      console.error('Unable to load dashboard progress:', error);
      return empty;
    }
  }

  function saveDashboardProgress(progress) {
    try {
      localStorage.setItem(dashboardProgressKey(), JSON.stringify(progress));
    } catch (error) {
      console.error('Unable to save dashboard progress:', error);
    }
  }

  function renderLevelProgress(progress = loadDashboardProgress()) {
    const totalXP = progress.xp;
    const level = Math.floor(totalXP / 100) + 1;
    const levelXP = totalXP % 100;
    const levelEl = document.getElementById('levelNumber');
    const totalEl = document.getElementById('levelTotalXP');
    const messageEl = document.getElementById('levelMessage');
    const remainingEl = document.getElementById('levelXPRemaining');
    const bar = document.getElementById('levelProgressBar');
    if (levelEl) levelEl.textContent = String(level);
    if (totalEl) totalEl.textContent = String(totalXP);
    if (messageEl) messageEl.textContent = level === 1 ? 'Just getting started' : 'Keep going — level ' + level;
    if (remainingEl) remainingEl.textContent = (100 - levelXP) + ' XP to next level';
    if (bar) bar.style.width = levelXP + '%';
  }

  function renderProfile() {
    const details = document.getElementById('profileDetails');
    if (!details || !dashboardProfile) return;
    const dateKey = dashboardProfile.date || defaultExamDates[dashboardProfile.exam];
    const parsedDate = dateKey ? new Date(dateKey + 'T00:00:00') : null;
    const examDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;
    const formattedDate = examDate
      ? examDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Not set';
    const fields = [
      ['Name', dashboardProfile.username || 'Not set'],
      ['Target exam', dashboardProfile.exam || 'Not set'],
      ['Exam date', formattedDate],
      ['Daily question goal', Math.max(1, Number(dashboardProfile.qpd) || 50) + ' questions']
    ];
    details.innerHTML = '<p class="profile-welcome">This profile reflects the details you provided when setting up JEEnius.</p>' +
      fields.map(([label, value]) => \`
        <article class="profile-detail">
          <div class="profile-detail-label">\${escapeHTML(label)}</div>
          <div class="profile-detail-value">\${escapeHTML(value)}</div>
        </article>
      \`).join('');
  }

  function renderDashboardTrackers() {
    if (!dashboardProfile) return;
    const progress = loadDashboardProgress();
    const goal = Math.max(1, Number(dashboardProfile.qpd) || 50);
    const qt = document.querySelector('.qt');
    if (qt) {
      let daily = document.getElementById('qtDailyGoal');
      if (!daily) {
        daily = document.createElement('div');
        daily.id = 'qtDailyGoal';
        daily.className = 'qt-daily-goal';
        daily.innerHTML = '<div class="qt-daily-head"><b>Today\\'s question goal</b><span id="qtDailyCount"></span></div><div class="bar"><i id="qtDailyProgress"></i></div><small id="qtDailyPercent"></small>';
        qt.parentNode.insertBefore(daily, qt);
      }
      const dailyCount = document.getElementById('qtDailyCount');
      const dailyBar = document.getElementById('qtDailyProgress');
      const dailyPercent = document.getElementById('qtDailyPercent');
      const count = progress.daily.count;
      const pct = Math.min(100, Math.round(count / goal * 100));
      if (dailyCount) dailyCount.textContent = count + ' / ' + goal;
      if (dailyBar) dailyBar.style.width = pct + '%';
      if (dailyPercent) dailyPercent.textContent = pct + '% of your daily target';
      daily.setAttribute('aria-label', count + ' of ' + goal + ' questions completed today');

      qt.querySelectorAll(':scope > div').forEach(item => {
        const heading = item.querySelector('h3');
        const exam = heading && heading.textContent.trim();
        if (!Object.prototype.hasOwnProperty.call(progress.totals, exam)) return;
        const number = item.querySelector('.n');
        const bar = item.querySelector('.bar i');
        const percent = item.querySelector('small');
        const denominator = number && number.querySelector('span');
        const limit = Math.max(1, Number(denominator && denominator.textContent) || 1);
        const total = progress.totals[exam];
        const progressPercent = Math.min(100, Math.round(total / limit * 100));
        if (number) number.firstChild.textContent = String(total) + ' ';
        if (bar) bar.style.width = progressPercent + '%';
        if (percent) percent.textContent = progressPercent + '%';
      });
    }
    renderLevelProgress(progress);
  }

  function renderExamDate() {
    if (!dashboardProfile) return;
    const exam = dashboardProfile.exam;
    const dateKey = validDateKey(dashboardProfile.date) ? dashboardProfile.date : defaultExamDates[exam];
    if (!validDateKey(dateKey)) return;
    const [year, month, day] = dateKey.split('-').map(Number);
    const targetUTC = Date.UTC(year, month - 1, day);
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.max(0, Math.round((targetUTC - todayUTC) / 86400000));
    const examTitle = document.querySelector('#dash .exam h3');
    const examDate = document.querySelector('#dash .exam small');
    const daysLabel = document.querySelector('#dash .exam .big em');
    if (examTitle) examTitle.textContent = exam + ' ' + year;
    if (examDate) examDate.textContent = '(' + new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) + ')';
    if (daysLabel) daysLabel.textContent = String(days);
  }

  function recordQuizProgress(questions, xpGained) {
    if (!dashboardProfile) return;
    const progress = loadDashboardProgress();
    const answered = questions.filter(question => question.isAttempted).length;
    const exam = dashboardProfile.exam;
    if (Object.prototype.hasOwnProperty.call(progress.totals, exam)) progress.totals[exam] += answered;
    if (progress.daily.date !== localDateKey()) progress.daily = { date: localDateKey(), count: 0 };
    progress.daily.count += answered;
    progress.xp += Math.max(0, Number(xpGained) || 0);
    saveDashboardProgress(progress);
    renderDashboardTrackers();
  }

  if (typeof window.initUser === 'function') {
    const initializeUser = window.initUser;
    window.initUser = function(profile) {
      const exam = profile && profile.exam;
      dashboardProfile = {
        ...profile,
        qpd: Math.max(1, Number(profile && profile.qpd) || 50),
        date: validDateKey(profile && profile.date) ? profile.date : defaultExamDates[exam]
      };
      initializeUser(dashboardProfile);
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: dashboardProfile.username,
          exam: dashboardProfile.exam,
          qpd: dashboardProfile.qpd,
          date: dashboardProfile.date
        })
      }).then(function (response) {
        if (!response.ok) {
          return response.json().then(function (data) {
            throw new Error(data.error || 'Could not save your profile.');
          });
        }
      }).catch(function (error) {
        console.error('Unable to save profile:', error);
      });
      renderDashboardTrackers();
      renderExamDate();
      renderProfile();
      if (dashboardRefreshTimer) clearInterval(dashboardRefreshTimer);
      dashboardRefreshTimer = setInterval(() => {
        renderDashboardTrackers();
        renderExamDate();
      }, 60000);
    };
  }

  // State
  let curView = 'home';
  let curSubTab = 'physics';
  let quizOriginView = 'chapter';
  let quizSubjectFilter = 'all';
  let activeQuiz = null; // { title, subTitle, questions, answers: {}, marked: {}, curIdx: 0, timerSec: 1200, timerId: null, startTime: null, duration: 0 }
  let lastResult = null;
  let reviewFilter = 'all';
  const quizBuilderSelections = { chapter: new Map(), subject: new Map() };
  let spinItems = [];
  let spinResult = null;
  let spinPendingIndex = null;
  let spinRotation = 0;
  let spinBusy = false;
  let spinFallbackTimer = null;
  let spinDashboardFocus = false;

  function getMain() {
    return document.querySelector('#dash main');
  }

  function setView(view) {
    curView = view;
    const m = getMain();
    if (m) {
      m.classList.remove('todo', 'chapter-mode', 'subject-mode', 'mock-mode', 'quiz-mode', 'result-mode', 'notes-mode', 'treasure-mode', 'profile-mode');
      if (view === 'todo') m.classList.add('todo');
      else if (view === 'chapter') m.classList.add('chapter-mode');
      else if (view === 'subject') m.classList.add('subject-mode');
      else if (view === 'mock') m.classList.add('mock-mode');
      else if (view === 'quiz') m.classList.add('quiz-mode');
      else if (view === 'result') m.classList.add('result-mode');
      else if (view === 'notes') m.classList.add('notes-mode');
      else if (view === 'treasure') m.classList.add('treasure-mode');
      else if (view === 'profile') m.classList.add('profile-mode');
    }

    // Update nav active states
    if (view !== 'home') spinDashboardFocus = false;
    document.querySelectorAll('#nav button').forEach(b => {
      const txt = b.textContent.trim();
      if (view === 'home') b.classList.toggle('on', spinDashboardFocus ? b.id === 'navSpin' : txt === 'Home');
      else if (view === 'todo') b.classList.toggle('on', txt === 'To-Do List');
      else if (view === 'treasure') b.classList.toggle('on', b.id === 'navTreasure');
      else if (view === 'profile') b.classList.toggle('on', b.id === 'navProfile');
      else if (view === 'chapter' || view === 'quiz' || view === 'result') {
        b.classList.toggle('on', quizOriginView === 'treasure' ? b.id === 'navTreasure' : txt.startsWith('Questions'));
      } else if (view === 'subject') {
        b.classList.toggle('on', txt.includes('Subject') || txt.startsWith('Questions'));
      } else if (view === 'notes') {
        b.classList.toggle('on', txt === 'Notes');
      }
    });

    if (typeof window.scrollTo === 'function') {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
    }
  }

  function getQuizBuilderSubjects(mode) {
    if (mode === 'chapter') return Object.keys(getActiveChaptersData());
    const subjectSelect = document.getElementById('subjectQuizSubject');
    return subjectSelect ? [subjectSelect.value] : [];
  }

  function storeQuizBuilderSelection(mode) {
    const subjectSelect = document.getElementById('subjectQuizSubject');
    const activeSubject = mode === 'subject' && subjectSelect ? subjectSelect.value : null;
    const selected = new Map();
    document.querySelectorAll(\`#\${mode}QuizChapters [data-builder-chapter]:checked\`).forEach(input => {
      const subject = input.dataset.builderSubject;
      if (!selected.has(subject)) selected.set(subject, []);
      selected.get(subject).push(Number(input.dataset.builderChapter));
    });
    if (mode === 'chapter') {
      Object.keys(getActiveChaptersData()).forEach(subject => {
        quizBuilderSelections.chapter.set(subject, selected.get(subject) || []);
      });
    } else if (activeSubject) {
      quizBuilderSelections.subject.set(activeSubject, selected.get(activeSubject) || []);
    }
  }

  function getSelectedQuizChapters(mode) {
    const subjectSelect = document.getElementById('subjectQuizSubject');
    const activeSubject = mode === 'subject' && subjectSelect ? subjectSelect.value : null;
    const selected = [];
    document.querySelectorAll(\`#\${mode}QuizChapters [data-builder-chapter]:checked\`).forEach(input => {
      const subject = input.dataset.builderSubject;
      const chapter = (getActiveChaptersData()[subject] || []).find(item => item.id === Number(input.dataset.builderChapter));
      if (chapter) selected.push({ subject, chapter });
    });
    return selected.filter(item => mode !== 'subject' || item.subject === activeSubject);
  }

  function updateQuizBuilderLimit(mode) {
    const countInput = document.getElementById(mode + 'QuizCount');
    if (!countInput) return 0;
    const possible = getQuizBuilderSubjects(mode).reduce(
      (sum, subject) => sum + (getActiveChaptersData()[subject] || []).reduce(
        (chapterSum, chapter) => chapterSum + getActiveQuestionsForChapter(subject, chapter.id).length,
        0
      ),
      0
    );
    const total = getSelectedQuizChapters(mode).reduce(
      (sum, item) => sum + getActiveQuestionsForChapter(item.subject, item.chapter.id).length,
      0
    );
    countInput.max = String(Math.max(total || possible, 1));
    if (total > 0 && Number(countInput.value) > total) countInput.value = String(total);
    return total;
  }

  function renderQuizBuilderChapters(mode) {
    const chapterList = document.getElementById(mode + 'QuizChapters');
    if (!chapterList) return;
    const subjectNames = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics' };
    const subjects = getQuizBuilderSubjects(mode);
    chapterList.innerHTML = subjects.map(subject => {
      const chapters = getActiveChaptersData()[subject] || [];
      const selectedIds = quizBuilderSelections[mode].get(subject) || [];
      const chapterOptions = chapters.map(ch => \`
        <label class="mock-chapter-option">
          <input type="checkbox" data-builder-subject="\${escapeHTML(subject)}" data-builder-chapter="\${escapeHTML(ch.id)}" \${selectedIds.includes(Number(ch.id)) ? 'checked' : ''}>
          <span>Chapter \${escapeHTML(ch.id)}: \${escapeHTML(ch.name)}</span>
        </label>
      \`).join('');
      if (mode === 'subject') return \`<div class="mock-chapter-options">\${chapterOptions}</div>\`;
      const allSelected = chapters.length > 0 && selectedIds.length === chapters.length;
      const partiallySelected = selectedIds.length > 0 && !allSelected;
      return \`
        <fieldset class="mock-subject-group" data-builder-subject-group="\${escapeHTML(subject)}">
          <legend>
            <label class="mock-subject-option">
              <input type="checkbox" data-builder-subject-toggle="\${escapeHTML(subject)}" \${allSelected ? 'checked' : ''} \${partiallySelected ? 'data-indeterminate="true"' : ''}>
              <span>\${subjectNames[subject] || escapeHTML(subject)}</span>
            </label>
          </legend>
          <div class="mock-chapter-options">\${chapterOptions}</div>
        </fieldset>
      \`;
    }).join('');
    chapterList.querySelectorAll('[data-indeterminate="true"]').forEach(input => {
      input.indeterminate = true;
      input.removeAttribute('data-indeterminate');
    });
    updateQuizBuilderLimit(mode);
  }

  function initializeQuizBuilder(mode, subject = 'physics') {
    const availableSubjects = Object.keys(getActiveChaptersData());
    const heading = document.querySelector('#' + mode + 'View .view-title');
    if (heading) {
      heading.textContent = activeExam === 'advanced'
        ? (mode === 'chapter' ? 'JEE Advanced Chapter-wise Practice' : 'JEE Advanced Subject-wise Practice')
        : (mode === 'chapter' ? 'Chapter-wise Question Bank' : 'Subject-wise Practice');
    }
    if (mode === 'chapter') {
      if (!availableSubjects.includes(subject)) subject = availableSubjects[0];
      curSubTab = subject;
    } else {
      const subjectSelect = document.getElementById('subjectQuizSubject');
      if (!subjectSelect) return;
      subjectSelect.value = availableSubjects.includes(subject) ? subject : availableSubjects[0];
    }
    renderQuizBuilderChapters(mode);
  }

  function startConfiguredQuiz(mode) {
    const countInput = document.getElementById(mode + 'QuizCount');
    const durationSelect = document.getElementById(mode + 'QuizDuration');
    const error = document.getElementById(mode + 'QuizError');
    if (!countInput || !durationSelect || !error) return;

    error.textContent = '';
    const chapters = getSelectedQuizChapters(mode);
    const available = updateQuizBuilderLimit(mode);
    const count = Number(countInput.value);
    const durationMinutes = Number(durationSelect.value);

    if (!chapters.length) {
      error.textContent = 'Select at least one chapter to generate your quiz.';
      return;
    }
    if (!Number.isInteger(count) || count < 1 || count > available) {
      error.textContent = \`Choose between 1 and \${available} questions across the selected chapters.\`;
      return;
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 300) {
      error.textContent = 'Choose a time limit between 1 and 300 minutes.';
      return;
    }

    const pool = chapters.flatMap(({ subject, chapter }) =>
      getActiveQuestionsForChapter(subject, chapter.id).map(question => ({
        ...question,
        exam: activeExam,
        subject,
        chapterId: chapter.id,
        chapterName: chapter.name
      }))
    );
    const selected = shuffle(pool).slice(0, count).map((question, index) => ({ ...question, num: index + 1 }));
    const subjectNames = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics' };
    const chapterNames = chapters.map(({ subject, chapter }) =>
      mode === 'chapter' ? \`\${subjectNames[subject] || subject}: \${chapter.name}\` : chapter.name
    );
    const quizTitle = mode === 'subject'
      ? 'Subject-wise: ' + (subjectNames[chapters[0].subject] || chapters[0].subject)
      : 'Chapter-wise Quiz';
    const chapterSummary = chapterNames.length <= 3 ? chapterNames.join(', ') : \`\${chapterNames.length} selected chapters\`;
    const quizSubtitle = \`\${count} Questions • \${durationMinutes} minutes • \${chapterSummary}\`;
    if (mode === 'chapter') curSubTab = chapters[0].subject;
    startQuiz(activeExam === 'advanced' ? 'JEE Advanced · ' + quizTitle : quizTitle, quizSubtitle, selected, durationMinutes * 60);
  }

  function renderMockChapterOptions() {
    const chapterList = document.getElementById('mockChapters');
    if (!chapterList) return;
    if (chapterList.childElementCount > 0) {
      updateMockBuilderSummary();
      return;
    }

    const subjectNames = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics' };
    chapterList.innerHTML = Object.entries(getActiveChaptersData()).map(([sub, chapters]) => \`
      <fieldset class="mock-subject-group" data-mock-subject-group="\${sub}">
        <legend>
          <label class="mock-subject-option">
            <input type="checkbox" data-mock-subject="\${sub}" checked>
            <span>\${subjectNames[sub]}</span>
          </label>
        </legend>
        <div class="mock-chapter-options">
          \${chapters.map(ch => \`
            <label class="mock-chapter-option">
              <input type="checkbox" data-mock-subject="\${sub}" data-mock-chapter="\${ch.id}" checked>
              <span>Chapter \${ch.id}: \${escapeHTML(ch.name)}</span>
            </label>
          \`).join('')}
        </div>
      </fieldset>
    \`).join('');
    updateMockBuilderSummary();
  }

  function updateMockBuilderSummary() {
    const subjectNames = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics' };
    const subjects = [...document.querySelectorAll('#mockChapters [data-mock-subject]:not([data-mock-chapter]):checked')]
      .map(input => input.dataset.mockSubject);
    const selected = [...document.querySelectorAll('#mockChapters [data-mock-chapter]:checked')]
      .filter(input => subjects.includes(input.dataset.mockSubject));
    const questionsPerSubjectInput = document.getElementById('mockQuestionsPerSubject');
    const summary = document.getElementById('mockSummary');
    const generateButton = document.getElementById('btnGenerateMock');
    const error = document.getElementById('mockError');
    const integerSection = document.querySelector('.mock-integer-section');
    if (integerSection) integerSection.hidden = activeExam === 'advanced';

    document.querySelectorAll('#mockChapters [data-mock-subject-group]').forEach(group => {
      group.hidden = !subjects.includes(group.dataset.mockSubjectGroup);
    });
    const chaptersPerSubject = subjects.map(sub =>
      selected.filter(input => input.dataset.mockSubject === sub).length
    );
    const availableQuestionsPerSubject = subjects.map(sub =>
      selected.filter(input => input.dataset.mockSubject === sub).reduce(
        (total, input) => total + getActiveQuestionsForChapter(sub, Number(input.dataset.mockChapter)).length,
        0
      )
    );
    const allSubjects = Object.keys(getActiveChaptersData());
    const maxPerSubject = availableQuestionsPerSubject.length
      ? Math.min(...availableQuestionsPerSubject)
      : Math.max(...allSubjects.map(sub => (getActiveChaptersData()[sub] || []).reduce(
        (total, chapter) => total + getActiveQuestionsForChapter(sub, chapter.id).length,
        0
      )));
    if (questionsPerSubjectInput) {
      questionsPerSubjectInput.max = String(maxPerSubject);
      if (maxPerSubject > 0 && Number(questionsPerSubjectInput.value) > maxPerSubject) {
        questionsPerSubjectInput.value = String(maxPerSubject);
      }
    }
    let integerQuestionsTotal = 0;
    subjects.forEach(sub => {
      const integerInput = document.getElementById('mockInteger' + sub.charAt(0).toUpperCase() + sub.slice(1));
      const selectedChapterIds = [...document.querySelectorAll(
        \`#mockChapters [data-mock-chapter]:checked[data-mock-subject="\${sub}"]\`
      )].map(input => Number(input.dataset.mockChapter));
      const eligibleCount = selectedChapterIds
        .flatMap(chId => getActiveQuestionsForChapter(sub, chId))
        .filter(question => getIntegerAnswer(question) !== null)
        .length;
      const integerMax = Math.min(Number(questionsPerSubjectInput && questionsPerSubjectInput.value) || 0, eligibleCount);
      if (integerInput) {
        integerInput.closest('[data-mock-integer-group]').hidden = activeExam === 'advanced' || !subjects.includes(sub);
        integerInput.max = String(integerMax);
        integerInput.disabled = activeExam === 'advanced';
        if (activeExam === 'advanced') integerInput.value = '0';
        if (Number(integerInput.value) > integerMax) integerInput.value = String(integerMax);
        integerQuestionsTotal += Number(integerInput.value) || 0;
      }
      const hint = document.querySelector(\`[data-mock-integer-hint="\${sub}"]\`);
      if (hint) hint.textContent = \`0–\${integerMax} available from selected chapters\`;
    });
    document.querySelectorAll('[data-mock-integer-group]').forEach(group => {
      const sub = group.dataset.mockIntegerGroup;
      group.hidden = activeExam === 'advanced' || !subjects.includes(sub);
      const input = document.getElementById('mockInteger' + sub.charAt(0).toUpperCase() + sub.slice(1));
      if (!subjects.includes(sub) && input) input.value = '0';
    });
    if (summary) {
      const chaptersSummary = subjects.map((sub, i) =>
        \`\${subjectNames[sub]}: \${chaptersPerSubject[i]} chapter\${chaptersPerSubject[i] === 1 ? '' : 's'}\`
      ).join(' • ');
      const questionsPerSubject = Number(questionsPerSubjectInput && questionsPerSubjectInput.value) || 0;
      const totalQuestions = subjects.length * questionsPerSubject;
      const allHaveChapters = chaptersPerSubject.every(count => count > 0);
      summary.textContent = subjects.length && allHaveChapters
        ? \`\${chaptersSummary} • \${questionsPerSubject} questions per subject • \${totalQuestions} total\${activeExam === 'advanced' ? '' : \` • \${integerQuestionsTotal} integer-answer questions\`}\`
        : 'Choose at least one chapter for every selected subject.';
    }
    if (generateButton) generateButton.disabled = !subjects.length || chaptersPerSubject.some(count => count === 0);
    if (error) error.textContent = '';
  }

  // Start Quiz
  function startQuiz(title, subTitle, questions, timerSec = 1200) {
    if (activeQuiz && activeQuiz.timerId) clearInterval(activeQuiz.timerId);
    setActiveExam(questions[0] && questions[0].exam === 'advanced' ? 'advanced' : 'main');
    quizOriginView = ['chapter', 'subject', 'mock', 'treasure'].includes(curView)
      ? curView
      : (curView === 'result' ? quizOriginView : 'home');
    quizSubjectFilter = 'all';

    activeQuiz = {
      title,
      subTitle,
      questions,
      answers: {},
      marked: {},
      curIdx: 0,
      timerSec: timerSec,
      timerId: null,
      startTime: Date.now(),
      duration: timerSec
    };

    const titleEl = document.getElementById('quizTitle');
    const subEl = document.getElementById('quizSub');
    const totalEl = document.getElementById('qTotalNum');
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = subTitle;
    if (totalEl) totalEl.textContent = questions.length;

    renderQuestion();
    renderQuizSubjectMenu();
    renderPalette();
    startTimer();
    setView('quiz');
  }

  function startTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const update = () => {
      if (!activeQuiz) return;
      const m = Math.floor(activeQuiz.timerSec / 60);
      const s = activeQuiz.timerSec % 60;
      if (timerDisplay) {
        timerDisplay.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        if (activeQuiz.timerSec <= 180) {
          timerDisplay.style.color = '#ef4444';
          timerDisplay.style.fontWeight = '800';
        } else {
          timerDisplay.style.color = 'var(--gold)';
          timerDisplay.style.fontWeight = '700';
        }
      }
      if (activeQuiz.timerSec <= 0) {
        clearInterval(activeQuiz.timerId);
        submitQuiz(true);
      } else {
        activeQuiz.timerSec--;
      }
    };
    update();
    activeQuiz.timerId = setInterval(update, 1000);
  }

  function renderQuestion() {
    if (!activeQuiz) return;
    const q = activeQuiz.questions[activeQuiz.curIdx];
    if (!q) return;

    const curNumEl = document.getElementById('qCurNum');
    const badgeNum = document.getElementById('qBadgeNum');
    const diffBadge = document.getElementById('qDiffBadge');
    const promptEl = document.getElementById('qPrompt');
    const optContainer = document.getElementById('qOptions');
    const progFill = document.getElementById('quizProgFill');
    const btnPrev = document.getElementById('btnPrevQ');
    const btnNext = document.getElementById('btnNextQ');
    const btnMark = document.getElementById('btnMarkReview');

    const total = activeQuiz.questions.length;
    const cur1 = activeQuiz.curIdx + 1;
    if (curNumEl) curNumEl.textContent = cur1;
    if (badgeNum) badgeNum.textContent = 'Q' + cur1;
    if (progFill) progFill.style.width = ((cur1 / total) * 100) + '%';

    if (diffBadge) {
      diffBadge.textContent = q.diff;
      diffBadge.className = 'diff-badge ' + (q.diff ? q.diff.toLowerCase() : 'easy');
    }

    if (promptEl) promptEl.textContent = q.q;

    // Render multiple-choice, multi-select, or numeric-answer questions.
    const letters = ['A', 'B', 'C', 'D'];
    const chosen = activeQuiz.answers[activeQuiz.curIdx];
    if (optContainer) {
      optContainer.innerHTML = q.type === 'integer' || q.type === 'numeric'
        ? \`
          <label class="integer-answer-field" for="integerAnswer">
            <span>\${q.type === 'numeric' ? 'Enter your numerical answer' : 'Enter your integer answer'}</span>
            <input id="integerAnswer" type="number" step="\${q.type === 'numeric' ? 'any' : '1'}" inputmode="decimal" value="\${chosen === undefined ? '' : escapeHTML(chosen)}" aria-label="\${q.type === 'numeric' ? 'Numerical answer' : 'Integer answer'}">
          </label>
        \`
        : \`\${q.type === 'multi' ? '<p class="q-type-hint">Select all correct options.</p>' : ''}\${(q.options || []).map((opt, i) => {
          const lettr = letters[i];
          const isSel = Array.isArray(chosen) ? chosen.includes(lettr) : chosen === lettr;
          return \`
            <div class="opt-card \${isSel ? 'selected' : ''}" data-choice="\${lettr}">
              <div class="opt-letter">\${lettr}</div>
              <div class="opt-text">\${escapeHTML(opt)}</div>
            </div>
          \`;
        }).join('')}\`;
    }

    if (btnPrev) btnPrev.disabled = (activeQuiz.curIdx === 0);
    if (btnNext) btnNext.disabled = (activeQuiz.curIdx === total - 1);

    if (btnMark) {
      const isMarked = !!activeQuiz.marked[activeQuiz.curIdx];
      btnMark.classList.toggle('marked', isMarked);
      btnMark.textContent = isMarked ? '★ Marked for Review' : '☆ Mark for Review';
    }
    renderQuizSubjectMenu();
  }

  function renderQuizSubjectMenu() {
    const menu = document.getElementById('quizSubjectMenu');
    if (!menu || !activeQuiz) return;

    const subjectNames = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics' };
    const subjects = [...new Set(activeQuiz.questions.map(q => q.subject).filter(Boolean))];
    menu.hidden = subjects.length === 0;
    if (subjects.length === 0) return;

    const allCount = activeQuiz.questions.length;
    const tabs = [{ key: 'all', label: 'All', count: allCount }]
      .concat(subjects.map(sub => ({
        key: sub,
        label: subjectNames[sub] || sub,
        count: activeQuiz.questions.filter(q => q.subject === sub).length
      })));

    menu.innerHTML = tabs.map(tab => \`
      <button type="button" class="quiz-subject-tab \${quizSubjectFilter === tab.key ? 'on' : ''}" data-quiz-subject="\${escapeHTML(tab.key)}">
        \${escapeHTML(tab.label)} <span>\${tab.count}</span>
      </button>
    \`).join('');
  }

  function renderPalette() {
    if (!activeQuiz) return;
    const grid = document.getElementById('palGrid');
    const palSummary = document.getElementById('palSummary');
    if (!grid) return;

    let ansCount = 0;
    const visibleQuestions = activeQuiz.questions
      .map((question, idx) => ({ question, idx }))
      .filter(({ question }) => quizSubjectFilter === 'all' || question.subject === quizSubjectFilter);

    grid.innerHTML = visibleQuestions.map(({ question: q, idx }) => {
      const isAns = hasUserAnswer(activeQuiz.answers[idx]);
      const isMark = !!activeQuiz.marked[idx];
      const isCur = activeQuiz.curIdx === idx;
      if (isAns) ansCount++;

      let statusCls = '';
      if (isMark) statusCls = 'marked';
      else if (isAns) statusCls = 'answered';

      return \`
        <button class="pal-btn \${statusCls} \${isCur ? 'current' : ''}" data-goto="\${idx}">
          \${idx + 1}
        </button>
      \`;
    }).join('');

    if (palSummary) {
      palSummary.textContent = ansCount + ' / ' + visibleQuestions.length + ' Answered';
    }
  }

  // Submit Quiz & Grade
  function submitQuiz(auto = false) {
    if (!activeQuiz) return;

    if (!auto) {
      const ansCount = Object.values(activeQuiz.answers).filter(hasUserAnswer).length;
      const unans = activeQuiz.questions.length - ansCount;
      const msg = unans > 0
        ? ('You have ' + unans + ' unattempted question(s). Are you sure you want to submit?')
        : 'Ready to submit the test and see your results?';
      if (typeof window.confirm === 'function' && !window.confirm(msg)) return;
    }

    if (activeQuiz.timerId) clearInterval(activeQuiz.timerId);

    const questions = activeQuiz.questions;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const reviewItems = questions.map((q, idx) => {
      const userAns = activeQuiz.answers[idx];
      const isAttempted = hasUserAnswer(userAns);
      let isCorrect = false;
      let pointsAwarded = 0;
      if (isAttempted) {
        if (q.type === 'integer') isCorrect = Number(userAns) === q.integerAnswer;
        else if (q.type === 'numeric') {
          isCorrect = Number.isFinite(Number(userAns)) && Math.abs(Number(userAns) - q.numericAnswer) <= q.tolerance;
        } else if (q.type === 'multi') {
          const selected = Array.isArray(userAns) ? [...userAns].sort() : [userAns];
          const expected = [...q.ans].sort();
          isCorrect = selected.length === expected.length && selected.every((letter, i) => letter === expected[i]);
        } else isCorrect = userAns === q.ans;
        if (q.exam === 'advanced') {
          if (isCorrect) pointsAwarded = q.type === 'single' ? 3 : 4;
          else if (q.type === 'multi') {
            const selected = Array.isArray(userAns) ? userAns : [userAns];
            pointsAwarded = selected.some(letter => !q.ans.includes(letter)) ? -2 : 2;
          } else if (q.type === 'single') pointsAwarded = -1;
        } else if (isCorrect) pointsAwarded = 4;
        else pointsAwarded = -1;
      }

      if (!isAttempted) unattempted++;
      else if (isCorrect) correct++;
      else incorrect++;

      return {
        ...q,
        idx,
        userAns: isAttempted ? userAns : null,
        isCorrect,
        isAttempted,
        pointsAwarded
      };
    });

    const total = questions.length;
    const score = reviewItems.reduce((sum, question) => sum + question.pointsAwarded, 0);
    const maxScore = questions.reduce(
      (sum, question) => sum + (question.exam === 'advanced' && question.type === 'single' ? 3 : 4),
      0
    );
    const pct = Math.max(0, Math.round((score / maxScore) * 100));
    const timeSpent = Math.max(0, activeQuiz.duration - activeQuiz.timerSec);
    const xpGained = Math.max(0, correct * 10);

    lastResult = {
      title: activeQuiz.title,
      subTitle: activeQuiz.subTitle,
      total,
      correct,
      incorrect,
      unattempted,
      score,
      maxScore,
      pct,
      timeSpent,
      xpGained,
      questions: reviewItems
    };

    recordWrongQuestions(reviewItems);
    recordQuizProgress(reviewItems, xpGained);
    activeQuiz = null;
    showResults();
  }

  function showResults() {
    if (!lastResult) return;
    const res = lastResult;

    const pctEl = document.getElementById('resPercent');
    const ratioEl = document.getElementById('resRatio');
    const corrEl = document.getElementById('resCorrect');
    const incorrEl = document.getElementById('resIncorrect');
    const unattEl = document.getElementById('resUnattempted');
    const scoreEl = document.getElementById('resScore');
    const xpEl = document.getElementById('resXP');
    const circle = document.getElementById('resCircle');

    if (pctEl) pctEl.textContent = res.pct + '%';
    if (ratioEl) ratioEl.textContent = res.correct + ' of ' + res.total + ' correct';
    if (corrEl) corrEl.textContent = res.correct;
    if (incorrEl) incorrEl.textContent = res.incorrect;
    if (unattEl) unattEl.textContent = res.unattempted;
    if (scoreEl) scoreEl.textContent = res.score + ' / ' + res.maxScore;
    if (xpEl) xpEl.innerHTML = 'XP Gained: <b>+' + res.xpGained + ' XP</b>';

    if (circle) {
      const circumference = 2 * Math.PI * 72; // ~452.4
      const offset = circumference - (res.pct / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    // Counts for filter pills
    const allC = document.getElementById('rfAllCount');
    const incC = document.getElementById('rfIncorrCount');
    const corC = document.getElementById('rfCorrCount');
    const unaC = document.getElementById('rfUnattCount');
    if (allC) allC.textContent = res.total;
    if (incC) incC.textContent = res.incorrect;
    if (corC) corC.textContent = res.correct;
    if (unaC) unaC.textContent = res.unattempted;

    reviewFilter = 'all';
    document.querySelectorAll('#rfFilterGroup .rf-btn').forEach(b => b.classList.toggle('on', b.dataset.f === 'all'));
    renderReviewList();
    setView('result');

    // Grant XP in header
    updateUserXP(res);
  }

  function renderReviewList() {
    if (!lastResult) return;
    const container = document.getElementById('reviewList');
    if (!container) return;

    let items = lastResult.questions;
    if (reviewFilter === 'incorrect') items = items.filter(q => q.isAttempted && !q.isCorrect);
    else if (reviewFilter === 'correct') items = items.filter(q => q.isCorrect);
    else if (reviewFilter === 'unattempted') items = items.filter(q => !q.isAttempted);

    if (items.length === 0) {
      container.innerHTML = '<div style="padding:32px;text-align:center;color:var(--muted);background:var(--card);border-radius:18px;border:1px solid var(--line);">No questions match this filter.</div>';
      return;
    }

    const letters = ['A', 'B', 'C', 'D'];
    container.innerHTML = items.map(q => {
      let badgeCls = 'unatt';
      let badgeText = 'Unattempted (0)';
      if (q.isAttempted) {
        if (q.isCorrect) {
          badgeCls = 'correct';
          badgeText = 'Correct (+' + q.pointsAwarded + ')';
        } else if (q.exam === 'advanced' && q.pointsAwarded > 0) {
          badgeCls = 'correct';
          badgeText = 'Partial (+' + q.pointsAwarded + ')';
        } else {
          badgeCls = 'incorrect';
          badgeText = q.exam === 'advanced'
            ? 'Incorrect (' + q.pointsAwarded + ')'
            : 'Incorrect (-1)';
        }
      }

      return \`
        <div class="rev-card">
          <div class="rev-head">
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="q-num">Q\${q.idx + 1}</span>
              <span class="diff-badge \${q.diff ? q.diff.toLowerCase() : 'easy'}">\${q.diff}</span>
            </div>
            <span class="rev-badge \${badgeCls}">\${badgeText}</span>
          </div>
          <div class="rev-prompt">\${escapeHTML(q.q)}</div>
          \${q.type === 'integer' ? \`
            <div class="integer-review-answer">
              <span>Your answer: <b>\${q.isAttempted ? escapeHTML(q.userAns) : 'Not answered'}</b></span>
                  <span>Correct answer: <b>\${escapeHTML(formatQuestionAnswer(q, q.integerAnswer, true))}</b></span>
            </div>
          \` : \`
          \${q.type === 'numeric' ? \`
            <div class="integer-review-answer">
                  <span>Your answer: <b>\${q.isAttempted ? escapeHTML(q.userAns) : 'Not answered'}</b></span>
                  <span>Correct answer: <b>\${escapeHTML(formatQuestionAnswer(q, q.numericAnswer, true))}</b></span>
            </div>
            <div class="rev-exp"><h4>Worked Solution &amp; Explanation:</h4><p>\${escapeHTML(q.exp)}</p></div>
          \` : \`
          <div class="rev-opts">
            \${(q.options || []).map((opt, i) => {
              const lettr = letters[i];
                  const isCorrectOpt = Array.isArray(q.ans) ? q.ans.includes(lettr) : q.ans === lettr;
                  const isUserOpt = Array.isArray(q.userAns) ? q.userAns.includes(lettr) : q.userAns === lettr;
              let cls = '';
              if (isCorrectOpt) cls = 'correct-opt';
              else if (isUserOpt) cls = 'user-opt';

              let tag = '';
              if (isCorrectOpt && isUserOpt) tag = '<span class="rev-tag green">Your Choice & Correct</span>';
              else if (isCorrectOpt) tag = '<span class="rev-tag green">Correct Answer</span>';
              else if (isUserOpt) tag = '<span class="rev-tag red">Your Choice</span>';

              return \`
                <div class="rev-opt \${cls}">
                  <b>\${lettr}.</b>
                  <span>\${escapeHTML(opt)}</span>
                  \${tag}
                </div>
              \`;
            }).join('')}
          </div>
          <div class="rev-exp">
            <h4>Worked Solution & Explanation:</h4>
            <p>\${escapeHTML(q.exp)}</p>
          </div>
          \`}
          \`}
        </div>
      \`;
    }).join('');
  }

  function updateUserXP(res) {
    renderLevelProgress();
  }

  function drawChapterSpinWheel() {
    const canvas = document.getElementById('chapterSpinWheel');
    if (!canvas) return;
    canvas.dataset.chapterCount = String(spinItems.length);
    canvas.setAttribute('aria-label', 'Wheel with ' + spinItems.length + ' chapters from Physics, Chemistry, and Mathematics');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const center = canvas.width / 2;
    const radius = center - 7;
    const theme = getComputedStyle(document.documentElement);
    const blue = theme.getPropertyValue('--blue').trim() || '#3b8cf0';
    const gold = theme.getPropertyValue('--gold').trim() || '#f5b335';
    const goldText = theme.getPropertyValue('--onGold').trim() || '#241500';
    const slice = Math.PI * 2 / spinItems.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spinItems.forEach((item, index) => {
      const start = -Math.PI / 2 + index * slice;
      const end = start + slice;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = index % 2 ? gold : blue;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.72)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + slice / 2 + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = index % 2 ? goldText : '#ffffff';
      ctx.font = '750 10px system-ui, sans-serif';
      const subjectInitial = item.sub === 'maths' ? 'M' : item.sub.charAt(0).toUpperCase();
      const shortName = item.name.length > 13 ? item.name.slice(0, 12) + '…' : item.name;
      ctx.fillText(subjectInitial + ' · ' + shortName, 0, -radius * 0.68, 120);
      ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = gold;
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  function resetChapterSpin(exam) {
    if (spinFallbackTimer) clearTimeout(spinFallbackTimer);
    spinFallbackTimer = null;
    setActiveExam(exam);
    const chapterGroups = Object.entries(getChaptersForExam(exam))
      .map(([sub, chapters]) => ({
        sub,
        chapters: shuffle(chapters.slice()).map(chapter => ({ sub, id: Number(chapter.id), name: chapter.name }))
      }))
      .filter(group => group.chapters.length > 0);
    spinItems = [];
    while (spinItems.length < 10 && chapterGroups.some(group => group.chapters.length > 0)) {
      chapterGroups.forEach(group => {
        if (spinItems.length < 10 && group.chapters.length) spinItems.push(group.chapters.pop());
      });
    }
    shuffle(spinItems);
    spinResult = null;
    spinPendingIndex = null;
    spinBusy = false;
    spinRotation = 0;
    const wheel = document.getElementById('chapterSpinWheel');
    if (wheel) {
      wheel.style.transition = 'none';
      wheel.style.transform = 'rotate(0deg)';
      requestAnimationFrame(() => { wheel.style.transition = ''; });
    }
    const spinButton = document.getElementById('btnSpinChapter');
    const startButton = document.getElementById('btnStartSpinTest');
    const countInput = document.getElementById('spinQuestionCount');
    const result = document.getElementById('spinSelectedChapter');
    const status = document.getElementById('spinStatus');
    const error = document.getElementById('spinError');
    if (countInput) countInput.max = exam === 'advanced' ? '10' : '15';
    if (Number(countInput && countInput.value) > Number(countInput && countInput.max)) {
      countInput.value = countInput.max;
    }
    if (spinButton) spinButton.disabled = spinItems.length === 0;
    if (startButton) startButton.disabled = true;
    if (result) result.textContent = 'Your selected chapter will appear here.';
    if (status) status.textContent = 'Choose an exam, then spin to pick a chapter.';
    if (error) error.textContent = '';
    drawChapterSpinWheel();
  }

  function finishChapterSpin() {
    if (spinPendingIndex === null) return;
    if (spinFallbackTimer) clearTimeout(spinFallbackTimer);
    spinFallbackTimer = null;
    spinResult = spinItems[spinPendingIndex];
    spinPendingIndex = null;
    spinBusy = false;
    const startButton = document.getElementById('btnStartSpinTest');
    const spinButton = document.getElementById('btnSpinChapter');
    const result = document.getElementById('spinSelectedChapter');
    const status = document.getElementById('spinStatus');
    const examSelect = document.getElementById('spinExamSelect');
    if (result) result.textContent = (spinResult.sub === 'maths' ? 'Mathematics' : spinResult.sub.charAt(0).toUpperCase() + spinResult.sub.slice(1)) + ' · ' + spinResult.name;
    if (status) status.textContent = 'The wheel picked your chapter. Set your preferences and start when ready.';
    if (startButton) startButton.disabled = false;
    if (spinButton) spinButton.disabled = false;
    if (examSelect) examSelect.disabled = false;
  }

  function spinForChapter() {
    const wheel = document.getElementById('chapterSpinWheel');
    const spinButton = document.getElementById('btnSpinChapter');
    const startButton = document.getElementById('btnStartSpinTest');
    const examSelect = document.getElementById('spinExamSelect');
    const result = document.getElementById('spinSelectedChapter');
    const status = document.getElementById('spinStatus');
    const error = document.getElementById('spinError');
    if (!wheel || !spinItems.length || spinBusy) return;
    spinBusy = true;
    spinResult = null;
    spinPendingIndex = Math.floor(Math.random() * spinItems.length);
    if (spinButton) spinButton.disabled = true;
    if (startButton) startButton.disabled = true;
    if (examSelect) examSelect.disabled = true;
    if (result) result.textContent = 'The wheel is spinning…';
    if (status) status.textContent = 'Spinning…';
    if (error) error.textContent = '';
    const step = 360 / spinItems.length;
    const desiredRotation = (360 - ((spinPendingIndex + 0.5) * step % 360)) % 360;
    const currentRotation = spinRotation % 360;
    const forwardRotation = (desiredRotation - currentRotation + 360) % 360;
    spinRotation += 5 * 360 + forwardRotation;
    wheel.style.transform = 'rotate(' + spinRotation + 'deg)';
    spinFallbackTimer = setTimeout(finishChapterSpin, 5000);
  }

  function startSpinChapterQuiz() {
    const error = document.getElementById('spinError');
    const countInput = document.getElementById('spinQuestionCount');
    const durationInput = document.getElementById('spinDuration');
    const examSelect = document.getElementById('spinExamSelect');
    if (!error || !countInput || !durationInput || !spinResult || spinBusy) return;
    const questionCount = Number(countInput.value);
    const durationMinutes = Number(durationInput.value);
    const exam = examSelect ? examSelect.value : activeExam;
    if (exam !== activeExam || !getChaptersForExam(exam)[spinResult.sub].some(chapter => Number(chapter.id) === spinResult.id)) {
      error.textContent = 'Spin again after choosing your exam.';
      return;
    }
    const chapterQuestions = getQuestionsForExam(exam, spinResult.sub, spinResult.id);
    if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > chapterQuestions.length) {
      error.textContent = 'Choose between 1 and ' + chapterQuestions.length + ' questions for this chapter.';
      return;
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 300) {
      error.textContent = 'Set the test duration between 1 and 300 minutes.';
      return;
    }
    const questions = shuffle(chapterQuestions.map(question => ({
      ...question,
      exam,
      subject: spinResult.sub,
      chapterId: spinResult.id,
      chapterName: spinResult.name
    }))).slice(0, questionCount);
    questions.forEach((question, index) => { question.num = index + 1; });
    const subjectName = spinResult.sub === 'maths' ? 'Mathematics' : spinResult.sub.charAt(0).toUpperCase() + spinResult.sub.slice(1);
    error.textContent = '';
    startQuiz(
      (exam === 'advanced' ? 'JEE Advanced · ' : 'JEE Main · ') + subjectName + ' · ' + spinResult.name,
      questionCount + ' questions • ' + durationMinutes + ' minutes • Selected by the chapter wheel',
      questions,
      durationMinutes * 60
    );
  }

  // ==========================================
  // Global View & Quiz Triggers on window
  // ==========================================
  window.showChapterwise = function(sub = 'physics', exam = activeExam) {
    setActiveExam(exam);
    initializeQuizBuilder('chapter', sub);
    setView('chapter');
  };

  window.showSubjectwise = function(exam = activeExam) {
    setActiveExam(exam);
    initializeQuizBuilder('subject');
    setView('subject');
  };

  window.showMockBuilder = function(exam = activeExam) {
    setActiveExam(exam);
    const heading = document.querySelector('#mockView .view-title');
    if (heading) heading.textContent = activeExam === 'advanced' ? 'Build a JEE Advanced Mock Test' : 'Build a Mock Test';
    renderMockChapterOptions();
    setView('mock');
  };

  window.showHome = function() {
    setView('home');
  };

  window.showPocketNotes = function() {
    setView('notes');
  };

  window.showTreasureBox = function() {
    renderTreasureBox();
    setView('treasure');
  };

  window.showProfile = function() {
    renderProfile();
    setView('profile');
  };

  window.showSpinWheel = function(exam = activeExam) {
    const examSelect = document.getElementById('spinExamSelect');
    if (examSelect) examSelect.value = exam === 'advanced' ? 'advanced' : 'main';
    resetChapterSpin(exam === 'advanced' ? 'advanced' : 'main');
    spinDashboardFocus = true;
    setView('home');
    const spinPanel = document.querySelector('.spin-dashboard');
    if (spinPanel) spinPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  window.showTodo = function() {
    const plannerFrame = document.getElementById('todoPlannerFrame');
    if (plannerFrame && plannerFrame.contentWindow && dashboardProfile) {
      plannerFrame.contentWindow.postMessage({
        type: 'jeenius-exam-date',
        exam: dashboardProfile.exam,
        date: dashboardProfile.date
      }, '*');
    }
    if (typeof window.goTodo === 'function') window.goTodo();
    else setView('todo');
  };

  window.startChapterQuiz = function() {
    startConfiguredQuiz('chapter');
  };

  window.startSubjectQuiz = function() {
    startConfiguredQuiz('subject');
  };

  window.startMockQuiz = function() {
    const questionsPerSubjectInput = document.getElementById('mockQuestionsPerSubject');
    const durationInput = document.getElementById('mockDurationMinutes');
    const error = document.getElementById('mockError');
    if (!questionsPerSubjectInput || !durationInput || !error) return;

    const subjectNames = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Mathematics' };
    const subjects = [...document.querySelectorAll('#mockChapters [data-mock-subject]:not([data-mock-chapter]):checked')]
      .map(input => input.dataset.mockSubject);
    const chapters = [...document.querySelectorAll('#mockChapters [data-mock-chapter]:checked')]
      .filter(input => subjects.includes(input.dataset.mockSubject))
      .map(input => ({ sub: input.dataset.mockSubject, id: Number(input.dataset.mockChapter) }));
    const questionsPerSubject = Number(questionsPerSubjectInput.value);
    const durationMinutes = Number(durationInput.value);
    const chaptersPerSubject = subjects.map(sub => ({
      sub,
      chapters: chapters.filter(chapter => chapter.sub === sub)
    }));
    const integerCounts = activeExam === 'advanced' ? {} : Object.fromEntries(subjects.map(sub => {
      const id = 'mockInteger' + sub.charAt(0).toUpperCase() + sub.slice(1);
      return [sub, Number(document.getElementById(id).value)];
    }));

    if (subjects.length === 0 || chaptersPerSubject.some(item => item.chapters.length === 0)) {
      error.textContent = 'Select at least one chapter for every selected subject.';
      return;
    }
    const maxPerSubject = Math.min(...chaptersPerSubject.map(item =>
      item.chapters.reduce((total, chapter) =>
        total + getActiveQuestionsForChapter(item.sub, chapter.id).length,
        0
      )
    ));
    if (!Number.isInteger(questionsPerSubject) || questionsPerSubject < 1 || questionsPerSubject > maxPerSubject) {
      error.textContent = \`Choose between 1 and \${maxPerSubject} questions per subject.\`;
      return;
    }
    if (activeExam === 'main') {
      for (const subject of chaptersPerSubject) {
        const integerCount = integerCounts[subject.sub];
        const availableInteger = subject.chapters
          .flatMap(chapter => getActiveQuestionsForChapter(subject.sub, chapter.id))
          .filter(question => getIntegerAnswer(question) !== null).length;
        if (!Number.isInteger(integerCount) || integerCount < 0 || integerCount > questionsPerSubject) {
          error.textContent = \`Set the \${subjectNames[subject.sub]} integer-question count between 0 and \${questionsPerSubject}.\`;
          return;
        }
        if (integerCount > availableInteger) {
          error.textContent = \`Only \${availableInteger} integer-answer questions are available for \${subjectNames[subject.sub]} in the selected chapters.\`;
          return;
        }
      }
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 300) {
      error.textContent = 'Set the mock duration between 1 and 300 minutes.';
      return;
    }

    const questions = chaptersPerSubject.flatMap(subject => {
      const pool = subject.chapters.flatMap(chapter =>
        getActiveQuestionsForChapter(subject.sub, chapter.id).map(question => ({
          ...question,
          exam: activeExam,
          subject: subject.sub,
          chapterId: chapter.id,
          chapterName: (getActiveChaptersData()[subject.sub] || []).find(item => item.id === chapter.id).name
        }))
      );
      if (activeExam === 'advanced') return shuffle(pool).slice(0, questionsPerSubject);
      const integerCount = integerCounts[subject.sub];
      const integerCandidates = shuffle(pool.filter(question => getIntegerAnswer(question) !== null));
      const integerQuestions = integerCandidates.slice(0, integerCount).map(question => ({
        ...question,
        type: 'integer',
        integerAnswer: getIntegerAnswer(question),
        options: [],
        ans: null
      }));
      const integerQuestionSet = new Set(integerCandidates.slice(0, integerCount));
      const multipleChoiceQuestions = shuffle(pool.filter(question => !integerQuestionSet.has(question)))
        .slice(0, questionsPerSubject - integerCount);
      return [...integerQuestions, ...multipleChoiceQuestions];
    });
    shuffle(questions);
    questions.forEach((question, i) => { question.num = i + 1; });
    const questionCount = questions.length;
    const subjectsLabel = subjects.map(sub => subjectNames[sub]).join(' + ');
    const chapterLabel = chapters.length === 1 ? '1 chapter' : \`\${chapters.length} chapters\`;
    startQuiz(
      (activeExam === 'advanced' ? 'JEE Advanced · ' : '') + (subjects.length === 3 ? 'Full Mock: All Subjects' : \`Custom Mock: \${subjectsLabel}\`),
      \`\${questionCount} Questions • \${questionsPerSubject} per subject • \${subjectsLabel} • \${chapterLabel} • \${durationMinutes} minutes\`,
      questions,
      durationMinutes * 60
    );
  };

  window.exitQuiz = function() {
    if (typeof window.confirm !== 'function' || window.confirm('Are you sure you want to exit? Your quiz progress will be lost.')) {
      if (activeQuiz && activeQuiz.timerId) clearInterval(activeQuiz.timerId);
      activeQuiz = null;
      setView(quizOriginView);
    }
  };

  window.submitQuiz = submitQuiz;

  // ==========================================
  // Event Delegation Listener on document
  // ==========================================
  document.addEventListener('click', e => {
    if (e.target.closest('#btnSpinChapter')) {
      spinForChapter();
      return;
    }
    if (e.target.closest('#btnStartSpinTest')) {
      startSpinChapterQuiz();
      return;
    }
    if (e.target.closest('#btnAdvancedChapterwise')) {
      window.showChapterwise(curSubTab, 'advanced');
      return;
    }
    if (e.target.closest('#btnAdvancedSubjectwise')) {
      window.showSubjectwise('advanced');
      return;
    }
    if (e.target.closest('#btnAdvancedMockMode')) {
      window.showMockBuilder('advanced');
      return;
    }

    // 1. Chapter-wise triggers
    const bChap = e.target.closest('#btnChapterwise') || (e.target.closest('.tile') && e.target.closest('.tile').textContent.includes('Chapter-wise'));
    if (bChap) {
      window.showChapterwise(curSubTab, 'main');
      return;
    }

    // 2. Subject-wise triggers
    const bSubj = e.target.closest('#btnSubjectwise') || (e.target.closest('.tile') && e.target.closest('.tile').textContent.includes('Subject-wise'));
    if (bSubj) {
      window.showSubjectwise('main');
      return;
    }

    if (e.target.closest('#btnMockMode') || (e.target.closest('.tile') && e.target.closest('.tile').textContent.includes('Full Mocks'))) {
      window.showMockBuilder('main');
      return;
    }
    if (e.target.closest('#btnPocketNotes') || (e.target.closest('.tile') && e.target.closest('.tile').textContent.includes('Pocket Notes'))) {
      window.showPocketNotes();
      return;
    }

    if (e.target.closest('#mockSelectAllSubjects') || e.target.closest('#mockClearAllSubjects')) {
      const shouldCheck = Boolean(e.target.closest('#mockSelectAllSubjects'));
      document.querySelectorAll('#mockChapters [data-mock-subject]:not([data-mock-chapter])').forEach(input => {
        input.checked = shouldCheck;
      });
      updateMockBuilderSummary();
      return;
    }
    if (e.target.closest('#mockSelectAll') || e.target.closest('#mockClearAll')) {
      const shouldCheck = Boolean(e.target.closest('#mockSelectAll'));
      const selectedSubjects = [...document.querySelectorAll('#mockChapters [data-mock-subject]:not([data-mock-chapter]):checked')]
        .map(input => input.dataset.mockSubject);
      document.querySelectorAll('#mockChapters [data-mock-chapter]').forEach(input => {
        if (selectedSubjects.includes(input.dataset.mockSubject)) input.checked = shouldCheck;
      });
      updateMockBuilderSummary();
      return;
    }
    if (e.target.closest('#btnGenerateMock')) {
      window.startMockQuiz();
      return;
    }

    // 3. Back buttons
    if (e.target.closest('#backFromChap') || e.target.closest('#btnResBackToChapters')) {
      window.showChapterwise(curSubTab);
      return;
    }
    if (e.target.closest('#backFromSubj') || e.target.closest('#btnResBackHome')) {
      window.showHome();
      return;
    }

    const treasurePractice = e.target.closest('[data-practice-treasure]');
    if (treasurePractice) {
      startTreasurePractice(Number(treasurePractice.dataset.practiceTreasure));
      return;
    }

    // 4. Nav items
    const bNav = e.target.closest('#nav button');
    if (bNav) {
      const txt = bNav.textContent.trim();
      if (txt === 'Home') window.showHome();
      else if (txt.startsWith('Questions')) window.showChapterwise(curSubTab);
      else if (txt.includes('Subject')) window.showSubjectwise();
      else if (bNav.id === 'navSpin') window.showSpinWheel();
      else if (txt === 'Notes') window.showPocketNotes();
      else if (bNav.id === 'navTreasure') window.showTreasureBox();
      else if (bNav.id === 'navProfile') window.showProfile();
      return;
    }

    if (e.target.closest('#btnGenerateChapterQuiz')) {
      window.startChapterQuiz();
      return;
    }

    if (e.target.closest('#btnGenerateSubjectQuiz')) {
      window.startSubjectQuiz();
      return;
    }

    const subjectTab = e.target.closest('#quizSubjectMenu [data-quiz-subject]');
    if (subjectTab && activeQuiz) {
      quizSubjectFilter = subjectTab.dataset.quizSubject;
      if (quizSubjectFilter !== 'all') {
        const firstQuestion = activeQuiz.questions.findIndex(q => q.subject === quizSubjectFilter);
        if (firstQuestion !== -1) activeQuiz.curIdx = firstQuestion;
      }
      renderQuestion();
      renderPalette();
      return;
    }

    // 8. Quiz Options Choice
    const optCard = e.target.closest('#qOptions .opt-card');
    if (optCard && activeQuiz) {
      const choice = optCard.dataset.choice;
      const question = activeQuiz.questions[activeQuiz.curIdx];
      if (question.type === 'multi') {
        const selected = Array.isArray(activeQuiz.answers[activeQuiz.curIdx])
          ? activeQuiz.answers[activeQuiz.curIdx]
          : [];
        activeQuiz.answers[activeQuiz.curIdx] = selected.includes(choice)
          ? selected.filter(item => item !== choice)
          : [...selected, choice];
      } else {
        activeQuiz.answers[activeQuiz.curIdx] = choice;
      }
      renderQuestion();
      renderPalette();
      return;
    }

    // 9. Clear Choice
    if (e.target.closest('#btnClearQ') && activeQuiz) {
      delete activeQuiz.answers[activeQuiz.curIdx];
      renderQuestion();
      renderPalette();
      return;
    }

    // 10. Mark Review
    if (e.target.closest('#btnMarkReview') && activeQuiz) {
      activeQuiz.marked[activeQuiz.curIdx] = !activeQuiz.marked[activeQuiz.curIdx];
      renderQuestion();
      renderPalette();
      return;
    }

    // 11. Navigation Next/Prev
    if (e.target.closest('#btnPrevQ') && activeQuiz && activeQuiz.curIdx > 0) {
      activeQuiz.curIdx--;
      renderQuestion();
      renderPalette();
      return;
    }
    if (e.target.closest('#btnNextQ') && activeQuiz && activeQuiz.curIdx < activeQuiz.questions.length - 1) {
      activeQuiz.curIdx++;
      renderQuestion();
      renderPalette();
      return;
    }

    // 12. Palette jump
    const palBtn = e.target.closest('.pal-btn[data-goto]');
    if (palBtn && activeQuiz) {
      activeQuiz.curIdx = parseInt(palBtn.dataset.goto);
      renderQuestion();
      renderPalette();
      return;
    }

    // 13. Exit Quiz
    if (e.target.closest('#btnExitQuiz')) {
      window.exitQuiz();
      return;
    }

    // 14. Submit Quiz
    if (e.target.closest('#btnSubmitQuiz')) {
      window.submitQuiz(false);
      return;
    }

    // 15. Retake Quiz
    if (e.target.closest('#btnRetakeQuiz') && lastResult) {
      startQuiz(lastResult.title, lastResult.subTitle, lastResult.questions.map((q, i) => ({ ...q, num: i + 1 })));
      return;
    }

    // 16. Scroll to review
    if (e.target.closest('#btnScrollReview')) {
      const el = document.getElementById('reviewSec');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 17. Review Filters
    const rfBtn = e.target.closest('#rfFilterGroup .rf-btn');
    if (rfBtn && lastResult) {
      document.querySelectorAll('#rfFilterGroup .rf-btn').forEach(b => b.classList.toggle('on', b === rfBtn));
      reviewFilter = rfBtn.dataset.f;
      renderReviewList();
      return;
    }
  });

  document.addEventListener('click', e => {
    const selectionButton = e.target.closest('#chapterQuizSelectAll, #chapterQuizClearAll, #subjectQuizSelectAll, #subjectQuizClearAll');
    if (!selectionButton) return;
    const mode = selectionButton.id.startsWith('chapter') ? 'chapter' : 'subject';
    const selectAll = selectionButton.id.endsWith('SelectAll');
    getQuizBuilderSubjects(mode).forEach(subject => {
      const chapters = getActiveChaptersData()[subject] || [];
      quizBuilderSelections[mode].set(subject, selectAll ? chapters.map(ch => Number(ch.id)) : []);
    });
    renderQuizBuilderChapters(mode);
    const error = document.getElementById(mode + 'QuizError');
    if (error) error.textContent = '';
  });

  document.addEventListener('change', e => {
    if (e.target.matches('#spinExamSelect')) {
      resetChapterSpin(e.target.value === 'advanced' ? 'advanced' : 'main');
      return;
    }
    if (e.target.matches('#mockChapters [data-mock-subject], #mockChapters [data-mock-chapter]')) {
      updateMockBuilderSummary();
    }
    if (e.target.matches('#subjectQuizSubject')) {
      renderQuizBuilderChapters('subject');
      updateQuizBuilderLimit('subject');
      const error = document.getElementById('subjectQuizError');
      if (error) error.textContent = '';
    }
    if (e.target.matches('#chapterQuizChapters [data-builder-subject-toggle]')) {
      const subject = e.target.dataset.builderSubjectToggle;
      const selectedIds = e.target.checked
        ? (getActiveChaptersData()[subject] || []).map(ch => Number(ch.id))
        : [];
      quizBuilderSelections.chapter.set(subject, selectedIds);
      renderQuizBuilderChapters('chapter');
      const error = document.getElementById('chapterQuizError');
      if (error) error.textContent = '';
    }
    if (e.target.matches('#chapterQuizChapters [data-builder-chapter], #subjectQuizChapters [data-builder-chapter]')) {
      const mode = e.target.closest('#chapterQuizChapters') ? 'chapter' : 'subject';
      storeQuizBuilderSelection(mode);
      renderQuizBuilderChapters(mode);
      const error = document.getElementById(mode + 'QuizError');
      if (error) error.textContent = '';
    }
  });

  const spinWheelCanvas = document.getElementById('chapterSpinWheel');
  if (spinWheelCanvas) {
    spinWheelCanvas.addEventListener('transitionend', e => {
      if (e.propertyName === 'transform' && spinBusy) finishChapterSpin();
    });
  }
  resetChapterSpin(activeExam);
  new MutationObserver(drawChapterSpinWheel).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  document.addEventListener('input', e => {
    if (e.target.matches('#integerAnswer') && activeQuiz && ['integer', 'numeric'].includes(activeQuiz.questions[activeQuiz.curIdx].type)) {
      activeQuiz.answers[activeQuiz.curIdx] = e.target.value;
      renderPalette();
      return;
    }
    if (e.target.matches('#mockQuestionsPerSubject, #mockDurationMinutes, #mockIntegerPhysics, #mockIntegerChemistry, #mockIntegerMaths')) {
      updateMockBuilderSummary();
      const error = document.getElementById('mockError');
      if (error) error.textContent = '';
    }
    if (e.target.matches('#chapterQuizCount, #subjectQuizCount')) {
      const mode = e.target.id.startsWith('chapter') ? 'chapter' : 'subject';
      const error = document.getElementById(mode + 'QuizError');
      if (error) error.textContent = '';
    }
  });

  // Keyboard navigation for Quiz
  window.addEventListener('keydown', e => {
    if (curView !== 'quiz' || !activeQuiz) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (e.key === 'ArrowRight' && activeQuiz.curIdx < activeQuiz.questions.length - 1) {
      activeQuiz.curIdx++;
      renderQuestion();
      renderPalette();
    } else if (e.key === 'ArrowLeft' && activeQuiz.curIdx > 0) {
      activeQuiz.curIdx--;
      renderQuestion();
      renderPalette();
    } else if (['1', '2', '3', '4', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
      const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D' };
      const choice = map[e.key] || e.key.toUpperCase();
      activeQuiz.answers[activeQuiz.curIdx] = choice;
      renderQuestion();
      renderPalette();
    }
  });

  initializeQuizBuilder('chapter');
  initializeQuizBuilder('subject');
})();
`;

module.exports = { quizClientJS };
