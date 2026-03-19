import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : "/" },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  function handleGuest() {
    if (typeof window !== "undefined") localStorage.setItem("guest_mode", "true");
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Login — Academic Record</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <div className="login-bg">
        <div className="login-card">
          <div className="login-logo">Academic<span>.</span>Record</div>
          <p className="login-sub">Sign in to sync your grades across all your devices</p>

          {error && <div className="msg error">{error}</div>}

          <button className="btn-google" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 48 48" style={{flexShrink:0}}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div className="divider"><span>or</span></div>

          <button className="btn-guest" onClick={handleGuest}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Continue as Guest
          </button>
          <p className="guest-note">Guest data is saved in this browser only — sign in with Google to sync across devices</p>
        </div>
      </div>

      <style jsx>{`
        .login-bg {
          min-height: 100vh; background: #0a0a0f;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; font-family: 'Inter', sans-serif;
        }
        .login-card {
          background: #111118; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 40px 36px; width: 100%; max-width: 400px;
        }
        .login-logo { font-family: 'Syne', sans-serif; font-size: clamp(20px, 6vw, 26px); font-weight: 800; color: #f0f0f8; letter-spacing: -0.03em; margin-bottom: 6px; }
        .login-logo span { color: #b8b0ff; }
        .login-sub { font-size: 13px; color: #55556a; margin-bottom: 32px; line-height: 1.6; }
        .msg { font-size: 13px; padding: 10px 14px; border-radius: 7px; line-height: 1.5; margin-bottom: 16px; }
        .msg.error { background: rgba(244,63,94,0.1); color: #f43f5e; border: 1px solid rgba(244,63,94,0.2); }
        .btn-google {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          background: #fff; border: none; border-radius: 8px;
          color: #1a1a1a; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          padding: 12px 16px; cursor: pointer; transition: background 0.15s, opacity 0.15s;
        }
        .btn-google:hover { background: #f0f0f0; }
        .btn-google:disabled { opacity: 0.6; cursor: not-allowed; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0 16px; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider span { font-size: 11px; color: #35354a; letter-spacing: 0.05em; }
        .btn-guest {
          width: 100%; background: none; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #9090b0; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500; padding: 11px; cursor: pointer;
          transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-guest:hover { border-color: rgba(255,255,255,0.2); color: #f0f0f8; background: rgba(255,255,255,0.04); }
        .guest-note { font-size: 11px; color: #35354a; text-align: center; margin-top: 12px; line-height: 1.5; }
      `}</style>
    </>
  );
}
