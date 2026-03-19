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
      else setSuccess("Check your email to confirm, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/");
    }
    setLoading(false);
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

      <div className="bg">
        {/* Guest — top of page, always visible */}
        <button className="btn-guest-top" onClick={handleGuest}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Continue as Guest — no sign up needed
          <span className="arrow">→</span>
        </button>

        <div className="card">
          <div className="logo">Academic<span>.</span>Record</div>

          <div className="toggle">
            <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(null); setSuccess(null); }}>Log in</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}>Sign up</button>
          </div>

          <form onSubmit={handleSubmit}>
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

          <p className="note">Guest data saves in this browser · Sign up to sync across devices</p>
        </div>
      </div>

      <style jsx>{`
        .bg {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          gap: 16px;
          font-family: 'Inter', sans-serif;
        }
        .btn-guest-top {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(124,111,247,0.15);
          border: 1px solid rgba(124,111,247,0.4);
          border-radius: 50px;
          color: #b8b0ff;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.15s;
          width: 100%;
          max-width: 400px;
          justify-content: center;
        }
        .btn-guest-top:hover {
          background: rgba(124,111,247,0.28);
          border-color: rgba(124,111,247,0.7);
          color: #d4cfff;
        }
        .arrow { margin-left: 2px; font-size: 14px; }
        .card {
          background: #111118;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 32px;
          width: 100%;
          max-width: 400px;
        }
        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #f0f0f8;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .logo span { color: #b8b0ff; }
        .toggle {
          display: flex;
          background: #18181f;
          border-radius: 8px;
          padding: 3px;
          margin-bottom: 20px;
          gap: 3px;
        }
        .toggle button {
          flex: 1; background: none; border: none;
          color: #55556a; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          padding: 8px; border-radius: 6px; cursor: pointer;
          transition: all 0.15s;
        }
        .toggle button.active { background: #7c6ff7; color: #fff; }
        form { display: flex; flex-direction: column; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 11px; color: #9090b0; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
        .field input {
          background: #18181f; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 10px 13px;
          font-family: 'Inter', sans-serif; font-size: 14px;
          color: #f0f0f8; outline: none; transition: border-color 0.15s;
        }
        .field input:focus { border-color: #7c6ff7; }
        .field input::placeholder { color: #35354a; }
        .msg { font-size: 12px; padding: 9px 12px; border-radius: 7px; line-height: 1.5; }
        .msg.error { background: rgba(244,63,94,0.1); color: #f43f5e; border: 1px solid rgba(244,63,94,0.2); }
        .msg.success { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .btn-submit {
          background: #7c6ff7; border: none; border-radius: 8px;
          color: #fff; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600; padding: 11px;
          cursor: pointer; transition: background 0.15s, opacity 0.15s;
          margin-top: 2px;
        }
        .btn-submit:hover { background: #6a5ef5; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .note {
          font-size: 11px; color: #35354a;
          text-align: center; margin-top: 16px; line-height: 1.5;
        }
      `}</style>
    </>
  );
}
