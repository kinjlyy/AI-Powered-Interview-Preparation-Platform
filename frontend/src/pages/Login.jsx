import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (ev) => {
      try {
        if (ev?.data?.type === 'LOGIN_REDIRECT' && typeof ev?.data?.url === 'string') {
          const urlStr = ev.data.url;
          console.debug('Login iframe requested redirect to:', urlStr);
          try {
            // If the redirect url is same-origin, use react-router navigation to preserve SPA state
            const parsed = new URL(urlStr);
            if (parsed.origin === window.location.origin) {
              const localPath = parsed.pathname + parsed.search + parsed.hash;
              console.debug('Using client-side navigation to:', localPath);
              navigate(localPath);
              return;
            }
          } catch (e) {
            // urlStr might be a relative path like '/company/google'
            if (typeof urlStr === 'string' && urlStr.startsWith('/')) {
              console.debug('Using client-side navigation to relative path:', urlStr);
              navigate(urlStr);
              return;
            }
          }

          // Otherwise, fallback to top-level navigation
          console.debug('Falling back to top-level navigation to:', urlStr);
          window.location.href = urlStr;
        }
      } catch (e) {
        console.error('Failed to handle login redirect message', e);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [navigate]);
  const loginSrc = (window?.__env?.LOGIN_URL) || '/login/index.html';
  return (
    <iframe
      src={loginSrc}
      title="Login"
      className="w-full h-screen border-0"
    />
  )
}

export default Login


