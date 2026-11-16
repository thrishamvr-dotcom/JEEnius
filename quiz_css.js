// Full Quiz & Mode Styles for JEEnius
const quizStyles = `
/* ========================================================
   Chapter-wise, Subject-wise, Quiz & Result Views CSS
======================================================== */
#dash {
  --silver: var(--text);
  --card: var(--glass);
  --panel: var(--p2);
  --side: var(--p1);
}
main.chapter-mode .home-only,
main.subject-mode .home-only,
main.mock-mode .home-only,
main.quiz-mode .home-only,
main.result-mode .home-only,
main.notes-mode .home-only,
main.treasure-mode .home-only,
main.profile-mode .home-only,
main.todo .home-only {
  display: none !important;
}

main:not(.chapter-mode) #chapterView { display: none !important; }
main:not(.subject-mode) #subjectView { display: none !important; }
main:not(.mock-mode) #mockView { display: none !important; }
main:not(.quiz-mode) #quizView { display: none !important; }
main:not(.result-mode) #resultView { display: none !important; }
main:not(.notes-mode) #notesView { display: none !important; }
main:not(.treasure-mode) #treasureView { display: none !important; }
main:not(.profile-mode) #profileView { display: none !important; }
main:not(.todo) #todoPlannerView { display: none !important; }
main.todo #todoView { display: none !important; }

main.chapter-mode #chapterView { display: flex !important; flex-direction: column; gap: 20px; animation: rise .4s ease-out; }
main.subject-mode #subjectView { display: flex !important; flex-direction: column; gap: 20px; animation: rise .4s ease-out; }
main.mock-mode #mockView { display: flex !important; flex-direction: column; gap: 20px; animation: rise .4s ease-out; }
main.quiz-mode #quizView { display: flex !important; flex-direction: column; gap: 20px; animation: rise .4s ease-out; }
main.result-mode #resultView { display: flex !important; flex-direction: column; gap: 20px; animation: rise .4s ease-out; }
main.notes-mode #notesView { display: flex !important; flex-direction: column; gap: 16px; animation: rise .4s ease-out; }
main.treasure-mode #treasureView { display: flex !important; flex-direction: column; gap: 16px; animation: rise .4s ease-out; }
main.profile-mode #profileView { display: flex !important; flex-direction: column; gap: 20px; animation: rise .4s ease-out; }
main.todo #todoPlannerView { display: flex !important; flex-direction: column; gap: 16px; animation: rise .4s ease-out; }
.notes-frame-wrap { width: 100%; min-height: 72vh; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; background: #050d1b; }
.notes-frame-wrap iframe { display: block; width: 100%; height: 72vh; min-height: 620px; border: 0; background: #050d1b; }
.todo-planner-frame-wrap { width: 100%; min-height: 72vh; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; background: #050b18; }
.todo-planner-frame-wrap iframe { display: block; width: 100%; height: 72vh; min-height: 620px; border: 0; background: #050b18; }
.treasure-summary { color: var(--silver); font-size: 13px; }
.treasure-error { min-height: 0; margin: 0; color: #fca5a5; font-size: 13px; }
.treasure-error:empty { display: none; }
.treasure-list { display: flex; flex-direction: column; gap: 14px; }
.treasure-empty { padding: 28px; border: 1px dashed var(--line); border-radius: 18px; color: var(--muted); text-align: center; background: rgba(255,255,255,.025); }
.treasure-card { padding: 20px; border: 1px solid var(--line); border-radius: 18px; background: linear-gradient(145deg, var(--card), var(--panel)); display: flex; flex-direction: column; gap: 12px; }
.treasure-card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.treasure-card-title { margin: 0; color: #fff; font-size: 15px; line-height: 1.5; }
.treasure-card-meta { color: var(--gold); font-size: 11px; font-weight: 750; }
.treasure-answer { color: var(--silver); font-size: 13px; }
.treasure-answer b { color: #34d399; }
.treasure-explanation { color: var(--muted); font-size: 12px; line-height: 1.5; }
.treasure-practice { align-self: flex-start; padding: 9px 14px; border: 1px solid rgba(245,179,53,.35); border-radius: 10px; background: rgba(245,179,53,.1); color: var(--gold); font: inherit; font-size: 12px; font-weight: 750; cursor: pointer; }
.treasure-practice:hover { background: rgba(245,179,53,.2); }
.profile-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.profile-detail { min-width: 0; padding: 20px; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(145deg, var(--card), var(--panel)); }
.profile-detail-label { margin-bottom: 8px; color: var(--muted); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.profile-detail-value { color: #fff; font-size: 18px; font-weight: 750; overflow-wrap: anywhere; }
.profile-welcome { grid-column: 1 / -1; color: var(--silver); font-size: 14px; line-height: 1.6; }
.study-exam-panels { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.study-exam-panel { min-width: 0; padding: 18px; border: 1px solid var(--glassb); border-radius: 22px; background: var(--glass); -webkit-backdrop-filter: blur(22px) saturate(1.6); backdrop-filter: blur(22px) saturate(1.6); box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 14px 32px rgba(0,0,0,.24); }
.study-exam-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.study-exam-icon { width: 42px; height: 42px; display: grid; place-items: center; flex: none; border: 1px solid rgba(245,179,53,.4); border-radius: 13px; background: rgba(245,179,53,.13); color: var(--gold); font-size: 19px; font-weight: 850; }
.study-exam-heading h3 { margin: 0 0 3px; color: var(--text); font-size: 19px; }
.study-exam-heading p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.4; }
.study-exam-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.study-exam-actions .tile { width: 100%; min-width: 0; min-height: 100px; padding: 14px 10px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 8px; text-align: left; }
.study-exam-actions .tile div { min-width: 0; font-size: 13px; font-weight: 750; }
.study-exam-actions .tile small { display: block; margin-top: 4px; color: var(--muted); font-size: 10px; line-height: 1.35; }
.study-exam-advanced { border-color: rgba(255,255,255,.14); }
.study-exam-actions .tile:disabled { opacity: .48; cursor: not-allowed; filter: grayscale(.35); transform: none; }
.study-resources { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.study-resources .tile { min-height: 70px; padding: 14px 18px; display: flex; align-items: center; justify-content: flex-start; gap: 12px; text-align: left; }
.study-resources .tile div { font-size: 13px; font-weight: 750; }
.study-resources .tile small { display: block; margin-top: 4px; color: var(--muted); font-size: 10px; }
@media(max-width:1000px){.study-exam-panels{grid-template-columns:1fr}}
@media(max-width:760px){.study-resources{grid-template-columns:1fr}}

.spin-dashboard { margin: 20px 0; padding: 22px; border: 1px solid var(--glassb); border-radius: 24px; background: linear-gradient(135deg, var(--glass), var(--p2)); box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 16px 38px rgba(0,0,0,.2); }
.spin-dashboard-heading { display: flex; justify-content: space-between; align-items: center; gap: 18px; margin-bottom: 18px; }
.spin-eyebrow { color: var(--gold); font-size: 10px; font-weight: 850; letter-spacing: .14em; }
.spin-dashboard-heading h2 { margin: 4px 0; color: var(--text); font-size: 24px; font-weight: 850; }
.spin-dashboard-heading p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.5; }
.spin-exam-field { display: grid; gap: 6px; min-width: 170px; color: var(--muted); font-size: 11px; font-weight: 750; }
.spin-dashboard-layout { display: grid; grid-template-columns: minmax(260px, .8fr) minmax(300px, 1.2fr); align-items: center; gap: 20px; }
.spin-wheel-card, .spin-settings { min-width: 0; padding: 18px; border: 1px solid var(--line); border-radius: 20px; background: linear-gradient(145deg, var(--card), var(--panel)); }
.spin-wheel-card { display: flex; flex-direction: column; align-items: center; text-align: center; }
.spin-wheel-wrap { position: relative; width: min(100%, 360px); aspect-ratio: 1; margin: 0 auto 14px; }
.spin-wheel-canvas { display: block; width: 100%; height: 100%; border-radius: 50%; filter: drop-shadow(0 10px 24px rgba(0,0,0,.24)); transition: transform 4.5s cubic-bezier(.12,.72,.08,1); }
.spin-pointer { position: absolute; z-index: 2; top: -3px; left: 50%; width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 25px solid var(--gold); transform: translateX(-50%); filter: drop-shadow(0 2px 3px rgba(0,0,0,.45)); }
.spin-wheel-center { position: absolute; top: 50%; left: 50%; width: 44px; height: 44px; display: grid; place-items: center; border: 3px solid var(--gold); border-radius: 50%; background: var(--p1); color: var(--gold); font-size: 18px; font-weight: 900; box-shadow: 0 3px 12px rgba(0,0,0,.35); transform: translate(-50%,-50%); pointer-events: none; }
.spin-button { min-width: 180px; }
.spin-button:disabled { opacity: .58; cursor: wait; }
.spin-status { min-height: 32px; margin: 10px 0 0; color: var(--muted); font-size: 12px; }
.spin-settings h3 { margin: 0 0 16px; color: var(--text); font-size: 17px; }
.spin-test-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.spin-selected-chapter { margin: 16px 0 10px; padding: 14px; border: 1px solid var(--line); border-radius: 14px; background: linear-gradient(110deg, rgba(245,179,53,.12), rgba(59,140,240,.1)); color: var(--text); font-size: 14px; font-weight: 750; line-height: 1.5; }
.spin-settings .quiz-builder-error { min-height: 18px; }
.spin-settings .quiz-generate-btn:disabled { opacity: .5; cursor: not-allowed; }
@media(max-width:1100px){.spin-dashboard-layout{grid-template-columns:1fr}}
@media(max-width:760px){.spin-wheel-wrap{width:min(100%,360px)}}
@media(max-width:560px){.spin-dashboard{padding:16px}.spin-dashboard-heading{align-items:flex-start;flex-direction:column}.spin-exam-field{width:100%}.spin-test-fields{grid-template-columns:1fr}.spin-wheel-card,.spin-settings{padding:15px}}

.view-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 8px; flex-wrap: wrap; }
.view-title-group { display: flex; flex-direction: column; gap: 4px; }
.view-title { font-size: 26px; font-weight: 800; background: linear-gradient(90deg, var(--blue), var(--gold)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.view-sub { color: var(--muted); font-size: 14px; }
.btn-back { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 99px; border: 1px solid var(--line); background: var(--panel); color: var(--silver); font: 600 13px inherit; cursor: pointer; transition: all .2s; }
.btn-back:hover { border-color: var(--gold); color: #fff; background: rgba(245,179,53,.1); }

/* Sub Tabs (Physics, Chemistry, Maths) */
.sub-tabs { display: flex; gap: 10px; border-bottom: 1px solid var(--line); padding-bottom: 12px; overflow-x: auto; }
.sub-tab { padding: 10px 18px; border-radius: 12px; border: 1px solid var(--line); background: var(--panel); color: var(--muted); font: 700 13px inherit; cursor: pointer; transition: all .2s; white-space: nowrap; }
.sub-tab:hover { color: #fff; border-color: rgba(255,255,255,.3); }
.sub-tab.on { background: linear-gradient(135deg, rgba(245,179,53,.18), rgba(59,140,240,.12)); border-color: var(--gold); color: #fff; box-shadow: 0 0 16px rgba(245,179,53,.2); }

/* Chapter Grid */
.chapter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.chap-card { border-radius: 20px; border: 1px solid var(--line); background: linear-gradient(145deg, var(--card), var(--panel)); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; transition: transform .2s, border-color .2s, box-shadow .2s; }
.chap-card:hover { transform: translateY(-3px); border-color: rgba(245,179,53,.45); box-shadow: 0 10px 28px rgba(0,0,0,.45); }
.chap-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 8px; }
.chap-num { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--gold); }
.chap-badge { font-size: 11px; padding: 3px 8px; border-radius: 99px; background: rgba(59,140,240,.15); color: var(--blue); border: 1px solid rgba(59,140,240,.3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; }
.chap-name { font-size: 17px; font-weight: 700; color: #fff; line-height: 1.35; margin-bottom: 8px; }
.chap-meta { font-size: 12px; color: var(--muted); display: flex; gap: 8px; margin-bottom: 16px; }
.chap-btn { width: 100%; padding: 12px 16px; border-radius: 14px; border: 0; font: 700 13px inherit; color: #1a1100; cursor: pointer; background: linear-gradient(110deg, var(--gold-hi), var(--gold) 45%, #d98c10); box-shadow: 0 4px 16px rgba(245,179,53,.3); transition: transform .15s, box-shadow .15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.chap-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,179,53,.45); }

/* Subject-wise Grid */
.subj-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
.subj-card { border-radius: 24px; border: 1px solid var(--line); background: linear-gradient(145deg, var(--card), var(--panel)); padding: 26px; display: flex; flex-direction: column; gap: 18px; }
.subj-top { display: flex; gap: 14px; align-items: flex-start; }
.subj-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(245,179,53,.15); border: 1px solid rgba(245,179,53,.3); color: var(--gold); display: flex; align-items: center; justify-content: center; font-size: 22px; flex: none; }
.subj-title { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
.subj-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
.subj-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.subj-tag { font-size: 11px; padding: 4px 10px; border-radius: 99px; background: rgba(255,255,255,.05); border: 1px solid var(--line); color: var(--silver); }
.quiz-builder { width: min(100%, 900px); margin: 8px auto 0; padding: 24px; border: 1px solid var(--line); border-radius: 20px; background: linear-gradient(145deg, var(--card), var(--panel)); box-shadow: 0 14px 34px rgba(0,0,0,.2); }
.quiz-builder h3 { margin: 0 0 20px; color: #fff; font-size: 18px; }
.quiz-builder-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.quiz-builder-field { display: flex; flex-direction: column; gap: 8px; color: var(--silver); font-size: 13px; font-weight: 650; }
.quiz-builder-field .subj-sel, .quiz-builder-field input { width: 100%; min-height: 42px; background: var(--side); color: #fff; border: 1px solid var(--line); border-radius: 9px; padding: 9px 11px; font: inherit; outline: none; }
.quiz-builder-field .subj-sel:focus, .quiz-builder-field input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(245,179,53,.12); }
.builder-chapter-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 0 0 12px; color: var(--silver); font-size: 13px; font-weight: 700; }
.builder-selection-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.builder-selection-actions button { padding: 6px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); color: var(--silver); cursor: pointer; font-size: 12px; }
.builder-selection-actions button:hover { border-color: var(--gold); color: var(--text); }
.quiz-builder-chapters { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.quiz-builder-chapters .mock-subject-group { padding: 12px; }
.quiz-builder-chapters .mock-chapter-options { grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
.quiz-builder-chapters .mock-chapter-option { color: var(--silver); }
.quiz-builder-chapters .mock-chapter-option input { accent-color: var(--gold); }
.quiz-builder-chapters .mock-subject-option { color: var(--text); }
.quiz-builder-chapters .mock-subject-option input { accent-color: var(--gold); }
.subject-builder-chapters { display: grid; grid-template-columns: minmax(0, 1fr); }
.subject-builder-chapters .mock-chapter-option { color: var(--silver); }
.quiz-builder-error { min-height: 20px; margin: 14px 0 8px; color: #fca5a5; font-size: 13px; }
.quiz-generate-btn { max-width: 260px; }
@media(max-width:600px){.quiz-builder{padding:18px}.quiz-builder-fields{grid-template-columns:1fr}.quiz-generate-btn{max-width:none}}
.subj-opts { display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,.25); border-radius: 14px; padding: 12px 14px; border: 1px solid var(--line); }
.subj-opts label { font-size: 12px; color: var(--muted); display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.subj-sel { background: var(--side); color: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 6px 10px; font: inherit; font-size: 13px; outline: none; }

.mock-builder { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, .75fr); gap: 20px; }
.mock-panel { border-radius: 20px; border: 1px solid var(--line); background: linear-gradient(145deg, var(--card), var(--panel)); padding: 22px; }
.mock-panel h3 { color: #fff; font-size: 17px; margin-bottom: 14px; }
.mock-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; color: var(--silver); font-size: 13px; }
.mock-field .subj-sel, .mock-field input { width: 100%; }
.mock-field input { background: var(--side); color: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 9px 10px; font: inherit; }
.qt-daily-goal { margin: 0 0 14px; padding: 12px 14px; border: 1px solid rgba(245,179,53,.28); border-radius: 12px; background: rgba(245,179,53,.06); }
.qt-daily-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; color: var(--silver); font-size: 13px; }
.qt-daily-head span { color: #fff; font-weight: 800; font-variant-numeric: tabular-nums; }
.qt-daily-goal .bar { margin: 9px 0 5px; }
.qt-daily-goal .bar i { transition: width .25s ease; }
.qt-daily-goal small { color: var(--muted); font-size: 11px; }
.level-progress { display: flex; flex-direction: column; gap: 18px; padding: 18px; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(135deg, rgba(245,179,53,.09), rgba(59,140,240,.06)); }
.level-progress-head, .level-progress-copy { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; }
.level-eyebrow { color: var(--muted); font-size: 10px; font-weight: 800; letter-spacing: .12em; }
.level-number { display: flex; align-items: baseline; gap: 8px; margin-top: 5px; color: var(--silver); font-size: 13px; font-weight: 700; }
.level-number strong { color: var(--gold); font-size: 34px; line-height: 1; }
.level-total-xp { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
.level-total-xp strong { color: #fff; font-size: 22px; font-variant-numeric: tabular-nums; }
.level-total-xp span, .level-progress-copy span:last-child { color: var(--muted); font-size: 11px; }
.level-progress-copy span:first-child { color: #fff; font-size: 13px; font-weight: 700; }
.level-progress .bar { width: 100%; }
.level-progress .bar i { transition: width .3s ease; }
.mock-integer-section { margin: 2px 0 18px; padding: 16px; border: 1px solid rgba(245,179,53,.28); border-radius: 14px; background: rgba(245,179,53,.06); }
.mock-integer-section h4 { margin: 0 0 5px; color: #fff; font-size: 14px; }
.mock-integer-section > p { margin: 0 0 14px; color: var(--muted); font-size: 12px; line-height: 1.5; }
.mock-integer-counts .mock-field { margin-bottom: 12px; }
.mock-integer-counts .mock-field:last-child { margin-bottom: 0; }
.mock-integer-counts small { color: var(--muted); font-size: 11px; }
.mock-chapter-actions { display: flex; gap: 8px; margin-bottom: 12px; }
.mock-chapter-actions { flex-wrap: wrap; }
.mock-chapter-actions button { border: 1px solid var(--line); border-radius: 8px; padding: 6px 10px; background: var(--panel); color: var(--silver); cursor: pointer; }
.mock-chapters { display: flex; flex-direction: column; gap: 12px; }
.mock-subject-group { min-width: 0; border: 1px solid var(--line); border-radius: 12px; padding: 12px; }
.mock-subject-group legend { padding: 0 6px; }
.mock-subject-option { display: inline-flex; align-items: center; gap: 8px; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; }
.mock-subject-option input { accent-color: var(--gold); }
.mock-chapter-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; }
.mock-chapter-option { display: flex; align-items: flex-start; gap: 9px; padding: 10px; border: 1px solid var(--line); border-radius: 10px; color: var(--silver); font-size: 12px; line-height: 1.4; cursor: pointer; }
.mock-chapter-option input { margin-top: 2px; accent-color: var(--gold); }
.mock-summary, .mock-error { font-size: 13px; line-height: 1.5; margin: 0 0 16px; }
.mock-summary { color: var(--muted); }
.mock-error { color: #f87171; min-height: 1.5em; }
.mock-integer-counts .mock-field[hidden] { display: none; }
.mock-integer-counts small { color: var(--muted); font-size: 11px; }
.mock-generate { width: 100%; }
.mock-generate:disabled { cursor: not-allowed; opacity: .5; transform: none; }
@media (max-width: 760px) { .mock-builder { grid-template-columns: 1fr; } }

/* Quiz View Layout */
.quiz-top-bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; background: var(--panel); border: 1px solid var(--line); border-radius: 20px; padding: 14px 22px; }
.quiz-info h2 { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.quiz-info p { font-size: 12px; color: var(--muted); }
.quiz-meta-right { display: flex; align-items: center; gap: 20px; }
.quiz-timer { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: var(--gold); font-variant-numeric: tabular-nums; background: rgba(245,179,53,.12); padding: 8px 14px; border-radius: 12px; border: 1px solid rgba(245,179,53,.25); }
.quiz-prog-bar { width: 100%; height: 5px; border-radius: 5px; background: rgba(255,255,255,.08); overflow: hidden; margin-top: -8px; }
.quiz-prog-fill { height: 100%; background: linear-gradient(90deg, var(--blue), var(--gold)); transition: width .3s; }
.quiz-subject-menu { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0; }
.quiz-subject-tab { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--line); border-radius: 999px; padding: 8px 14px; background: var(--panel); color: var(--silver); font: 700 13px inherit; cursor: pointer; }
.quiz-subject-tab span { font-size: 11px; opacity: .8; }
.quiz-subject-tab:hover, .quiz-subject-tab.on { border-color: var(--gold); background: rgba(245,179,53,.16); color: #fff; }

.quiz-main-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
@media (max-width: 900px) {
  .quiz-main-layout { grid-template-columns: 1fr; }
  .notes-frame-wrap iframe { min-height: 680px; }
}
@media (max-width: 650px) {
  .notes-frame-wrap { min-height: 78vh; }
  .notes-frame-wrap iframe { height: 78vh; min-height: 680px; }
}

.quiz-question-box { border-radius: 24px; border: 1px solid var(--line); background: var(--card); padding: 26px; display: flex; flex-direction: column; gap: 22px; }
.q-header { display: flex; justify-content: space-between; align-items: center; gap: 10px; border-bottom: 1px solid var(--line); padding-bottom: 14px; }
.q-num { font-size: 13px; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: .08em; }
.diff-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 99px; text-transform: uppercase; }
.diff-badge.easy { background: rgba(52,211,153,.15); color: #34d399; border: 1px solid rgba(52,211,153,.3); }
.diff-badge.medium { background: rgba(245,179,53,.15); color: var(--gold); border: 1px solid rgba(245,179,53,.3); }
.diff-badge.hard { background: rgba(239,68,68,.15); color: #ef4444; border: 1px solid rgba(239,68,68,.3); }

.q-text { font-size: 17px; line-height: 1.6; color: #fff; font-weight: 500; }
.q-options { display: flex; flex-direction: column; gap: 12px; }
.q-type-hint { margin: 0; color: var(--muted); font-size: 13px; font-weight: 650; }
.integer-answer-field { display: flex; flex-direction: column; gap: 10px; color: var(--silver); font-size: 14px; }
.integer-answer-field input { width: min(100%, 260px); padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); color: #fff; font: 600 18px inherit; }
.integer-answer-field input:focus { outline: 2px solid var(--gold); outline-offset: 2px; }
.integer-review-answer { display: flex; flex-wrap: wrap; gap: 10px 24px; padding: 12px 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); color: var(--silver); font-size: 14px; }
.integer-review-answer b { color: #fff; }
.opt-card { display: flex; align-items: flex-start; gap: 14px; padding: 14px 18px; border-radius: 16px; border: 1px solid var(--line); background: var(--panel); cursor: pointer; transition: all .15s; }
.opt-card:hover { border-color: rgba(245,179,53,.4); background: rgba(245,179,53,.05); }
.opt-card.selected { border-color: var(--gold); background: linear-gradient(135deg, rgba(245,179,53,.2), rgba(59,140,240,.1)); box-shadow: 0 0 20px rgba(245,179,53,.2); }
.opt-letter { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; color: var(--silver); flex: none; }
.opt-card.selected .opt-letter { background: var(--gold); color: #000; border-color: var(--gold); }
.opt-text { font-size: 15px; color: #fff; line-height: 1.45; padding-top: 4px; }

/* Quiz Action Footer */
.quiz-actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; border-top: 1px solid var(--line); padding-top: 18px; }
.btn-nav { padding: 10px 18px; border-radius: 12px; border: 1px solid var(--line); background: var(--panel); color: #fff; font: 600 13px inherit; cursor: pointer; transition: all .15s; }
.btn-nav:hover:not(:disabled) { border-color: var(--gold); background: rgba(245,179,53,.1); }
.btn-nav:disabled { opacity: .4; cursor: not-allowed; }
#btnPrevQ, #btnNextQ { border-color: #ef4444; background: #dc2626; color: #fff; }
#btnPrevQ:hover:not(:disabled), #btnNextQ:hover:not(:disabled) { border-color: #f87171; background: #b91c1c; }
#btnPrevQ:disabled, #btnNextQ:disabled { border-color: #ef4444; background: #dc2626; color: #fff; opacity: .45; }
.btn-mark { padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(168,85,247,.4); background: rgba(168,85,247,.1); color: #c084fc; font: 600 13px inherit; cursor: pointer; }
.btn-mark.marked { background: #9333ea; color: #fff; border-color: #a855f7; box-shadow: 0 0 16px rgba(168,85,247,.4); }
.btn-submit { padding: 12px 24px; border-radius: 14px; border: 0; background: linear-gradient(110deg, #34d399, #059669); color: #fff; font: 700 14px inherit; cursor: pointer; box-shadow: 0 4px 18px rgba(5,150,105,.35); transition: all .15s; }
.btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(5,150,105,.5); }

/* Palette */
.quiz-palette { border-radius: 24px; border: 1px solid var(--line); background: var(--card); padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.palette-head { font-size: 15px; font-weight: 700; color: #fff; display: flex; justify-content: space-between; align-items: center; }
.palette-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.pal-btn { aspect-ratio: 1; border-radius: 10px; border: 1px solid var(--line); background: var(--panel); color: var(--silver); font: 700 13px inherit; cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; }
.pal-btn:hover { border-color: var(--gold); }
.pal-btn.answered { background: rgba(52,211,153,.25); border-color: #34d399; color: #34d399; font-weight: 800; }
.pal-btn.marked { background: rgba(168,85,247,.3); border-color: #a855f7; color: #c084fc; font-weight: 800; }
.pal-btn.current { outline: 2px solid var(--gold); outline-offset: 2px; }
.pal-legend { display: flex; flex-direction: column; gap: 8px; font-size: 11px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 12px; }
.pal-legend-row { display: flex; align-items: center; gap: 8px; }
.pal-dot { width: 10px; height: 10px; border-radius: 50%; }

/* Results Screen */
.result-card { border-radius: 28px; border: 1px solid var(--line); background: var(--card); padding: 34px; display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; }
.score-circle-wrap { position: relative; width: 170px; height: 170px; display: flex; align-items: center; justify-content: center; }
.score-circle-wrap svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.score-circle-text { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
.score-circle-text b { font-size: 38px; font-weight: 800; color: #fff; line-height: 1; }
.score-circle-text span { font-size: 12px; color: var(--muted); margin-top: 4px; }
.res-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; width: 100%; max-width: 650px; }
@media (max-width: 600px) {
  .res-stats { grid-template-columns: 1fr 1fr; }
}
.res-stat-card { border-radius: 16px; border: 1px solid var(--line); background: var(--panel); padding: 14px; display: flex; flex-direction: column; gap: 4px; }
.res-stat-card small { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
.res-stat-card b { font-size: 22px; font-weight: 800; }
.res-xp { font-size: 15px; color: var(--gold); background: rgba(245,179,53,.15); border: 1px solid rgba(245,179,53,.3); padding: 8px 18px; border-radius: 99px; }
.res-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.res-btn { padding: 12px 24px; border-radius: 99px; font: 700 14px inherit; cursor: pointer; border: 0; transition: all .15s; }
.res-btn.primary { background: linear-gradient(110deg, var(--gold-hi), var(--gold) 45%, #d98c10); color: #1a1100; box-shadow: 0 4px 20px rgba(245,179,53,.35); }
.res-btn.secondary { background: var(--panel); color: #fff; border: 1px solid var(--line); }

/* Review Section */
.review-section { margin-top: 24px; display: flex; flex-direction: column; gap: 16px; }
.review-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.review-filters { display: flex; gap: 8px; flex-wrap: wrap; }
.rf-btn { padding: 6px 14px; border-radius: 99px; border: 1px solid var(--line); background: var(--panel); color: var(--muted); font: 600 12px inherit; cursor: pointer; }
.rf-btn.on { background: var(--gold); color: #000; border-color: var(--gold); }
.rev-card { border-radius: 20px; border: 1px solid var(--line); background: var(--card); padding: 22px; display: flex; flex-direction: column; gap: 16px; }
.rev-head { display: flex; justify-content: space-between; align-items: center; }
.rev-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; }
.rev-badge.correct { background: rgba(52,211,153,.15); color: #34d399; border: 1px solid rgba(52,211,153,.3); }
.rev-badge.incorrect { background: rgba(239,68,68,.15); color: #ef4444; border: 1px solid rgba(239,68,68,.3); }
.rev-badge.unatt { background: rgba(255,255,255,.08); color: var(--muted); border: 1px solid var(--line); }
.rev-prompt { font-size: 16px; color: #fff; font-weight: 500; line-height: 1.5; }
.rev-opts { display: flex; flex-direction: column; gap: 8px; }
.rev-opt { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--panel); font-size: 14px; }
.rev-opt.correct-opt { border-color: #34d399; background: rgba(52,211,153,.1); color: #34d399; }
.rev-opt.user-opt { border-color: #ef4444; background: rgba(239,68,68,.1); color: #ef4444; }
.rev-tag { font-size: 11px; margin-left: auto; padding: 2px 8px; border-radius: 99px; }
.rev-tag.green { background: #34d399; color: #000; }
.rev-tag.red { background: #ef4444; color: #fff; }
.rev-exp { background: rgba(245,179,53,.08); border: 1px solid rgba(245,179,53,.25); border-radius: 14px; padding: 14px 18px; }
.rev-exp h4 { font-size: 13px; color: var(--gold); margin-bottom: 4px; }
.rev-exp p { font-size: 14px; color: var(--silver); line-height: 1.5; }

:root[data-theme="light"] #dash {
  color: var(--text);
}
:root[data-theme="light"] #dash .treasure-card-title,
:root[data-theme="light"] #dash .profile-detail-value,
:root[data-theme="light"] #dash .spin-settings h3,
:root[data-theme="light"] #dash .spin-selected-chapter,
:root[data-theme="light"] #dash #spinExamSelect,
:root[data-theme="light"] #dash #spinQuestionCount,
:root[data-theme="light"] #dash #spinDuration,
:root[data-theme="light"] #dash .chap-name,
:root[data-theme="light"] #dash .subj-title,
:root[data-theme="light"] #dash .quiz-builder h3,
:root[data-theme="light"] #dash .quiz-builder-field,
:root[data-theme="light"] #dash .quiz-builder-field .subj-sel,
:root[data-theme="light"] #dash .quiz-builder-field input,
:root[data-theme="light"] #dash .subj-sel,
:root[data-theme="light"] #dash .mock-panel h3,
:root[data-theme="light"] #dash .mock-field,
:root[data-theme="light"] #dash .mock-field input,
:root[data-theme="light"] #dash .mock-integer-section h4,
:root[data-theme="light"] #dash .mock-subject-option,
:root[data-theme="light"] #dash .mock-chapter-option,
:root[data-theme="light"] #dash .builder-chapter-toolbar,
:root[data-theme="light"] #dash .builder-selection-actions button,
:root[data-theme="light"] #dash .quiz-builder-chapters .mock-chapter-option,
:root[data-theme="light"] #dash .quiz-builder-chapters .mock-subject-option,
:root[data-theme="light"] #dash .qt-daily-head,
:root[data-theme="light"] #dash .qt-daily-head span,
:root[data-theme="light"] #dash .level-number,
:root[data-theme="light"] #dash .level-total-xp strong,
:root[data-theme="light"] #dash .level-progress-copy span:first-child,
:root[data-theme="light"] #dash .quiz-info h2,
:root[data-theme="light"] #dash .quiz-subject-tab,
:root[data-theme="light"] #dash .quiz-subject-tab:hover,
:root[data-theme="light"] #dash .quiz-subject-tab.on,
:root[data-theme="light"] #dash .q-text,
:root[data-theme="light"] #dash .integer-answer-field,
:root[data-theme="light"] #dash .integer-answer-field input,
:root[data-theme="light"] #dash .integer-review-answer,
:root[data-theme="light"] #dash .integer-review-answer b,
:root[data-theme="light"] #dash .opt-text,
:root[data-theme="light"] #dash .btn-nav,
:root[data-theme="light"] #dash .palette-head,
:root[data-theme="light"] #dash .pal-btn,
:root[data-theme="light"] #dash .score-circle-text b,
:root[data-theme="light"] #dash .res-btn.secondary,
:root[data-theme="light"] #dash .rev-prompt,
:root[data-theme="light"] #dash .rev-opt,
:root[data-theme="light"] #dash .rev-exp p,
:root[data-theme="light"] #dash .sub-tab,
:root[data-theme="light"] #dash .sub-tab:hover,
:root[data-theme="light"] #dash .sub-tab.on,
:root[data-theme="light"] #dash .btn-back:hover {
  color: var(--text);
}
:root[data-theme="light"] #dash .mock-chapter-actions button,
:root[data-theme="light"] #dash .opt-card,
:root[data-theme="light"] #dash .treasure-card,
:root[data-theme="light"] #dash .profile-detail,
:root[data-theme="light"] #dash .spin-settings,
:root[data-theme="light"] #dash .spin-wheel-card,
:root[data-theme="light"] #dash .quiz-question-box,
:root[data-theme="light"] #dash .quiz-palette,
:root[data-theme="light"] #dash .result-card,
:root[data-theme="light"] #dash .rev-card {
  color: var(--text);
}
`;

module.exports = { quizStyles };
