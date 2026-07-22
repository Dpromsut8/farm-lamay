// src/components/Login.jsx
import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner'); // 'owner' หรือ 'worker'

  const handleLogin = (e) => {
    e.preventDefault();
    // จำลองการเข้าสู่ระบบสำเร็จ
    if (email && password) {
      const userData = { email, role };
      localStorage.setItem('lamai_user', JSON.stringify(userData));
      if (onLoginSuccess) onLoginSuccess(userData);
    } else {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen p-6 bg-gradient-to-b from-green-700 to-green-900 text-gray-800">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-auto">
        
        {/* ส่วนหัว */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">🌱 ละม้ายฟาร์ม</h1>
          <p className="text-xs text-gray-500 mt-1">ระบบบริหารจัดการแปลงเกษตรอัจฉริยะ</p>
        </div>

        {/* ฟอร์มเข้าสู่ระบบ */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 font-medium">อีเมลผู้ใช้งาน</label>
            <input 
              type="email" 
              placeholder="example@farm.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 font-medium">รหัสผ่าน</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 font-medium">บทบาทการใช้งาน</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="owner">👨‍🌾 เจ้าของฟาร์ม (สิทธิ์เต็ม)</option>
              <option value="worker">👷 ทีมงาน/คนงาน (บันทึกข้อมูลทั่วไป)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all mt-2"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">รองรับระบบปลดล็อกด่วนด้วยลายนิ้วมือ (Biometric)</p>
        </div>

      </div>
    </div>
  );
}
