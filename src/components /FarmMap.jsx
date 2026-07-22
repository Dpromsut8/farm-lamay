// src/components/FarmMap.jsx
import React, { useState } from 'react';

export default function FarmMap() {
  const [zones, setZones] = useState([
    { id: 1, name: 'บ่อปลาหลัก (7 ไร่)', type: 'pond', status: 'ปกติ (น้ำเต็ม)', iot: 'ปั๊มน้ำ: ทำงาน 🟢' },
    { id: 2, name: 'โซนโรงเรือนเพาะเห็ด', type: 'mushroom', status: 'ความชื้นเหมาะสม', iot: 'สปริงเกอร์: ปิด ⚪' },
    { id: 3, name: 'โซนปลูกพืชผักสวนครัว', type: 'crop', status: 'กำลังเติบโต', iot: 'ระบบน้ำหยด: ทำงาน 🟢' },
    { id: 4, name: 'พื้นที่ว่างเตรียมพัฒนา', type: 'empty', status: 'รอการจัดสรร', iot: '-' }
  ]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-2xl font-bold text-green-700 mb-2">🗺️ แผนผังแปลงเกษตร & IoT</h1>
      <p className="text-xs text-gray-500 mb-6">ภาพรวมการจัดสรรพื้นที่ 22 ไร่ และสถานะอุปกรณ์ควบคุมอัตโนมัติ</p>

      {/* สรุปพื้นที่ */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-green-100">
        <h3 className="font-semibold text-gray-700 mb-2">📊 สรุปการใช้พื้นที่</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">โซนบ่อปลา</p>
            <p className="text-lg font-bold text-blue-700">7 ไร่</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500">โซนเกษตร/โรงเรือน</p>
            <p className="text-lg font-bold text-green-700">15 ไร่</p>
          </div>
        </div>
      </div>

      {/* รายละเอียดแต่ละโซน */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-3">📍 สถานะแต่ละแปลงและอุปกรณ์ IoT</h3>
        <div className="space-y-3">
          {zones.map(zone => (
            <div key={zone.id} className="p-3 border rounded-xl bg-gray-50 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-sm">{zone.name}</span>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">{zone.status}</span>
              </div>
              <p className="text-xs text-gray-500">🔌 สถานะ IoT: <span className="font-medium text-gray-700">{zone.iot}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
