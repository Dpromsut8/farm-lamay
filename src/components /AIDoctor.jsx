import React, { useState, useEffect } from 'react';

export default function AIDoctor() {
    // 1. State สำหรับเก็บข้อมูลครอบครัวและสัตว์เลี้ยง
    const [familyProfile, setFamilyProfile] = useState(() => {
        const saved = localStorage.getItem('familyProfile');
        return saved ? JSON.parse(saved) : {
            membersCount: 2,
            dogsCount: 1,
            catsCount: 1,
            birdsCount: 0,
            fishesCount: 0,
            chickensCount: 10,
            preferences: "ชอบอาหารรสจัด เผ็ดกลางๆ เน้นวัตถุดิบสดจากฟาร์ม สุนัขและแมวกินธรรมชาติไม่ปรุงรส"
        };
    });

    const [aiResult, setAiResult] = useState("");

    // 2. ฟังก์ชันบันทึกข้อมูล
    const handleSaveProfile = (e) => {
        e.preventDefault();
        localStorage.setItem('familyProfile', JSON.stringify(familyProfile));
        alert("บันทึกข้อมูลครอบครัวและสัตว์เลี้ยงเรียบร้อย!");
    };

    // 3. ฟังก์ชัน AI แนะนำเมนูกลาง (คน + สัตว์เลี้ยง)
    const generateSharedMealPlan = (mealTime) => {
        let result = "";
        if (mealTime === "เช้า") {
            result = "🍳 มื้อเช้า: ข้าวต้มปลาฟาร์ม\n- คน: ปรุงรสตามชอบ\n- หมา/แมว: เนื้อปลาต้มสุกแกะก้าง (ไม่ปรุงรส)";
        } else if (mealTime === "เที่ยง") {
            result = "☀️ มื้อเที่ยง: ผัดกระเพราไก่บ้าน\n- คน: จัดจ้านถึงใจ\n- หมา/แมว: แบ่งเนื้อไก่รวนสุกก่อนใส่พริก คลุกข้าว";
        } else {
            result = "🌙 มื้อเย็น: แกงจืดเต้าหู้หมูสับ\n- คน: ซดน้ำซุปร้อนๆ\n- หมา/แมว: ตักหมูสับและน้ำซุปใสไม่ใส่พริกไทยให้กินด้วยกัน";
        }
        setAiResult(result);
    };

    return (
        <div className="p-4 bg-slate-900 text-white rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-sky-400">🐾 ตั้งค่าสมาชิกและ AI เมนูกลาง</h2>
            
            {/* ฟอร์มตั้งค่า */}
            <form onSubmit={handleSaveProfile} className="space-y-3 mb-6 bg-slate-800 p-4 rounded">
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="text-xs">คนในบ้าน:</label>
                        <input type="number" value={familyProfile.membersCount} 
                            onChange={(e)=>setFamilyProfile({...familyProfile, membersCount: e.target.value})}
                            className="w-full p-1 bg-slate-700 rounded text-white" />
                    </div>
                    <div>
                        <label className="text-xs">🐶 หมา:</label>
                        <input type="number" value={familyProfile.dogsCount} 
                            onChange={(e)=>setFamilyProfile({...familyProfile, dogsCount: e.target.value})}
                            className="w-full p-1 bg-slate-700 rounded text-white" />
                    </div>
                    <div>
                        <label className="text-xs">🐱 แมว:</label>
                        <input type="number" value={familyProfile.catsCount} 
                            onChange={(e)=>setFamilyProfile({...familyProfile, catsCount: e.target.value})}
                            className="w-full p-1 bg-slate-700 rounded text-white" />
                    </div>
                </div>
                <button type="submit" className="bg-emerald-600 px-4 py-2 rounded text-sm font-bold">💾 บันทึกข้อมูล</button>
            </form>

            {/* ส่วนกดขอเมนู AI */}
            <div className="bg-slate-800 p-4 rounded text-center">
                <h3 className="text-sky-300 font-semibold mb-2">🤖 AI คิดเมนูทำหม้อเดียว (คน + สัตว์เลี้ยง)</h3>
                <div className="flex justify-center gap-2 mb-4">
                    <button onClick={()=>generateSharedMealPlan("เช้า")} className="bg-amber-600 px-3 py-1 rounded text-sm">มื้อเช้า</button>
                    <button onClick={()=>generateSharedMealPlan("เที่ยง")} className="bg-yellow-600 px-3 py-1 rounded text-sm">มื้อเที่ยง</button>
                    <button onClick={()=>generateSharedMealPlan("เย็น")} className="bg-indigo-600 px-3 py-1 rounded text-sm">มื้อเย็น</button>
                </div>
                {aiResult && (
                    <div className="bg-slate-900 p-3 rounded text-left whitespace-pre-line text-emerald-300 text-sm border border-slate-700">
                        {aiResult}
                    </div>
                )}
            </div>
        </div>
    );
}
