import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
      else router.replace("/login");
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif", color: "#55556a", fontSize: 14 }}>
      Signing you in…
    </div>
  );
}
