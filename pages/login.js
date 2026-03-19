import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess("Account created! Check your email to confirm, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/");
    }
    setLoading(false);
  }

  function handleGuest() {
    if (typeof window !== "undefined") {
      localStorage.setItem("guest_mode", "true");
    }
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
          <p className="login-sub">Sign in to sync your grades across devices</p>

          <div className="mode-toggle">
            <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(null); setSuccess(null); }}>Log in</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}>Sign up</button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            {error && <div className="msg error">{error}</div>}
            {success && <div className="msg success">{success}</div>}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <div className="divider"><span>or</span></div>

          <button className="btn-guest" onClick={handleGuest}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Continue as Guest
          </button>
          <p className="guest-note">Guest data is saved in this browser only — sign up to sync across devices</p>
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
          border-radius: 14px; padding: 40px; width: 100%; max-width: 400px;
        }
        .login-logo { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #f0f0f8; letter-spacing: -0.03em; margin-bottom: 6px; }
        .login-logo span { color: #b8b0ff; }
        .login-sub { font-size: 13px; color: #55556a; margin-bottom: 28px; line-height: 1.5; }
        .mode-toggle { display: flex; background: #18181f; border-radius: 8px; padding: 3px; margin-bottom: 24px; gap: 3px; }
        .mode-toggle button { flex: 1; background: none; border: none; color: #55556a; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; padding: 8px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
        .mode-toggle button.active { background: #7c6ff7; color: #fff; }
        .login-form { display: flex; flex-direction: column; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 11px; color: #9090b0; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
        .field input { background: #18181f; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 11px 14px; font-family: 'Inter', sans-serif; font-size: 14px; color: #f0f0f8; outline: none; transition: border-color 0.15s; }
        .field input:focus { border-color: #7c6ff7; }
        .field input::placeholder { color: #35354a; }
        .msg { font-size: 13px; padding: 10px 14px; border-radius: 7px; line-height: 1.5; }
        .msg.error { background: rgba(244,63,94,0.1); color: #f43f5e; border: 1px solid rgba(244,63,94,0.2); }
        .msg.success { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .btn-submit { background: #7c6ff7; border: none; border-radius: 8px; color: #fff; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; padding: 12px; cursor: pointer; transition: background 0.15s, opacity 0.15s; margin-top: 4px; }
        .btn-submit:hover { background: #6a5ef5; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0 16px; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider span { font-size: 11px; color: #35354a; letter-spacing: 0.05em; }
        .btn-guest { width: 100%; background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #9090b0; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; padding: 11px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-guest:hover { border-color: rgba(255,255,255,0.2); color: #f0f0f8; background: rgba(255,255,255,0.04); }
        .guest-note { font-size: 11px; color: #35354a; text-align: center; margin-top: 12px; line-height: 1.5; }
      `}</style>
    </>
  );
}
