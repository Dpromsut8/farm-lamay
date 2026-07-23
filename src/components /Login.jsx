import React, { useState } from 'react';
import './Login.css'; // หรือปรับใช้ Tailwind ตามโครงสร้างเดิมของคุณ

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน');
      return;
    }
    // จำลองการเข้าสู่ระบบสำเร็จ
    onLoginSuccess({ username });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-logo-container">
          <div className="farm-icon">🌿</div>
          <h1 className="brand-title">FARM LAMAY</h1>
          <p className="brand-subtitle">ระบบบริหารจัดการฟาร์มัจฉริยะ</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>ชื่อผู้ใช้งานหรืออีเมล</label>
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
              placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot-password">
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('ระบบส่งลิงก์กู้คืนรหัสผ่านไปยังอีเมลของคุณแล้ว'); }}>ลืมรหัสผ่าน?</a>
          </div>

          <button type="submit" className="btn-primary">เข้าสู่ระบบ</button>
        </form>

        <div className="divider">
          <span>หรือเข้าสู่ระบบด้วย</span>
        </div>

        <div className="social-login-group">
          <button className="btn-social google" onClick={() => alert('เชื่อมต่อ Google Login')}>Google</button>
          <button className="btn-social line" onClick={() => alert('เชื่อมต่อ LINE Login')}>LINE</button>
          <button className="btn-social apple" onClick={() => alert('เชื่อมต่อ Apple ID')}>Apple ID</button>
        </div>

        <div className="register-redirect">
          <p>ยังไม่มีบัญชีผู้ใช้? <span onClick={onNavigateToRegister} className="link-text">ลงทะเบียนที่นี่</span></p>
        </div>
      </div>
    </div>
  );
}
