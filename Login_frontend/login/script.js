// Keeps original route names in your project
const API_BASE = 'http://localhost:4000/api/auth';

// UI elements
const tabs = document.querySelectorAll('.tab[data-target]');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const messageEl = document.getElementById('message');

// Toggle tabs -> show exactly one form at a time
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.target;
    // show/hide the two forms (IDs are preserved)
    [loginForm, signupForm].forEach(f => {
      if (f.id === target) {
        f.classList.add('active');
      } else {
        f.classList.remove('active');
      }
    });

    // clear messages when switching
    setMessage('', false);
  });
});

// helper: set message
function setMessage(text, isError = false) {
  messageEl.textContent = text || '';
  messageEl.classList.toggle('error', !!isError);
  messageEl.classList.toggle('success', !!text && !isError);
}

// serialize form to object (trim values)
function serializeForm(form) {
  const fd = new FormData(form);
  const obj = {};
  for (const [k, v] of fd.entries()) {
    obj[k] = typeof v === 'string' ? v.trim() : v;
  }
  return obj;
}

// generic request wrapper
async function doRequest(endpoint, payload) {
  const url = `${API_BASE}/${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // try to extract a clear message, fallback to status
    const errMsg = body.message || body.error || `Request failed (${res.status})`;
    const err = new Error(errMsg);
    err.body = body;
    throw err;
  }
  return body;
}

// login submit
if (loginForm) {
  loginForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setMessage('Logging in...');
    try {
      const payload = serializeForm(loginForm);
      const data = await doRequest('login', payload); // uses /login
      // store token if returned
      if (data.token) localStorage.setItem('token', data.token);
      setMessage('Login successful — redirecting...');
      // adjust redirect path as needed for your app
      setTimeout(() => {
        // try to redirect to dashboard if exists
        window.location.href = '/dashboard.html';
      }, 700);
    } catch (err) {
      setMessage(err.message || 'Login failed', true);
    }
  });
}

// signup submit
if (signupForm) {
  signupForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setMessage('Creating account...');
    try {
      const payload = serializeForm(signupForm);
      const data = await doRequest('signup', payload); // uses /signup
      setMessage('Signup successful — you can now log in.');
      // switch to login tab automatically
      const loginTab = document.querySelector('.tab[data-target="login-form"]');
      if (loginTab) loginTab.click();
      // prefill email on login form
      const loginEmail = loginForm.querySelector('input[name="email"]');
      if (loginEmail && payload.email) loginEmail.value = payload.email;
      signupForm.reset();
    } catch (err) {
      setMessage(err.message || 'Signup failed', true);
    }
  });
}

