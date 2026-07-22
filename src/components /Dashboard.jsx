// src/components/Dashboard.jsx
import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen text-gray-800">
      {/* ส่วนหัวข้อ */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-700">🌱 ละม้ายฟาร์ม Dashboard</h1>
        <p className="text-sm text-gray-500">ระบบจัดการฟาร์มและแปลงเกษตรอัจฉริยะ</p>
      </div>

      {/* การ์ดสรุปข้อมูลแปลงเกษตร */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
          <p className="text-xs text-gray-400">พื้นที่ทั้งหมด</p>
          <p className="text-xl font-bold text-green-600">22 ไร่</p>
          <p className="text-xs text-gray-500 mt-1">บ่อปลา 7 ไร่ / โซนอื่น 15 ไร่</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
          <p className="text-xs text-gray-400">สถานะระบบ IoT</p>
          <p className="text-xl font-bold text-blue-600">ปกติ 🟢</p>
          <p className="text-xs text-gray-500 mt-1">ปั๊มน้ำ & โรงเรือนพร้อมใช้งาน</p>
        </div>
      </div>

      {/* เมนูด่วน */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <h3 className="font-semibold mb-3 text-gray-700">⚡ เมนูด่วน</h3>
        <div className="grid grid-cols-3 gap-2">
          <button className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex flex-col items-center justify-center">
            📸 ถ่ายรูปโรคพืช
          </button>
          <button className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex flex-col items-center justify-center">
            💰 บันทึกบัญชี
          </button>
          <button className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium flex flex-col items-center justify-center">
            🎙️ สั่งงานด้วยเสียง
          </button>
        </div>
      </div>
    </div>
  );
}
