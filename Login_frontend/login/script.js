// Keeps original route names in your project
// For local dev, default to the backend on 4000. Allow overriding via VITE_API_BASE or runtime window.__env__.
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
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errMsg = body.message || body.error || `Request failed (${res.status})`;
      const err = new Error(errMsg);
      err.body = body;
      throw err;
    }
    return body;
  } catch (networkErr) {
    const msg = networkErr?.message || String(networkErr);
    if (url.startsWith('/') || url.startsWith(window.location.origin)) {
      const fallbacks = [
        `http://localhost:4000${url}`,
        `http://127.0.0.1:4000${url}`,
      ];
      for (const fb of fallbacks) {
        try {
          const fbRes = await fetch(fb, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const fbBody = await fbRes.json().catch(() => ({}));
          if (!fbRes.ok) continue;
          return fbBody;
        } catch (e) {}
      }
    }
    throw new Error(`Network request failed while contacting ${url}: ${msg}. Ensure the backend is running and CORS/proxy settings are configured (check VITE_API_BASE).`);
  }
}

// login submit
if (loginForm) {
  loginForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setMessage('Logging in...');
    console.debug('Login submit triggered. API_BASE:', API_BASE);
    try {
      const payload = serializeForm(loginForm);
      const data = await doRequest('login', payload);
      console.debug('Login response:', data);

      if (data.token) localStorage.setItem('token', data.token);
      setMessage('Login successful — redirecting...');

            // Redirect the parent SPA to dashboard home (companies list) instead of a specific company round.
            setTimeout(() => {
              const target = (window?.__env?.REDIRECT_AFTER_LOGIN)
                || (window.location?.origin ? `${window.location.origin}/` : null)
                || 'http://localhost:5173/';
        // Try to notify parent frame and then navigate
        try { document.dispatchEvent(new CustomEvent('loginDebug', { detail: `API_BASE=${API_BASE}\nRedirect=${target}` })); } catch (e) {}
        try { window.parent.postMessage({ type: 'LOGIN_REDIRECT', url: target }, '*'); } catch (e) {}
        try {
          if (window.top && window.top !== window.self) window.top.location.href = target;
          else window.location.href = target;
        } catch (e) { window.location.href = target; }
      }, 500);

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
      const data = await doRequest('signup', payload);
      setMessage('Signup successful — you can now log in.');
      const loginTab = document.querySelector('.tab[data-target="login-form"]');
      if (loginTab) loginTab.click();
      const loginEmail = loginForm.querySelector('input[name="email"]');
      if (loginEmail && payload.email) loginEmail.value = payload.email;
      signupForm.reset();
    } catch (err) {
      setMessage(err.message || 'Signup failed', true);
    }
  });
}
