import React, { useState, useEffect } from 'react';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer1 = setTimeout(() => { setWelcomeStep(1); }, 500);
    const timer2 = setTimeout(() => { setWelcomeStep(2); }, 2200);
    const timer3 = setTimeout(() => { setWelcomeStep(4); }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleSocialLogin = (provider) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', `${provider} User`);
    if (onLoginSuccess) {
      onLoginSuccess(`${provider} User`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน');
      return;
    }
    if (isRegister && password.length < 8) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    if (onLoginSuccess) {
      onLoginSuccess(username);
    }
  };

  // ช่วงแสดงข้อความต้อนรับ (Welcome Animation Screen)
  if (welcomeStep < 4) {
    return (
      <div className="login-container" style={{ background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          {welcomeStep === 1 && (
            <h1 style={{ fontSize: '3rem', color: '#38bdf8' }}>สวัสดี 👋</h1>
          )}
          {welcomeStep === 2 && (
            <h1 style={{ fontSize: '2.2rem', color: '#34d399' }}>
              ยินดีต้อนรับสู่ <br />
              <span style={{ fontSize: '2.8rem', color: '#f59e0b' }}>🌱 ไร่ละไม (Farm Lamay)</span>
            </h1>
          )}
        </div>
      </div>
    );
  }

  // หน้าจอหลัก (Login / Register)
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-logo-container">
          <div className="farm-icon">🌱</div>
          <h1 className="brand-title">ไร่ละไม</h1>
          <p className="brand-subtitle">
            {isRegister ? 'สมัครสมาชิกสำหรับผู้ใช้รายใหม่' : 'เข้าสู่ระบบสำหรับผู้ที่มียูสเซอร์แล้ว'}
          </p>
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        {/* ปุ่ม Social Login */}
        <div className="social-login-grid">
          <button type="button" className="btn-social" onClick={() => handleSocialLogin('Google')}>
            🌐 Google
          </button>
          <button type="button" className="btn-social" onClick={() => handleSocialLogin('LINE')}>
            💬 LINE
          </button>
        </div>

        <div className="divider">
          <span>หรือ ใช้อีเมล / ยูสเซอร์</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>ชื่อผู้ใช้งาน / อีเมล</label>
            <input 
              type="text" 
              placeholder="กรอกชื่อของคุณ" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>รหัสผ่าน</label>
            <input 
              type="password" 
              placeholder="รหัสผ่านของคุณ" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isRegister && (
            <div className="form-actions">
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 'auto' }} /> จำฉันไว้ในระบบ
              </label>
              <span className="forgot-password">
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('ระบบส่งลิงก์กู้คืนรหัสผ่านไปยังอีเมลของคุณแล้ว'); }}>
                  ลืมรหัสผ่าน?
                </a>
              </span>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            {isRegister ? '📝 ลงทะเบียนสมัครสมาชิก' : '🚀 เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p className="register-redirect">
            {isRegister ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชีใช่ไหม?'}{' '}
            <span className="link-text" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
              {isRegister ? 'เข้าสู่ระบบที่นี่' : 'สมัครสมาชิกสำหรับผู้ใช้รายใหม่'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
