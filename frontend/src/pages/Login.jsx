import React, { useEffect } from 'react'

const Login = () => {
  useEffect(() => {
    const handler = (ev) => {
      try {
        if (ev?.data?.type === 'LOGIN_REDIRECT' && typeof ev?.data?.url === 'string') {
          console.debug('Login iframe requested redirect to:', ev.data.url);
          window.location.href = ev.data.url;
        }
      } catch (e) {
        console.error('Failed to handle login redirect message', e);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);
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


