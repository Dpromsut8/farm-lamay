// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Accounting from './components/Accounting';
import Inventory from './components/Inventory';
import AIDoctor from './components/AIDoctor';
import FarmMap from './components/FarmMap';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');

  useEffect(() => {
    // ตรวจสอบข้อมูลการเข้าสู่ระบบจาก LocalStorage
    const savedUser = localStorage.getItem('lamai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lamai_user');
    setUser(null);
  };

  // หากยังไม่เข้าสู่ระบบ ให้แสดงหน้า Login
  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      {/* ส่วนหัวแอป */}
      <header className="bg-green-700 text-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="font-bold text-lg">🌱 ละม้ายฟาร์ม</h1>
          <p className="text-xs text-green-200">ผู้ใช้งาน: {user.email} ({user.role === 'owner' ? 'เจ้าของฟาร์ม' : 'ทีมงาน'})</p>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs bg-green-800 hover:bg-green-900 px-3 py-1.5 rounded-lg transition-all"
        >
          ออกจากระบบ
        </button>
      </header>

      {/* พื้นที่แสดงเนื้อหาตาม Tab ที่เลือก */}
      <main className="flex-1">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'accounting' && <Accounting />}
        {currentTab === 'inventory' && <Inventory />}
        {currentTab === 'aiDoctor' && <AIDoctor />}
        {currentTab === 'farmMap' && <FarmMap />}
      </main>

      {/* เมนูด้านล่าง (Bottom Navigation Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 shadow-lg">
        <button 
          onClick={() => setCurrentTab('dashboard')} 
          className={`flex flex-col items-center text-xs ${currentTab === 'dashboard' ? 'text-green-700 font-bold' : 'text-gray-400'}`}
        >
          <span>🏠</span>
          <span>หน้าแรก</span>
        </button>
        <button 
          onClick={() => setCurrentTab('accounting')} 
          className={`flex flex-col items-center text-xs ${currentTab === 'accounting' ? 'text-green-700 font-bold' : 'text-gray-400'}`}
        >
          <span>💰</span>
          <span>บัญชี</span>
        </button>
        <button 
          onClick={() => setCurrentTab('inventory')} 
          className={`flex flex-col items-center text-xs ${currentTab === 'inventory' ? 'text-green-700 font-bold' : 'text-gray-400'}`}
        >
          <span>📦</span>
          <span>สต๊อก</span>
        </button>
        <button 
          onClick={() => setCurrentTab('aiDoctor')} 
          className={`flex flex-col items-center text-xs ${currentTab === 'aiDoctor' ? 'text-green-700 font-bold' : 'text-gray-400'}`}
        >
          <span>🌿</span>
          <span>AI คลินิก</span>
        </button>
        <button 
          onClick={() => setCurrentTab('farmMap')} 
          className={`flex flex-col items-center text-xs ${currentTab === 'farmMap' ? 'text-green-700 font-bold' : 'text-gray-400'}`}
        >
          <span>🗺️</span>
          <span>ผังฟาร์ม</span>
        </button>
      </nav>
    </div>
  );
}
