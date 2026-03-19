import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "signup"
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

  return (
    <>
      <Head>
        <title>Login — Academic Record</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <div className="login-bg">
        <div className="login-card">
          <div className="login-logo">Academic<span>.</span>Record</div>
          <p className="login-sub">Sign in to access your grades from anywhere</p>

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
        </div>
      </div>

      <style jsx>{`
        .login-bg {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Inter', sans-serif;
        }
        .login-card {
          background: #111118;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
        }
        .login-logo {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #f0f0f8;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .login-logo span { color: #b8b0ff; }
        .login-sub {
          font-size: 13px;
          color: #55556a;
          margin-bottom: 28px;
          line-height: 1.5;
        }
        .mode-toggle {
          display: flex;
          background: #18181f;
          border-radius: 8px;
          padding: 3px;
          margin-bottom: 24px;
          gap: 3px;
        }
        .mode-toggle button {
          flex: 1;
          background: none;
          border: none;
          color: #55556a;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .mode-toggle button.active {
          background: #7c6ff7;
          color: #fff;
        }
        .login-form { display: flex; flex-direction: column; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 12px; color: #9090b0; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; }
        .field input {
          background: #18181f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 11px 14px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #f0f0f8;
          outline: none;
          transition: border-color 0.15s;
        }
        .field input:focus { border-color: #7c6ff7; }
        .field input::placeholder { color: #35354a; }
        .msg {
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 7px;
          line-height: 1.5;
        }
        .msg.error { background: rgba(244,63,94,0.1); color: #f43f5e; border: 1px solid rgba(244,63,94,0.2); }
        .msg.success { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .btn-submit {
          background: #7c6ff7;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 12px;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          margin-top: 4px;
        }
        .btn-submit:hover { background: #6a5ef5; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </>
  );
}
