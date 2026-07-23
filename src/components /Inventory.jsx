import React from 'react';

export default function Inventory() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Kanit, sans-serif' }}>
      <h2 style={{ color: '#065f46', marginBottom: '15px' }}>📦 จัดการสต๊อกสินค้า</h2>
      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <p style={{ color: '#4b5563', margin: 0 }}>รายการปุ๋ย, อุปกรณ์, และผลผลิตในคลัง</p>
      </div>
    </div>
  );
}
