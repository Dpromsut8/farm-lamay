// src/components/Inventory.jsx
import React, { useState } from 'react';

export default function Inventory() {
  const [items, setItems] = useState([
    { id: 1, name: 'ปุ๋ยอินทรีย์', quantity: 25, unit: 'กระสอบ', category: 'ปุ๋ย/ดิน' },
    { id: 2, name: 'อาหารปลาดุก (เม็ดเล็ก)', quantity: 10, unit: 'กระสอบ', category: 'อาหารสัตว์' },
    { id: 3, name: 'เชื้อเห็ดนางฟ้า', quantity: 150, unit: 'ก้อน', category: 'โรงเห็ด' }
  ]);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('กระสอบ');
  const [category, setCategory] = useState('ปุ๋ย/ดิน');

  const addItem = (e) => {
    e.preventDefault();
    if (!name || !quantity) return;

    const newItem = {
      id: Date.now(),
      name,
      quantity: parseInt(quantity),
      unit,
      category
    };

    setItems([newItem, ...items]);
    setName('');
    setQuantity('');
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-2xl font-bold text-green-700 mb-4">📦 คลังสินค้า & สต๊อกฟาร์ม</h1>

      {/* ฟอร์มเพิ่มสินค้าในสต๊อก */}
      <form onSubmit={addItem} className="bg-white p-4 rounded-xl shadow-sm mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">➕ เพิ่มรายการพัสดุ/ปุ๋ย/อาหาร</h3>
        <div>
          <label className="text-xs text-gray-500">ชื่อรายการ</label>
          <input 
            type="text" 
            placeholder="เช่น ปุ๋ยคอก, อาหารปลา" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">จำนวน</label>
            <input 
              type="number" 
              placeholder="0" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">หน่วย</label>
            <input 
              type="text" 
              placeholder="กระสอบ / กก. / ก้อน" 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500">หมวดหมู่</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
          >
            <option value="ปุ๋ย/ดิน">ปุ๋ย / ดิน</option>
            <option value="อาหารสัตว์">อาหารสัตว์</option>
            <option value="โรงเห็ด">โรงเห็ด</option>
            <option value="เครื่องมือ/อุปกรณ์">เครื่องมือ / อุปกรณ์</option>
          </select>
        </div>
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg font-medium text-sm">
          เพิ่มเข้าคลัง
        </button>
      </form>

      {/* รายการในสต๊อก */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-3">📋 สต๊อกคงเหลือปัจจุบัน</h3>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border-b text-sm">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{item.category}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-700 text-base">{item.quantity} <span className="text-xs font-normal text-gray-500">{item.unit}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
