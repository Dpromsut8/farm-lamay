// src/components/AIDoctor.jsx
import React, { useState } from 'react';

export default function AIDoctor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // จำลองการเลือกรูปภาพจากกล้องหรือแกลเลอรี
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  // จำลองการวิเคราะห์โรคด้วย AI
  const analyzeWithAI = () => {
    if (!selectedImage) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalysisResult({
        disease: 'โรคใบจุดเหลือง (Leaf Spot)',
        confidence: '92%',
        symptom: 'พบจุดสีน้ำตาลหรือเหลืองกระจายตามแผ่นใบ เกิดจากเชื้อรา',
        treatment: '1. ตัดแต่งใบล่างที่อาการรุนแรงทิ้ง\n2. ฉีดพ่นด้วยสารป้องกันกำจัดเชื้อรา (เช่น แมนโคเซบ)\n3. ลดความชื้นและการให้น้ำแบบโดนใบ'
      });
    }, 2000);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-2xl font-bold text-green-700 mb-2">🌿 คลินิกพืช/สัตว์ AI</h1>
      <p className="text-xs text-gray-500 mb-6">ถ่ายรูปอาการผิดปกติของพืชหรือสัตว์ เพื่อให้ AI ช่วยวินิจฉัย</p>

      {/* ส่วนอัปโหลด / ถ่ายรูป */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 text-center">
        {selectedImage ? (
          <div className="mb-4">
            <img src={selectedImage} alt="Uploaded preview" className="w-full h-48 object-cover rounded-lg mb-2" />
            <button 
              onClick={() => { setSelectedImage(null); setAnalysisResult(null); }}
              className="text-xs text-red-500 underline"
            >
              เปลี่ยนรูปภาพ
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-green-300 rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition-all">
            <span className="text-3xl mb-2">📸</span>
            <span className="text-sm font-medium text-green-700">แตะเพื่อถ่ายรูป หรือเลือกรูปภาพ</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        )}

        {selectedImage && !analysisResult && (
          <button 
            onClick={analyzeWithAI} 
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm shadow-md mt-2 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>กำลังให้ AI วิเคราะห์โรค... 🔍</span>
            ) : (
              <span>วิเคราะห์อาการด้วย AI 🤖</span>
            )}
          </button>
        )}
      </div>

      {/* ผลการวินิจฉัยจาก AI */}
      {analysisResult && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-green-700 text-base">📋 ผลการวินิจฉัย</h3>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">ความแม่นยำ {analysisResult.confidence}</span>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-gray-500">โรคที่พบ:</p>
            <p className="font-bold text-red-700 text-sm">{analysisResult.disease}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">ลักษณะอาการ:</p>
            <p className="text-sm text-gray-700">{analysisResult.symptom}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">แนวทางการรักษา / แก้ไข:</p>
            <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-lg border">{analysisResult.treatment}</p>
          </div>
        </div>
      )}
    </div>
  );
}
