"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">เข้าสู่ระบบ</h2>

        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" className="auth-label">อีเมล</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-medee"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" className="auth-label">รหัสผ่าน</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-medee"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            ลงชื่อเข้าใช้
          </button>
        </form>

        <div className="auth-button-group">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn-secondary"
            style={{ backgroundColor: '#db4437' }}
          >
            เข้าสู่ระบบด้วย Google
          </button>
          <button
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            className="btn-secondary"
            style={{ backgroundColor: '#4267B2' }}
          >
            เข้าสู่ระบบด้วย Facebook
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-light)' }}>
          ยังไม่ได้เป็นสมาชิก?{" "}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            สมัครสมาชิกใหม่
          </Link>
        </p>
      </div>
    </div>
  );
}
