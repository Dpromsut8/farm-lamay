import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน');
      return;
    }
    // จำลองข้อมูลเข้าสู่ระบบสำเร็จ
    onLoginSuccess({ email: username, role: 'owner' });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: 'Kanit, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: '#1e293b',
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        textAlign: 'center',
        border: '1px solid #334155'
      }}>
        
        {/* โลโก้ไอคอน */}
        <div style={{
          fontSize: '32px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          width: '70px',
          height: '70px',
          lineHeight: '70px',
          borderRadius: '50%',
          margin: '0 auto 15px',
          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
        }}>
          🌿
        </div>

        {/* ชื่อแบรนด์ออกแบบใหม่พรีเมียม */}
        <h1 style={{
          fontSize: '28px',
          color: '#ffffff',
          fontWeight: '800',
          margin: '0 0 5px 0',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          background: 'linear-gradient(90deg, #34d399, #6ee7b7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          FARM LAMAY
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 25px 0' }}>
          ระบบบริหารจัดการฟาร์มอัจฉริยะ
        </p>

        {/* ฟอร์มเข้าสู่ระบบ */}
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '5px' }}>
              ชื่อผู้ใช้งาน
            </label>
            <input 
              type="text" 
              placeholder="กรอกชื่อของคุณ" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f172a',
                border: '1px solid #475569',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '5px' }}>
              รหัสผ่าน
            </label>
            <input 
              type="password" 
              placeholder="รหัสผ่าน (เช่น 1234)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#0f172a',
                border: '1px solid #475569',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            🔐 เข้าสู่ระบบ
          </button>
        </form>

        {/* ปุ่มสมัครสมาชิกด้านล่าง */}
        <div style={{ marginTop: '25px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 10px 0' }}>
            ยังไม่มีบัญชีผู้ใช้งาน?
          </p>
          <button 
            type="button" 
            onClick={() => alert('ฟังก์ชันสมัครสมาชิก')}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              color: '#34d399',
              border: '1px dashed #34d399',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            📝 สมัครสมาชิกใหม่
          </button>
        </div>

      </div>
    </div>
  );
}
