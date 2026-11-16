// additions.js - HTML template sections for Chapter-wise, Subject-wise, Mock, Quiz, and Result views
const dashboardAdditions = `
    <section id="notesView" class="view-panel notes-view">
      <div class="view-header">
        <div class="view-title-group">
          <h2 class="view-title">Pocket Notes</h2>
          <p class="view-sub">Write, draw, and save your study notes.</p>
        </div>
        <button class="btn-back" id="backFromNotes" onclick="window.showHome()">← Back to Dashboard</button>
      </div>
      <div class="notes-frame-wrap">
        <iframe id="pocketNotesFrame" title="Pocket Notes" srcdoc=""></iframe>
      </div>
    </section>

    <section id="todoPlannerView" class="view-panel todo-planner-view">
      <div class="view-header">
        <div class="view-title-group">
          <h2 class="view-title">Study Planner</h2>
          <p class="view-sub">Plan study tasks, exams, and reminders.</p>
        </div>
        <button class="btn-back" onclick="window.showHome()">← Back to Dashboard</button>
      </div>
      <div class="todo-planner-frame-wrap">
        <iframe id="todoPlannerFrame" title="Study Planner" srcdoc=""></iframe>
      </div>
    </section>

    <section id="treasureView" class="view-panel">
      <div class="view-header">
        <div class="view-title-group">
          <h2 class="view-title">Treasure Box</h2>
          <p class="view-sub">Questions you got wrong, saved for review, with related chapter practice.</p>
        </div>
        <button class="btn-back" onclick="window.showHome()">← Back to Dashboard</button>
      </div>
      <div class="treasure-summary" id="treasureSummary" aria-live="polite"></div>
      <p class="treasure-error" id="treasureError" role="alert" aria-live="polite"></p>
      <div class="treasure-list" id="treasureList"></div>
    </section>

    <section id="profileView" class="view-panel">
      <div class="view-header">
        <div class="view-title-group">
          <h2 class="view-title">About You</h2>
          <p class="view-sub">Your JEE preparation profile.</p>
        </div>
        <button class="btn-back" onclick="window.showHome()">← Back to Dashboard</button>
      </div>
      <div class="profile-details" id="profileDetails" aria-live="polite"></div>
    </section>

    <!-- Chapter-wise Questions View -->
    <section id="chapterView" class="view-panel">
      <div class="view-header">
        <div class="view-title-group">
          <h2 class="view-title">Chapter-wise Question Bank</h2>
          <p class="view-sub">Select chapters across any subjects, then set the total question count and time.</p>
        </div>
        <button class="btn-back" id="backFromChap" onclick="window.showHome()">← Back to Dashboard</button>
      </div>

      <div class="quiz-builder" id="chapterQuizBuilder">
        <h3>Set up your chapter-wise quiz</h3>
        <div class="builder-chapter-toolbar">
          <span>Select subjects and chapters</span>
          <div class="builder-selection-actions">
            <button type="button" id="chapterQuizSelectAll">Select all</button>
            <button type="button" id="chapterQuizClearAll">Clear all</button>
          </div>
        </div>
        <div class="quiz-builder-chapters" id="chapterQuizChapters"></div>
        <div class="quiz-builder-fields">
          <label class="quiz-builder-field">Total number of questions
            <input id="chapterQuizCount" type="number" min="1" max="15" value="15" inputmode="numeric">
          </label>
          <label class="quiz-builder-field">Time limit
            <select id="chapterQuizDuration" class="subj-sel">
              <option value="10">10 minutes</option>
              <option value="20" selected>20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
        </div>
        <p class="quiz-builder-error" id="chapterQuizError" role="alert" aria-live="polite"></p>
        <button class="chap-btn quiz-generate-btn" id="btnGenerateChapterQuiz" type="button">Generate Quiz →</button>
      </div>
    </section>

    <!-- Subject-wise Practice View -->
    <section id="subjectView" class="view-panel">
      <div class="view-header">
        <div class="view-title-group">
          <h2 class="view-title">Subject-wise Practice</h2>
          <p class="view-sub">Choose one subject and one or more chapters, then set the total question count and time.</p>
        </div>
        <button class="btn-back" id="backFromSubj" onclick="window.showHome()">← Back to Dashboard</button>
      </div>

      <div class="quiz-builder" id="subjectQuizBuilder">
        <h3>Set up your subject-wise quiz</h3>
        <div class="quiz-builder-fields">
          <label class="quiz-builder-field">Subject
            <select id="subjectQuizSubject" class="subj-sel">
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="maths">Mathematics</option>
            </select>
          </label>
          <label class="quiz-builder-field">Total number of questions
            <input id="subjectQuizCount" type="number" min="1" max="15" value="15" inputmode="numeric">
          </label>
          <label class="quiz-builder-field">Time limit
            <select id="subjectQuizDuration" class="subj-sel">
              <option value="10">10 minutes</option>
              <option value="20" selected>20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
        </div>
        <div class="builder-chapter-toolbar">
          <span>Select one or more chapters</span>
          <div class="builder-selection-actions">
            <button type="button" id="subjectQuizSelectAll">Select all</button>
            <button type="button" id="subjectQuizClearAll">Clear all</button>
          </div>
        </div>
        <div class="quiz-builder-chapters subject-builder-chapters" id="subjectQuizChapters"></div>
        <p class="quiz-builder-error" id="subjectQuizError" role="alert" aria-live="polite"></p>
        <button class="chap-btn quiz-generate-btn" id="btnGenerateSubjectQuiz" type="button">Generate Quiz →</button>
      </div>
    </section>

    <!-- Custom Mock Builder -->
    <section id="mockView" class="view-panel">
      <div class="view-header">
        <div class="view-title-group">
          <h2 class="view-title">Build a Mock Test</h2>
          <p class="view-sub">Choose subjects and chapters, then set how many questions to take from each subject and the time limit.</p>
        </div>
        <button class="btn-back" onclick="window.showHome()">← Back to Dashboard</button>
      </div>

      <div class="mock-builder">
        <div class="mock-panel">
          <h3>1. Choose subjects and chapters</h3>
          <div class="mock-chapter-actions">
            <button type="button" id="mockSelectAllSubjects">Select all subjects</button>
            <button type="button" id="mockClearAllSubjects">Clear subjects</button>
            <button type="button" id="mockSelectAll">Select all</button>
            <button type="button" id="mockClearAll">Clear selection</button>
          </div>
          <div id="mockChapters" class="mock-chapters"></div>
        </div>

        <div class="mock-panel">
          <h3>2. Set your mock</h3>
          <label class="mock-field" for="mockQuestionsPerSubject">Questions per selected subject
            <input id="mockQuestionsPerSubject" type="number" min="1" max="150" value="15">
          </label>
          <div class="mock-integer-section">
            <h4>Integer-answer questions</h4>
            <p>Choose how many integer-answer questions to include from each selected subject.</p>
            <div class="mock-integer-counts" aria-label="Integer-answer questions by subject">
              <label class="mock-field" data-mock-integer-group="physics" for="mockIntegerPhysics">Physics integer questions
                <input id="mockIntegerPhysics" type="number" min="0" max="15" value="0">
                <small data-mock-integer-hint="physics"></small>
              </label>
              <label class="mock-field" data-mock-integer-group="chemistry" for="mockIntegerChemistry">Chemistry integer questions
                <input id="mockIntegerChemistry" type="number" min="0" max="15" value="0">
                <small data-mock-integer-hint="chemistry"></small>
              </label>
              <label class="mock-field" data-mock-integer-group="maths" for="mockIntegerMaths">Mathematics integer questions
                <input id="mockIntegerMaths" type="number" min="0" max="15" value="0">
                <small data-mock-integer-hint="maths"></small>
              </label>
            </div>
          </div>
          <label class="mock-field" for="mockDurationMinutes">Time limit (minutes)
            <input id="mockDurationMinutes" type="number" min="1" max="300" value="30">
          </label>
          <p id="mockSummary" class="mock-summary" aria-live="polite">Choose subjects to show chapters.</p>
          <p id="mockError" class="mock-error" role="alert"></p>
          <button class="chap-btn mock-generate" id="btnGenerateMock">Generate Mock →</button>
        </div>
      </div>
    </section>

    <!-- Active Quiz View -->
    <section id="quizView" class="view-panel">
      <div class="quiz-top-bar">
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="btn-back" id="btnExitQuiz" onclick="window.exitQuiz()">← Exit Quiz</button>
          <div class="quiz-info">
            <h2 id="quizTitle">Physics • Chapter 1: Units &amp; Dimensions</h2>
            <p id="quizSub">Practice Quiz • 15 Questions • Answers shown last</p>
          </div>
        </div>
        <div class="quiz-meta-right">
          <div style="font-size:14px;color:var(--silver);">Question <b id="qCurNum" style="color:var(--gold);">1</b> of <span id="qTotalNum">15</span></div>
          <div class="quiz-timer" id="quizTimer">
            <svg style="width:18px;height:18px;fill:currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            <span id="timerDisplay">20:00</span>
          </div>
        </div>
      </div>

      <div class="quiz-prog-bar">
        <div class="quiz-prog-fill" id="quizProgFill" style="width: 6.6%;"></div>
      </div>

      <div id="quizSubjectMenu" class="quiz-subject-menu" aria-label="Filter questions by subject" hidden></div>

      <div class="quiz-main-layout">
        <!-- Question Content -->
        <div class="quiz-question-box">
          <div class="q-header">
            <span class="q-num" id="qBadgeNum">Q1</span>
            <span class="diff-badge easy" id="qDiffBadge">Easy</span>
          </div>

          <div class="q-text" id="qPrompt">Loading question prompt...</div>

          <div class="q-options" id="qOptions"></div>

          <div class="quiz-actions">
            <div style="display:flex;gap:10px;">
              <button class="btn-nav" id="btnPrevQ">← Previous</button>
              <button class="btn-mark" id="btnMarkReview">☆ Mark for Review</button>
              <button class="btn-nav" id="btnClearQ">Clear Choice</button>
            </div>
            <div style="display:flex;gap:10px;">
              <button class="btn-nav" id="btnNextQ">Next →</button>
              <button class="btn-submit" id="btnSubmitQuiz" onclick="window.submitQuiz(false)">Submit Test →</button>
            </div>
          </div>
        </div>

        <!-- Question Palette -->
        <div class="quiz-palette">
          <div class="palette-head">
            <span>Questions</span>
            <span id="palSummary" style="font-size:12px;color:var(--gold);font-weight:600;">0 / 15 Answered</span>
          </div>
          <div class="palette-grid" id="palGrid"></div>
          <div class="pal-legend">
            <div class="pal-legend-row"><span class="pal-dot" style="background:#34d399;"></span> Answered</div>
            <div class="pal-legend-row"><span class="pal-dot" style="background:#a855f7;"></span> Marked for Review</div>
            <div class="pal-legend-row"><span class="pal-dot" style="background:var(--line);"></span> Not Answered</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quiz Result & Solutions View -->
    <section id="resultView" class="view-panel">
      <div class="result-card">
        <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
          <h2 class="view-title">Quiz Completed!</h2>
          <p class="view-sub" style="font-size:15px;">Detailed score analysis and worked solutions for every question</p>
        </div>

        <div class="score-circle-wrap">
          <svg viewBox="0 0 170 170">
            <circle cx="85" cy="85" r="72" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="12" />
            <circle id="resCircle" cx="85" cy="85" r="72" fill="none" stroke="var(--gold)" stroke-width="12" stroke-linecap="round" stroke-dasharray="452.4" stroke-dashoffset="452.4" style="transition: stroke-dashoffset 1s ease-out;" />
          </svg>
          <div class="score-circle-text">
            <b id="resPercent">0%</b>
            <span id="resRatio">0 of 15 correct</span>
          </div>
        </div>

        <div class="res-stats">
          <div class="res-stat-card"><small>Correct</small><b id="resCorrect" style="color:#34d399">0</b></div>
          <div class="res-stat-card"><small>Incorrect</small><b id="resIncorrect" style="color:#ef4444">0</b></div>
          <div class="res-stat-card"><small>Unattempted</small><b id="resUnattempted" style="color:var(--muted)">0</b></div>
          <div class="res-stat-card"><small>Total Score</small><b id="resScore" style="color:var(--gold)">0 / 60</b></div>
        </div>

        <div class="res-xp" id="resXP">XP Gained: <b>+0 XP</b></div>

        <div class="res-btns">
          <button class="res-btn primary" id="btnScrollReview">Review Solutions ↓</button>
          <button class="res-btn secondary" id="btnRetakeQuiz">Retake Quiz</button>
          <button class="res-btn secondary" id="btnResBackToChapters" onclick="window.showChapterwise()">Back to Chapters</button>
          <button class="res-btn secondary" id="btnResBackHome" onclick="window.showHome()">Return to Dashboard</button>
        </div>
      </div>

      <!-- Solutions Review Section -->
      <div class="review-section" id="reviewSec">
        <div class="review-header">
          <div>
            <h3 style="font-size:20px;font-weight:800;color:var(--text);">Worked Solutions &amp; Explanations</h3>
            <p style="font-size:13px;color:var(--muted);">All questions with step-by-step reasoning</p>
          </div>
          <div class="review-filters" id="rfFilterGroup">
            <button class="rf-btn on" data-f="all">All (<span id="rfAllCount">15</span>)</button>
            <button class="rf-btn" data-f="incorrect">Incorrect (<span id="rfIncorrCount">0</span>)</button>
            <button class="rf-btn" data-f="correct">Correct (<span id="rfCorrCount">0</span>)</button>
            <button class="rf-btn" data-f="unattempted">Unattempted (<span id="rfUnattCount">0</span>)</button>
          </div>
        </div>

        <div id="reviewList" style="display:flex;flex-direction:column;gap:16px;"></div>
      </div>
    </section>
`;

module.exports = { dashboardAdditions };
