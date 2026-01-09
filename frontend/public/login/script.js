// Keeps original route names in your project
// Default backend for local dev. Override via window.__env__.VITE_API_BASE if needed.
const API_BASE = (window?.__env?.VITE_API_BASE) || 'http://localhost:4000/api/auth';

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
    console.debug('Login submit triggered. API_BASE:', API_BASE);
    try { document.dispatchEvent(new CustomEvent('loginDebug', { detail: `API_BASE=${API_BASE}\nRedirect=${(window?.__env?.REDIRECT_AFTER_LOGIN) || 'http://localhost:5173/'}` })); } catch (e) {}
    try {
      const payload = serializeForm(loginForm);
      const data = await doRequest('login', payload); // uses /login
      console.debug('Login response:', data);
      try { document.dispatchEvent(new CustomEvent('loginDebug', { detail: `API_BASE=${API_BASE}\nResponse=${JSON.stringify(data)}` })); } catch (e) {}
      // store token if returned
      if (data.token) localStorage.setItem('token', data.token);
      setMessage('Login successful — redirecting...');
      // adjust redirect path as needed for your app
      setTimeout(() => {
        // Allow runtime configuration of redirect: priority is window.__env__ -> VITE_REDIRECT_AFTER_LOGIN -> fallback '/'
        // Local dev default: Vite dashboard at 5173 with the CompanyRounds route
        // Allow specifying a target round, default to 'technical' so we land inside the round.
          // Default redirect strategy (priority):
          // 1) runtime override via window.__env__.REDIRECT_AFTER_LOGIN
          // 2) fallback to the dashboard CompanyRounds URL
          const REDIRECT_AFTER_LOGIN = (window?.__env?.REDIRECT_AFTER_LOGIN) || 'http://localhost:5173/company/google';
        // If this page is rendered within an iframe (the SPA uses an iframe to display this login page),
        // we should redirect the top-level window to the dashboard (not only the iframe itself).
        try {
          // Post message instructing the parent frame to navigate (works even if top redirect is prevented)
          try {
            window.parent.postMessage({ type: 'LOGIN_REDIRECT', url: REDIRECT_AFTER_LOGIN }, '*');
          } catch (e) {
            // ignore
          }
          // Dispatch debug showing the redirect url (so the debug area can show it)
          try { document.dispatchEvent(new CustomEvent('loginDebug', { detail: `API_BASE=${API_BASE}\nRedirect=${REDIRECT_AFTER_LOGIN}` })); } catch (e) {}
          if (window.top && window.top !== window.self) {
            window.top.location.href = REDIRECT_AFTER_LOGIN;
          } else {
            window.location.href = REDIRECT_AFTER_LOGIN;
          }
        } catch (e) {
          // If cross-origin or any error prevents placing location on top, fallback to normal navigation
          window.location.href = REDIRECT_AFTER_LOGIN;
        }
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


