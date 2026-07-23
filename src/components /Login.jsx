import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [usePinMode, setUsePinMode] = useState(false);
  const [pin, setPin] = useState('');

  // จำลองการเข้าสู่ระบบแบบ Traditional / PIN
  const handleLogin = (e) => {
    e.preventDefault();
    if (usePinMode) {
      if (pin.length < 4) {
        alert('กรุณากรอกรหัส PIN ให้ครบ 4-6 หลัก');
        return;
      }
      onLoginSuccess({ username: 'User (PIN Auth)' });
    } else {
      if (!identifier || !password) {
        alert('กรุณากรอกอีเมล/เบอร์โทร และรหัสผ่าน');
        return;
      }
      // หลังบ้านจะทำการตรวจสอบผ่าน Hashing (bcrypt/Argon2)
      onLoginSuccess({ username: identifier });
    }
  };

  // จำลองการเข้าสู่ระบบด้วย Biometric (สแกนนิ้ว/ใบหน้า)
  const handleBiometricLogin = () => {
    alert('ระบบสแกนลายนิ้วมือ/ใบหน้าสำเร็จ (Fast Authentication)');
    onLoginSuccess({ username: 'Biometric User' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* โลโก้แบรนด์ */}
        <div className="brand-logo-container">
          <div className="farm-icon">🌿</div>
          <h1 className="brand-title">FARM LAMAY</h1>
          <p className="brand-subtitle">ระบบบริหารจัดการฟาร์มอัจฉริยะ</p>
        </div>

        {/* ปุ่มสลับไปใช้ Biometric ด่วน */}
        <button type="button" className="biometric-login-btn" onClick={handleBiometricLogin}>
          🔐 เข้าสู่ระบบด้วยสแกนนิ้ว / Face ID
        </button>

        <form onSubmit={handleLogin} className="login-form">
          {!usePinMode ? (
            <>
              <div className="input-group">
                <label>อีเมล หรือ เบอร์โทรศัพท์</label>
                <input 
                  type="text" 
                  placeholder="name@email.com หรือ 0812345678" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <span 
                  className="link-text" 
                  style={{ fontSize: '12px' }} 
                  onClick={() => setUsePinMode(true)}
                >
                  ใช้รหัส PIN 4 หลักแทน?
                </span>
                <div className="forgot-password">
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('ส่งลิงก์กู้คืนรหัสผ่านไปยังอีเมลเรียบร้อยแล้ว'); }}>
                    ลืมรหัสผ่าน?
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="input-group">
              <label>กรอกรหัส PIN (4-6 หลัก)</label>
              <input 
                type="password" 
                maxLength={6}
                placeholder="• • • •" 
                style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <div className="form-actions" style={{ marginTop: '10px' }}>
                <span 
                  className="link-text" 
                  style={{ fontSize: '12px' }} 
                  onClick={() => setUsePinMode(false)}
                >
                  กลับไปใช้รหัสผ่านปกติ
                </span>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary">
            {usePinMode ? 'ยืนยันรหัส PIN' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="divider">
          <span>หรือเข้าสู่ระบบผ่านโซเชียล</span>
        </div>

        {/* Social Login 4 ช่องทาง */}
        <div className="social-login-grid">
          <button className="btn-social" onClick={() => alert('เชื่อมต่อ Google Login')}>🌐 Google</button>
          <button className="btn-social" onClick={() => alert('เชื่อมต่อ LINE Login')}>💬 LINE</button>
          <button className="btn-social" onClick={() => alert('เชื่อมต่อ Facebook Login')}>📘 Facebook</button>
          <button className="btn-social" onClick={() => alert('เชื่อมต่อ Apple ID')}>🍎 Apple ID</button>
        </div>

        {/* ลิงก์ไปหน้าลงทะเบียนใหม่ */}
        <div className="register-redirect">
          <p>ผู้ใช้ใหม่? <span onClick={onNavigateToRegister} className="link-text">ลงทะเบียนที่นี่</span></p>
        </div>

      </div>
    </div>
  );
}
