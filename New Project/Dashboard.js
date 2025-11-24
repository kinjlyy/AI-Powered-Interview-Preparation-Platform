// script.js - complete version

const companies = [
  {id:'google',logo:'G',name:'Google',tag:'SWE | SDE | L3-L5', rounds:[
    {num:1,name:'Aptitude',info:'Quant & reasoning',questions:[{q:'If the sum of three consecutive even numbers is 198, what is the largest number?',ans:'68'},{q:'A train travels 120 km in 2 hours and 30 minutes. What is its average speed in km/h?',ans:'48'}]},
    {num:2,name:'Coding',info:'DSA problems',questions:[{q:'Two Sum',link:'https://leetcode.com/problems/two-sum/'},{q:'Inorder Traversal',link:'https://leetcode.com/problems/binary-tree-inorder-traversal/'}]},
    {num:3,name:'System Design',info:'Scalability & caching',questions:[{q:'Design a URL shortener.'}]},
    {num:4,name:'Technical Interview',info:'Deep technical',questions:[{q:'Explain garbage collection.'}]}
  ]},
  {id:'amazon',logo:'a',name:'Amazon',tag:'SDE', rounds:[
    {num:1,name:'Aptitude',info:'Quant and logic',questions:[{q:'If 5 machines take 5 minutes to make 5 widgets, how long for 100 machines to make 100 widgets?',ans:'5'}]},
    {num:2,name:'Coding',info:'Known problems',questions:[{q:'Median of Two Sorted Arrays',link:'https://leetcode.com/problems/median-of-two-sorted-arrays/'},{q:'Rotate Array',link:'https://leetcode.com/problems/rotate-array/'}]},
    {num:3,name:'Behavioral',info:'Leadership principles',questions:[{q:'Tell me about a time you took ownership.'}]},
    {num:4,name:'Technical Interview',info:'Systems',questions:[{q:'Explain sharding.'}]}
  ]},
  {id:'microsoft',logo:'MS',name:'Microsoft',tag:'SWE', rounds:[
    {num:1,name:'Aptitude',info:'Logical reasoning',questions:[{q:'LCM/HCF type problem',ans:'(example)'}]},
    {num:2,name:'Coding',info:'DSA',questions:[{q:'Lowest Common Ancestor',link:'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/'},{q:'Queue using Stacks',link:'https://leetcode.com/problems/implement-queue-using-stacks/'}]},
    {num:3,name:'Design',info:'Feature design',questions:[{q:'Design autocomplete system.'}]},
    {num:4,name:'Technical Interview',info:'Deep technical',questions:[{q:'Explain virtual memory.'}]}
  ]},
  {id:'tcs',logo:'🏢',name:'TCS',tag:'Trainee', rounds:[
    {num:1,name:'Aptitude',info:'Placement style',questions:[{q:'Find next in sequence: 2,6,12,20,...',ans:'30'}]},
    {num:2,name:'Coding',info:'Campus coding',questions:[{q:'Reverse Linked List',link:'https://leetcode.com/problems/reverse-linked-list/'}]},
    {num:3,name:'Technical Interview',info:'Core fundamentals',questions:[{q:'Explain normalization.'}]},
    {num:4,name:'Manager Round',info:'Behavioral',questions:[{q:'Why TCS?'}]}
  ]},
  {id:'netflix', logo:'🎬', name:'Netflix', tag:'SWE', rounds:[
    {num:1,name:'Aptitude', info:'Quick math & reasoning', questions:[
      {q:'A streaming server can serve 2400 requests per minute. How many requests can it serve in 3 hours?', ans:'432000'},
      {q:'If a subscription costs $15 per month and there are 120,000 subscribers, what is the monthly revenue?', ans:'1800000'}
    ]},
    {num:2,name:'Coding', info:'Performance & algorithms', questions:[
      {q:'LRU Cache', link:'https://leetcode.com/problems/lru-cache/'},
      {q:'Median of Two Sorted Arrays', link:'https://leetcode.com/problems/median-of-two-sorted-arrays/'}
    ]},
    {num:3,name:'System Design', info:'Scalability & reliability', questions:[
      {q:'Design a video streaming system that supports millions of concurrent viewers.'},
      {q:'How would you design a recommendation engine for Netflix?'}
    ]},
    {num:4,name:'Technical Interview', info:'Behavioral & technical', questions:[
      {q:'Explain how you would debug a service that has intermittent failures in production.'},
      {q:'Describe a time you optimized performance in a system or codebase.'}
    ]}
  ]}
];

// DOM refs (wrapped with null checks)
const grid = document.getElementById('company-grid');
const dashboardView = document.getElementById('dashboard-view');
const companyView = document.getElementById('company-view');
const companyTitle = document.getElementById('company-title');
const companyTag = document.getElementById('company-tag');
const roundsList = document.getElementById('rounds-list');
const roundLeftContent = document.getElementById('round-left-content');
const backToDashboard = document.getElementById('back-to-dashboard');
const btnResponses = document.getElementById('btn-responses');
const modalResponses = document.getElementById('modal-responses');
const closeResponses = document.getElementById('close-responses');
const responsesList = document.getElementById('responses-list');

const STORAGE_KEY = 'prep_answers_v1';
const PROFILE_KEY = 'prep_profile_v1';

function safeJSONParse(v, fallback) {
  try { return JSON.parse(v); } catch (e) { return fallback; }
}

function init() {
  if (!grid) return console.error('Missing #company-grid element');

  // render company cards
  companies.forEach(c => {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.innerHTML = `<div class='company-logo'>${c.logo}</div><div class='company-meta'><div class='company-name'>${c.name}</div><div class='company-tag'>${c.tag}</div></div>`;
    card.addEventListener('click', () => openCompany(c.id));
    grid.appendChild(card);
  });

  // load profile if present
  const p = safeJSONParse(localStorage.getItem(PROFILE_KEY), null);
  if (p) {
    const pn = document.getElementById('profile-name');
    const pe = document.getElementById('profile-email');
    if (pn) pn.textContent = p.name || pn.textContent;
    if (pe) pe.textContent = p.email || pe.textContent;
  }

  // responses modal open/close
  if (btnResponses && modalResponses) {
    btnResponses.addEventListener('click', () => { renderResponses(); modalResponses.style.display = 'flex'; });
  }
  if (closeResponses) {
    closeResponses.addEventListener('click', () => { if (modalResponses) modalResponses.style.display = 'none'; });
  }
  if (modalResponses) {
    modalResponses.addEventListener('click', (e) => { if (e.target === modalResponses) modalResponses.style.display = 'none'; });
  }

  // back to dashboard
  if (backToDashboard) {
    backToDashboard.addEventListener('click', () => {
      if (companyView) companyView.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'block';
      if (roundLeftContent) roundLeftContent.innerHTML = '';
      if (roundsList) roundsList.innerHTML = '';
      // remove active class
      document.querySelectorAll('.round-item').forEach(i => i.classList.remove('active'));
    });
  }
}

// Open company -> populate rounds
function openCompany(id) {
  const c = companies.find(x => x.id === id);
  if (!c) return console.warn('Company not found:', id);
  if (companyTitle) companyTitle.textContent = c.name;
  if (companyTag) companyTag.textContent = c.tag;
  if (!roundsList) return;

  roundsList.innerHTML = '';
  c.rounds.forEach(r => {
    const item = document.createElement('div');
    item.className = 'round-item';
    item.innerHTML = `<div class='round-number'>${r.num}</div><div class='round-meta'><div class='round-name'>${r.name}</div><div class='round-info'>${r.info}</div></div>`;
    item.addEventListener('click', () => openRoundInCompany(id, r.num, item));
    roundsList.appendChild(item);
  });

  if (dashboardView) dashboardView.style.display = 'none';
  if (companyView) companyView.style.display = 'flex';
  if (roundLeftContent) roundLeftContent.innerHTML = `<p class='small'>Select a round from the left to start.</p>`;
}

// Open a specific round and render questions
function openRoundInCompany(companyId, roundNum, sidebarItem) {
  document.querySelectorAll('.round-item').forEach(i => i.classList.remove('active'));
  if (sidebarItem) sidebarItem.classList.add('active');

  const company = companies.find(x => x.id === companyId);
  if (!company) return;
  const round = company.rounds.find(r => r.num === roundNum);
  if (!round) return;

  if (!roundLeftContent) return;
  roundLeftContent.innerHTML = '';

  // back control for round content
  const backWrap = document.createElement('div');
  backWrap.className = 'back-symbol';
  backWrap.innerHTML = `<button title='Back to rounds' aria-label='Back'>&larr;</button>`;
  backWrap.querySelector('button').addEventListener('click', () => {
    if (sidebarItem) sidebarItem.classList.remove('active');
    roundLeftContent.innerHTML = `<p class='small'>Select a round from the left to start.</p>`;
  });
  roundLeftContent.appendChild(backWrap);

  // header
  const header = document.createElement('div');
  header.innerHTML = `<h2>Round ${round.num}: ${round.name}</h2><div class='small' style='margin-top:6px'>${round.info}</div>`;
  roundLeftContent.appendChild(header);

  // questions
  round.questions.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'question';

    let inner = `<div><strong>Q${idx+1}:</strong> ${q.q || q}</div>`;

    if (round.name.toLowerCase().includes('coding')) {
      const url = (q.link || '#');
      inner += `<div class='q-actions'><a class='leetcode-btn' href='${url}' target='_blank' rel='noopener'>Open on LeetCode</a><button class='btn secondary' data-action='round-back' style='margin-left:auto'>Back</button></div>`;
    } else if (round.name.toLowerCase().includes('aptitude')) {
      inner += `<div class='q-actions'><input type='text' placeholder='Your answer' id='apt-${companyId}-${round.num}-${idx}' style='flex:1;padding:8px;border-radius:8px;background:#141820;color:#fff;border:1px solid rgba(255,255,255,0.06)'/>`;
      inner += `<button class='btn' data-company='${companyId}' data-round='${round.num}' data-qidx='${idx}' data-action='submit' style='margin-left:8px'>Submit</button>`;
      if (q.ans) inner += `<button class='btn secondary' data-show='${companyId}::${round.num}::${idx}' style='margin-left:8px'>Show Answer</button>`;
      inner += `</div>`;
    } else {
      inner += `<textarea rows='3' placeholder='Type your answer here' style='width:100%;margin-top:10px;background:#141820;color:#fff;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.09)'></textarea>`;
      inner += `<div class='q-actions'><button class='btn secondary' id='voice-${companyId}-${round.num}-${idx}'>🎤 Speak</button><button class='btn' data-company='${companyId}' data-round='${round.num}' data-qidx='${idx}' data-action='submit' id='submit-${companyId}-${round.num}-${idx}' style='margin-left:8px'>Submit</button><button class='btn secondary' data-action='round-back' style='margin-left:auto'>Back</button></div>`;
    }

    qDiv.innerHTML = inner;
    roundLeftContent.appendChild(qDiv);

    // Attach Show Answer handler for aptitude
    if (round.name.toLowerCase().includes('aptitude') && q.ans) {
      const showBtn = qDiv.querySelector('button[data-show]');
      if (showBtn) {
        showBtn.addEventListener('click', () => {
          const input = qDiv.querySelector(`#apt-${companyId}-${round.num}-${idx}`);
          if (input) input.value = q.ans;
          let popup = qDiv.querySelector('.answer-popup');
          if (popup) popup.remove();
          popup = document.createElement('div');
          popup.className = 'answer-popup';
          popup.textContent = '✔️ Answer filled in box.';
          qDiv.appendChild(popup);
        });
      }
    }

    // Attach voice handler if present
    const voiceBtn = qDiv.querySelector(`#voice-${companyId}-${round.num}-${idx}`);
    if (voiceBtn) {
      voiceBtn.addEventListener('click', (e) => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          alert('SpeechRecognition not available in this browser. Use Chrome/Edge on HTTPS.');
          return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SR();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        voiceBtn.textContent = 'Listening...';
        rec.start();
        rec.onresult = (ev) => {
          const t = ev.results[0][0].transcript;
          // append transcript to a new textarea for user to edit (keeps original layout)
          const ta = document.createElement('textarea');
          ta.rows = 3;
          ta.style = 'width:100%;margin-top:10px;background:#141820;color:#fff;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.09)';
          ta.value = t;
          // insert after qDiv's existing textarea (if present) or at the end
          qDiv.appendChild(ta);
          voiceBtn.textContent = '🎤 Speak';
        };
        rec.onerror = () => { voiceBtn.textContent = '🎤 Speak'; alert('Voice error'); };
      });
    }
  });

  // Attach handlers for buttons inside the round content (delegated locally)
  roundLeftContent.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const b = e.currentTarget;
      const qDiv = b.closest('.question');
      if (!qDiv) return;

      // remove previous popup
      let popup = qDiv.querySelector('.answer-popup');
      if (popup) popup.remove();

      function showPopup(msg) {
        popup = document.createElement('div');
        popup.className = 'answer-popup';
        popup.textContent = msg;
        qDiv.appendChild(popup);
      }

      // Back buttons inside question content
      if (b.dataset.action === 'round-back' || b.textContent.trim().toLowerCase() === 'back') {
        roundLeftContent.innerHTML = `<p class='small'>Select a round from the left to start.</p>`;
        document.querySelectorAll('.round-item').forEach(i => i.classList.remove('active'));
        return;
      }

      // Submit flow (both aptitude and textarea case)
      if (b.dataset.action === 'submit' || (b.dataset.company && b.textContent.trim().toLowerCase() === 'submit')) {
        const comp = b.getAttribute('data-company');
        const rnum = parseInt(b.getAttribute('data-round'));
        const qidx = parseInt(b.getAttribute('data-qidx'));

        // If there's an input with aptitude id pattern, treat as aptitude
        const aptInput = qDiv.querySelector(`#apt-${comp}-${rnum}-${qidx}`);
        if (aptInput) {
          const val = (aptInput.value || '').trim();
          const company = companies.find(x => x.id === comp);
          const rr = company && company.rounds.find(x => x.num == rnum);
          const qobj = rr && rr.questions[qidx];
          let correct = (qobj && qobj.ans !== undefined) ? String(qobj.ans).trim() : '';
          if (!val) { showPopup('Type answer'); return; }
          if (correct && val.toLowerCase() === correct.toLowerCase()) {
            saveAnswer(comp, rnum, qidx, val);
            showPopup('✅ Correct answer!');
          } else {
            saveAnswer(comp, rnum, qidx, val); // still save user attempt
            showPopup(correct ? '❌ Incorrect. Try again or click Show Answer.' : 'Answer saved!');
          }
          return;
        }

        // Otherwise check for a textarea (for behavioral/design)
        const ta = qDiv.querySelector('textarea');
        if (ta) {
          const val = ta.value.trim();
          if (!val) { showPopup('Type your answer'); return; }
          saveAnswer(comp, rnum, qidx, val);
          showPopup('Answer saved!');
          return;
        }

        // For coding the UI shows LeetCode link and Back button; no submit expected
        return;
      }

      // If it's any other button (like Show Answer handled above), ignore
    });
  });
}

// save answers to localStorage
function saveAnswer(companyId, roundNum, qidx, text) {
  const store = safeJSONParse(localStorage.getItem(STORAGE_KEY), {});
  const key = `${companyId}::r${roundNum}::q${qidx}`;
  store[key] = {companyId, roundNum, qidx, text, ts: new Date().toISOString()};
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// render saved responses into modal
function renderResponses() {
  const store = safeJSONParse(localStorage.getItem(STORAGE_KEY), {});
  const entries = Object.values(store || {});
  if (!responsesList) return;
  responsesList.innerHTML = '';
  if (!entries.length) {
    responsesList.innerHTML = '<div class="small">No saved responses yet.</div>';
    return;
  }
  entries.forEach(r => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `<div><strong>${r.companyId}</strong> — Round ${r.roundNum} — Q${r.qidx+1}</div><div style='margin-top:6px'>${escapeHtml(r.text)}</div><div class='small' style='margin-top:6px'>Saved: ${new Date(r.ts).toLocaleString()}</div><div style='margin-top:8px'><button class='btn secondary' data-delete='${r.companyId}::r${r.roundNum}::q${r.qidx}'>Delete</button></div>`;
    responsesList.appendChild(div);
  });

  responsesList.querySelectorAll('button[data-delete]').forEach(b => {
    b.addEventListener('click', () => {
      const key = b.getAttribute('data-delete');
      const s = safeJSONParse(localStorage.getItem(STORAGE_KEY), {});
      if (s && s[key]) delete s[key];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) { console.error(e); }
      renderResponses();
    });
  });
}

// small helper to avoid injecting raw HTML from saved answers
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// init on load
document.addEventListener('DOMContentLoaded', init);

// close modal if clicked on overlay (defensive attach)
if (modalResponses) {
  modalResponses.addEventListener('click', (e) => {
    if (e.target === modalResponses) modalResponses.style.display = 'none';
  });
}
