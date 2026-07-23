import React, { useState, useRef } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  // State สำหรับจัดการ UI และข้อมูล
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [marketPrice, setMarketPrice] = useState(0);
  const [unit, setUnit] = useState('กิโลกรัม');
  const [knowledgeText, setKnowledgeText] = useState('คลิกเลือกผลผลิตเพื่อแสดงข้อมูลการดูแลรักษาและไอเดียการพัฒนาที่นี่...');
  const [showProductForm, setShowProductForm] = useState(false);

  // Reference สำหรับทำ Auto-scroll ไปที่ฟอร์มการเงิน
  const financeRef = useRef(null);

  // ฐานข้อมูลจำลอง (ต่อยอดเชื่อม API จริงในอนาคต)
  const productData = {
    'ผักบุ้ง': { price: 25, unit: 'กำ', knowledge: 'ผักบุ้ง: ควรปลูกในดินร่วนซุย รดน้ำสม่ำเสมอเช้า-เย็น ระวังหนอนกินใบ ไอเดีย: ทำแปลงผักบุ้งลอยน้ำในสระ 7 ไร่เพื่อประหยัดพื้นที่' },
    'กล้วยน้ำว้า': { price: 40, unit: 'หวี', knowledge: 'กล้วยน้ำว้า: ตัดแต่งใบที่แห้งออกเพื่อลดโรคสะสม ควรใส่ปุ๋ยคอกรอบโคนต้น ไอเดีย: แปรรูปเป็นกล้วยตากเพิ่มมูลค่า' },
    'เห็ดนางฟ้า': { price: 60, unit: 'กิโลกรัม', knowledge: 'เห็ดนางฟ้า: รักษาความชื้นในโรงเรือนที่ 70-80% ระวังแมลงหวี่ ไอเดีย: ทำระบบพ่นหมอกอัตโนมัติ' }
  };

  // ฟังก์ชันเมื่อคลิกปุ่มผลผลิต
  const handleProductClick = (productName) => {
    const data = productData[productName];
    if (data) {
      setSelectedProduct(productName);
      setMarketPrice(data.price); // อัปเดตราคากลางอัตโนมัติ
      setUnit(data.unit);         // อัปเดตหน่วยขาย
      setKnowledgeText(data.knowledge); // อัปเดตกล่องความรู้
      
      // พับส่วนหัวและเลื่อนหน้าจอไปที่ฟอร์มการเงิน
      setIsHeaderCollapsed(true);
      if (financeRef.current) {
        financeRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* ================= ฝั่งซ้าย: จัดการผลผลิตและบัญชี ================= */}
      <div className="left-panel">
        
        {/* ส่วนหัว: ซ่อนอัตโนมัติเมื่อเริ่มทำงาน */}
        <div className={`header-section ${isHeaderCollapsed ? 'collapsed' : ''}`}>
          <h2>ฟาร์มละไม (FARM LAMAY)</h2>
          <p>ยินดีต้อนรับ, เจ้าของฟาร์ม</p>
        </div>

        {/* ปุ่มหน่วยจัดการผลผลิต */}
        <h3>หน่วยจัดการผลผลิต</h3>
        <div className="product-grid">
          {Object.keys(productData).map((item) => (
            <button key={item} className="btn-product" onClick={() => handleProductClick(item)}>
              {item}
            </button>
          ))}
        </div>

        {/* ย่อ/ขยายฟอร์มเพิ่มผลผลิตใหม่ */}
        <div className="add-new-product">
          <button onClick={() => setShowProductForm(!showProductForm)}>
            {showProductForm ? '▼ ซ่อนเมนูเพิ่มผลผลิต' : '▶ เพิ่มรายการผลผลิตใหม่'}
          </button>
          {showProductForm && (
            <div className="form-expanded" style={{ padding: '10px', background: '#eee', marginTop: '10px' }}>
              <input type="text" placeholder="ชื่อผลผลิตใหม่" />
              <button>บันทึก</button>
            </div>
          )}
        </div>

        <hr />

        {/* กล่องความรู้อัจฉริยะ (8 บรรทัด) */}
        <div className="knowledge-box">
          <h4>💡 กล่องความรู้: {selectedProduct || 'ทั่วไป'}</h4>
          <p>{knowledgeText}</p>
        </div>

        {/* ฟอร์มบันทึกทางการเงินอัตโนมัติ */}
        <div className="finance-section" ref={financeRef}>
          <h3>💰 บันทึกรายการทางการเงิน: {selectedProduct || '-'}</h3>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>ราคาซื้อ-ขาย (ราคากลาง)</label>
              <input type="number" value={marketPrice} readOnly style={{ background: '#e0e0e0' }} />
            </div>
            <div>
              <label>หน่วย</label>
              <input type="text" value={unit} readOnly style={{ background: '#e0e0e0' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ background: '#4caf50', color: 'white', padding: '10px' }}>
              รับเงิน (สแกน QR Code)
            </button>
            <button style={{ background: '#f44336', color: 'white', padding: '10px' }}>
              บันทึกรายจ่าย
            </button>
          </div>
        </div>
      </div>

      {/* ================= ฝั่งขวา: ควบคุมอุปกรณ์ ================= */}
      <div className="right-panel">
        <h3>🔧 สถานะและควบคุมอุปกรณ์</h3>
        
        {/* รถ Ford */}
        <div className="equipment-card">
          <h4>🚙 Ford Ranger 2.2 XLT</h4>
          <ul>
            <li>น้ำมันเครื่อง: ปกติ (เหลืออีก 3,000 กม.)</li>
            <li>แบตเตอรี่: 12.4V (ปกติ)</li>
            <li style={{ color: 'red' }}>* ควรสตาร์ทรถทุก 2 อาทิตย์ (รอบถัดไป: 25 ก.ค.)</li>
          </ul>
        </div>

        {/* มอเตอร์ไซค์ */}
        <div className="equipment-card alert">
          <h4>🏍️ รถมอเตอร์ไซค์</h4>
          <ul>
            <li>น้ำมันเครื่อง: <strong>ถึงระยะเปลี่ยนถ่าย!</strong></li>
            <li>แบตเตอรี่: 11.8V (ควรชาร์จทันที)</li>
          </ul>
        </div>

        {/* เครื่องสูบน้ำ & สปริงเกอร์ */}
        <div className="equipment-card">
          <h4>💧 เครื่องสูบน้ำ 6.5 แรงม้า (ท่อ 3 นิ้ว)</h4>
          <ul>
            <li>น้ำมันเครื่อง: ปกติ</li>
            <li>สถานะปั๊ม: ปิดอยู่</li>
            <li>* เปิดอาทิตย์ละครั้งป้องกันสนิม (เปิดล่าสุด: 3 วันที่แล้ว)</li>
          </ul>
          <button style={{ marginTop: '10px' }}>บันทึกแผนท่อสปริงเกอร์</button>
        </div>

        {/* โรงเห็ด */}
        <div className="equipment-card">
          <h4>🍄 ระบบควบคุมโรงเห็ด</h4>
          <ul>
            <li>อุณหภูมิ: 28°C</li>
            <li>ความชื้น: 75%</li>
            <li>สเปรย์หมอก: Auto</li>
          </ul>
        </div>

      </div>
      
    </div>
  );
}
