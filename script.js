// --- 1. จำลอง Cloud Database & State Management ---
let currentUser = null;
let farmData = [];
let farmDataStorage = {};
let customGroupTitles = {};

const defaultGroupTitles = {
    "pets-group": "สัตว์เลี้ยง",
    "plants-group": "พืชสวน",
    "consumable-group": "วัสดุสิ้นเปลือง"
};

const apiMarketMock = {
    "มะละกอฮอลแลนด์": { marketPrice: 35, farmPrice: 30, group: "plants-group", emoji: "🥭" },
    "ปุ๋ยคอก": { marketPrice: 50, farmPrice: 40, group: "consumable-group", emoji: "💩" },
    "อาหารไก่ซีพี": { marketPrice: 480, farmPrice: 460, group: "consumable-group", emoji: "🌾" },
    "ท่อpvc 1นิ้ว": { marketPrice: 65, farmPrice: 55, group: "consumable-group", emoji: "🚰" },
    "ปั๊มน้ำ": { marketPrice: 2500, farmPrice: 2400, group: "consumable-group", emoji: "⚡" },
    "ไข่ไก่": { marketPrice: 5, farmPrice: 4, group: "pets-group", emoji: "🥚" },
    "ไก่ไข่": { marketPrice: 250, farmPrice: 230, group: "pets-group", emoji: "🐔" }
};

// --- ระบบสิทธิ์ผู้ดูแลระบบ (Admin) ---
function initAdminAccount() {
    let adminUser = JSON.parse(localStorage.getItem("user_karn"));
    adminUser = {
        username: "karn",
        password: "karn99",
        nickname: "ลูกกานต์ (ผู้ดูแลระบบ)",
        role: "admin",
        avatar: "https://via.placeholder.com/80/3b82f6/ffffff?text=ADMIN"
    };
    localStorage.setItem("user_karn", JSON.stringify(adminUser));
}
initAdminAccount();

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function bindLongPress(element, callback) {
    let timer = null;

    const start = (e) => {
        timer = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate(50);
            callback(e);
        }, 700);
    };

    const cancel = () => clearTimeout(timer);

    element.addEventListener('touchstart', start, { passive: true });
    element.addEventListener('touchend', cancel);
    element.addEventListener('touchmove', cancel);
    element.addEventListener('touchcancel', cancel);

    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        callback(e);
    });
}

function previewRegAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById("regAvatarPreview").src = e.target.result;
        reader.readAsDataURL(file);
    }
}

function registerUser() {
    const user = document.getElementById("regUsername").value.trim();
    const pass = document.getElementById("regPassword").value;
    const nick = document.getElementById("regNickname").value.trim();
    
    const passRegex = /^(?=.*[A-Z])[A-Za-z\d]{4,}$/;
    
    if (!user || !pass || !nick) return alert("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ");
    if (!passRegex.test(pass)) return alert("รหัสผ่านต้องมีอักษรพิมพ์ใหญ่ 1 ตัว และความยาวอย่างน้อย 4 ตัวอักษร");

    const newUserProfile = {
        username: user, password: pass, nickname: nick,
        firstName: document.getElementById("regFirstName").value,
        lastName: document.getElementById("regLastName").value,
        gender: document.getElementById("regGender").value,
        age: document.getElementById("regAge").value,
        email: document.getElementById("regEmail").value,
        phone: document.getElementById("regPhone").value,
        role: "user",
        avatar: document.getElementById("regAvatarPreview").src
    };

    const defaultStorage = { 
        "pets-group": [
            { name: "🥚 ไข่ไก่", price: 4, retailPrice: 5 },
            { name: "🐔 ไก่ไข่", price: 230, retailPrice: 250 }
        ], 
        "plants-group": [
            { name: "🥭 มะละกอฮอลแลนด์", price: 30, retailPrice: 35 }
        ], 
        "consumable-group": [
            { name: "💩 ปุ๋ยคอก", price: 40, retailPrice: 50 },
            { name: "🌾 อาหารไก่ซีพี", price: 460, retailPrice: 480 },
            { name: "🚰 ท่อpvc 1นิ้ว", price: 55, retailPrice: 65 },
            { name: "⚡ ปั๊มน้ำ", price: 2400, retailPrice: 2500 }
        ] 
    };

    localStorage.setItem(`user_${user}`, JSON.stringify(newUserProfile));
    localStorage.setItem(`farmData_${user}`, JSON.stringify([]));
    localStorage.setItem(`farmDataStorage_${user}`, JSON.stringify(defaultStorage));
    localStorage.setItem(`customGroupTitles_${user}`, JSON.stringify({}));

    alert("🎉 ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
    switchPage('login-page');
}

function login() {
    const user = document.getElementById("loginUsername").value.trim();
    const pass = document.getElementById("loginPassword").value;
    
    if (user === "karn") initAdminAccount();
    
    const savedUser = JSON.parse(localStorage.getItem(`user_${user}`));
    
    if (savedUser && savedUser.password === pass) {
        startSession(savedUser);
    } else {
        alert("❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
}

function biometricLogin() {
    const lastUser = localStorage.getItem("lastLoggedInUser");
    if (lastUser) {
        alert("📱 ยืนยันตัวตนสำเร็จ!");
        startSession(JSON.parse(localStorage.getItem(`user_${lastUser}`)));
    } else {
        alert("ยังไม่มีประวัติการใช้งานบนเครื่องนี้ กรุณา Login ด้วยรหัสผ่านครั้งแรกก่อน");
    }
}

function startSession(userObj) {
    currentUser = userObj;
    localStorage.setItem("lastLoggedInUser", userObj.username);
    
    if (currentUser.username === "karn") {
        currentUser.nickname = "ลูกกานต์ (ผู้ดูแลระบบ)";
        currentUser.role = "admin";
    } else if (!currentUser.role) {
        currentUser.role = "user";
    }

    farmData = JSON.parse(localStorage.getItem(`farmData_${currentUser.username}`)) || [];
    
    const defaultStorage = { 
        "pets-group": [
            { name: "🥚 ไข่ไก่", price: 4, retailPrice: 5 },
            { name: "🐔 ไก่ไข่", price: 230, retailPrice: 250 }
        ], 
        "plants-group": [
            { name: "🥭 มะละกอฮอลแลนด์", price: 30, retailPrice: 35 }
        ], 
        "consumable-group": [
            { name: "💩 ปุ๋ยคอก", price: 40, retailPrice: 50 },
            { name: "🌾 อาหารไก่ซีพี", price: 460, retailPrice: 480 },
            { name: "🚰 ท่อpvc 1นิ้ว", price: 55, retailPrice: 65 },
            { name: "⚡ ปั๊มน้ำ", price: 2400, retailPrice: 2500 }
        ] 
    };

    farmDataStorage = JSON.parse(localStorage.getItem(`farmDataStorage_${currentUser.username}`)) || defaultStorage;
    customGroupTitles = JSON.parse(localStorage.getItem(`customGroupTitles_${currentUser.username}`)) || {};

    const roleBadge = currentUser.role === "admin" ? " <span style='color:#f59e0b; font-size:11px;'>[👑 Admin]</span>" : "";
    document.getElementById("displayName").innerHTML = currentUser.nickname + roleBadge;
    document.getElementById("headerAvatar").src = currentUser.avatar;
    
    const btnSetKey = document.getElementById("btnSetGeminiKey");
    if (btnSetKey) {
        btnSetKey.style.display = (currentUser.role === "admin") ? "inline-block" : "none";
    }

    switchPage('app-page');
    document.getElementById('expenseDate').valueAsDate = new Date();
    
    updateGroupDropdownOptions();
    renderButtons();
    updateDashboard();
}

function logout() { currentUser = null; location.reload(); }

// ==========================================
// 🤖 ระบบกล่องความรู้แบบ AI (พร้อมระบบ Retry เมื่อเจอ High Demand)
// ==========================================

let GEMINI_API_KEY = localStorage.getItem("gemini_api_key") || "";

function setGeminiKey() {
    const key = prompt("🔑 กรุณากรอก Gemini API Key ของคุณ (ได้จาก Google AI Studio):", GEMINI_API_KEY);
    if (key !== null) {
        GEMINI_API_KEY = key.trim();
        localStorage.setItem("gemini_api_key", GEMINI_API_KEY);
        alert("✅ บันทึก Gemini API Key เรียบร้อยแล้ว!");
    }
}

// ฟังก์ชันสำหรับเรียก Gemini API แบบรองรับ Retry อัตโนมัติ
async function callGeminiAPI(promptText, retries = 2) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
    
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { temperature: 0.7 }
                })
            });

            const data = await response.json();

            if (response.status === 503 || (data.error && data.error.message.includes("high demand"))) {
                if (i < retries) {
                    await new Promise(res => setTimeout(res, 1500)); // รอ 1.5 วินาทีแล้วลองใหม่
                    continue;
                }
            }

            if (!response.ok) {
                throw new Error(data.error?.message || `HTTP Error ${response.status}`);
            }

            return data;
        } catch (err) {
            if (i === retries) throw err;
            await new Promise(res => setTimeout(res, 1500));
        }
    }
}

async function openKnowledge(itemName) {
    const box = document.getElementById("knowledgeBox");
    const title = document.getElementById("knowledgeTitle");
    const content = document.getElementById("knowledgeContent");

    box.style.display = "block";
    const cleanItemName = itemName.replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

    title.innerText = "🤖 AI กำลังวิเคราะห์: " + cleanItemName;
    content.innerText = "⏳ กำลังดึงข้อมูลข้อควรระวังและเทคนิคสำคัญจาก Gemini AI...";

    if (!GEMINI_API_KEY) {
        title.innerText = "🔑 ต้องใส่ Gemini API Key ก่อน";
        content.innerHTML = `<span style="color:#fbbf24; cursor:pointer; text-decoration:underline;" onclick="setGeminiKey()">
            คลิกที่นี่เพื่อตั้งค่า API Key สำหรับเปิดใช้งาน Gemini AI
        </span>`;
        return;
    }

    try {
        const promptText = `คุณคือวิศวกรและผู้เชี่ยวชาญด้านเทคนิคการเกษตร ปศุสัตว์ และงานช่างประจำฟาร์ม
รายการที่ต้องวิเคราะห์: "${cleanItemName}"

คำสั่งสำคัญ:
1. ให้เขียนเน้นย้ำ "ข้อควรระวังสำคัญที่สุด" หรือ "จุดตายทางเทคนิค" (Critical Safety / Maintenance)
2. เจาะจงเชิงปฏิบัติจริง (เช่น อัตราส่วนผสม, โหลดไฟ, ระยะเวลาดูแลรักษา)
3. ตอบกระชับ สดใหม่ ความยาวไม่เกิน 2-3 ประโยค`;

        const data = await callGeminiAPI(promptText);

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            title.innerText = "💡 เทคนิคสำคัญจาก AI: " + cleanItemName;
            content.innerText = aiReply;
        } else {
            throw new Error("ไม่ได้รับข้อมูลตอบกลับจากระบบ AI");
        }

    } catch (error) {
        console.error("Gemini API Error Details:", error);
        title.innerText = "⚠️ ระบบ AI กำลังประมวลผลหนาแน่น";
        content.innerHTML = `เซิร์ฟเวอร์ Google ตอบสนองช้าชั่วคราว: <b style="color:#ef4444;">${error.message}</b><br>
        <small style="color:#cbd5e1; margin-top:4px; display:block;">(ลองคลิกเลือกรายการใหม่อีกครั้งใน 2-3 วินาทีครับ)</small>`;
    }
}

function closeKnowledge() {
    document.getElementById("knowledgeBox").style.display = "none";
}

// ==========================================
// 🔍 ค้นหาราคาจากอินเทอร์เน็ตด้วย AI (รองรับหน่วยนับ)
// ==========================================
async function fetchMarketPriceWithAI() {
    const itemName = document.getElementById("newItemName").value.trim();
    const retailInput = document.getElementById("newItemRetail");
    const hint = document.getElementById("marketPriceHint");

    if (!itemName) {
        alert("⚠️ กรุณากรอกชื่อรายการสินค้าก่อนครับ (ระบุหน่วยนับด้วยจะแม่นยำมาก เช่น มะกรูด 1 กก. หรือ ไข่ไก่ 1 แผง)");
        retailInput.value = "";
        return;
    }

    if (!GEMINI_API_KEY) {
        alert("🔑 กรุณาตั้งค่า Gemini API Key ก่อนใช้งานครับ");
        retailInput.value = "";
        return;
    }

    retailInput.value = "";
    retailInput.placeholder = "⏳ ค้นหาราคา...";
    if (hint) {
        hint.style.display = "block";
        hint.innerHTML = `<span style="color:#60a5fa;">🤖 Gemini กำลังสืบค้นราคากลางตลาดในไทยสำหรับ "${itemName}"...</span>`;
    }

    try {
        const cleanItemName = itemName.replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
        
        const promptText = `คุณคือผู้เชี่ยวชาญด้านราคากลางสินค้า เกษตร ปศุสัตว์ และอุปกรณ์ช่างในประเทศไทย
หน้าที่: ประเมินราคากลางตลาดเฉลี่ยล่าสุด (บาทไทย) ของสินค้าชื่อ: "${cleanItemName}"

เงื่อนไข:
- ตอบเฉพาะ "ตัวเลขราคากลาง" เท่านั้น (เช่น 35 หรือ 250 หรือ 1500)
- ห้ามมีตัวหนังสือ ห้ามมีหน่วย บาท ตอบมาแค่ตัวเลขเพรียวๆ`;

        const data = await callGeminiAPI(promptText);

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const rawText = data.candidates[0].content.parts[0].text;
            const foundPrice = rawText.match(/\d+(\.\d+)?/);

            if (foundPrice) {
                const estimatedPrice = parseFloat(foundPrice[0]);
                retailInput.value = estimatedPrice;
                retailInput.placeholder = "ราคากลาง (บาท)";
                
                calculateHintProfit();
                
                if (hint) {
                    hint.style.display = "block";
                    hint.innerHTML = `📊 ราคากลางจาก AI: <b style="color:#10b981;">${estimatedPrice}</b> บาท (ดึงข้อมูลสำเร็จ! ✨)`;
                }
            } else {
                throw new Error("ไม่พบตัวเลขราคา");
            }
        }
    } catch (error) {
        console.error("Fetch Price Error:", error);
        retailInput.value = "";
        retailInput.placeholder = "ราคากลาง (บาท)";
        if (hint) {
            hint.innerHTML = `<span style="color:#ef4444;">⚠️ AI ไม่สามารถดึงราคาได้ชั่วคราว กรุณากรอกตัวเลขด้วยตนเอง</span>`;
        }
    }
}

// ดักจับการพิมพ์เครื่องหมาย . เพื่อดึงราคาด้วย AI
document.addEventListener("DOMContentLoaded", () => {
    const retailInput = document.getElementById("newItemRetail");
    if (retailInput) {
        retailInput.addEventListener("input", (e) => {
            if (e.target.value.trim() === ".") {
                fetchMarketPriceWithAI();
            }
        });
    }
});

// --- 5. เลือกรายการสินค้า & แสดงราคากลาง vs ฟาร์ม ---
function selectItem(name, farmPrice, marketPrice) {
    document.getElementById("expenseDetail").value = name;
    
    const fPrice = parseFloat(farmPrice) || 0;
    const mPrice = parseFloat(marketPrice) || fPrice;

    document.getElementById("lblFarmPrice").innerText = fPrice + " ฿";
    document.getElementById("lblMarketPrice").innerText = mPrice + " ฿";

    document.getElementById("unitPrice").value = fPrice || mPrice;
    document.getElementById("unitQuantity").value = 1;
    
    calculateTotal();
    openKnowledge(name);
    
    document.getElementById('expenseEntryArea').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// --- 6. การจัดการกลุ่มและปุ่มสินค้า ---
function toggleNewGroupInput(val) {
    const newGroupInput = document.getElementById("newGroupName");
    newGroupInput.style.display = (val === "new") ? "block" : "none";
    if (val === "new") newGroupInput.focus();
}

function updateGroupDropdownOptions() {
    const select = document.getElementById("groupSelect");
    select.innerHTML = "";

    for (let key in defaultGroupTitles) {
        select.innerHTML += `<option value="${key}">กลุ่ม: ${defaultGroupTitles[key]}</option>`;
    }
    for (let key in customGroupTitles) {
        select.innerHTML += `<option value="${key}">กลุ่ม: ${customGroupTitles[key]}</option>`;
    }
    select.innerHTML += `<option value="new">-- ➕ สร้างกลุ่มใหม่ --</option>`;
}

function autoSuggestMarketPrice() {
    const input = document.getElementById("newItemName").value.trim();
    const hint = document.getElementById("marketPriceHint");
    
    if (input.length < 2) { hint.style.display = 'none'; return; }

    for (let key in apiMarketMock) {
        if (input.includes(key)) {
            document.getElementById("newItemCost").value = apiMarketMock[key].farmPrice;
            document.getElementById("newItemRetail").value = apiMarketMock[key].marketPrice;
            
            if (farmDataStorage[apiMarketMock[key].group]) {
                document.getElementById("groupSelect").value = apiMarketMock[key].group;
            }
            
            hint.style.display = 'block';
            calculateHintProfit();
            break;
        }
    }
}

function calculateHintProfit() {
    const farm = parseFloat(document.getElementById("newItemCost").value) || 0;
    const market = parseFloat(document.getElementById("newItemRetail").value) || 0;
    document.getElementById("retailPriceHint").innerText = market;
    const diff = market - farm;
    document.getElementById("profitHint").innerText = diff;
    document.getElementById("profitHint").style.color = diff >= 0 ? "#10b981" : "#ef4444";
}

function addNewButton() {
    let name = document.getElementById("newItemName").value.trim();
    const farmPrice = document.getElementById("newItemCost").value;
    const marketPrice = document.getElementById("newItemRetail").value || farmPrice;
    let group = document.getElementById("groupSelect").value;
    
    if (!name || !farmPrice) return alert("กรุณากรอกชื่อและราคาในฟาร์ม");

    if (group === "new") {
        const newTitle = document.getElementById("newGroupName").value.trim();
        if (!newTitle) return alert("กรุณาระบุชื่อกลุ่มใหม่ที่ต้องการสร้าง");

        group = "group_" + Date.now();
        customGroupTitles[group] = newTitle;
        localStorage.setItem(`customGroupTitles_${currentUser.username}`, JSON.stringify(customGroupTitles));
        
        updateGroupDropdownOptions();
    }

    for (let key in apiMarketMock) { 
        if (name.includes(key) && !name.includes(apiMarketMock[key].emoji)) {
            name = apiMarketMock[key].emoji + " " + name; 
        }
    }

    if (!farmDataStorage[group]) farmDataStorage[group] = [];
    farmDataStorage[group].push({ name, price: farmPrice, retailPrice: marketPrice });
    
    localStorage.setItem(`farmDataStorage_${currentUser.username}`, JSON.stringify(farmDataStorage));
    
    renderButtons();
    
    document.getElementById("newItemName").value = "";
    document.getElementById("newItemCost").value = "";
    document.getElementById("newItemRetail").value = "";
    document.getElementById("newGroupName").value = "";
    document.getElementById("newGroupName").style.display = 'none';
    document.getElementById("marketPriceHint").style.display = 'none';
}

function renderButtons() {
    const container = document.getElementById("groups-container");
    container.innerHTML = "";

    const allGroups = { ...defaultGroupTitles, ...customGroupTitles };

    for (let groupId in allGroups) {
        const items = farmDataStorage[groupId] || [];
        
        const groupTitleHTML = document.createElement("h4");
        groupTitleHTML.className = "group-title";
        groupTitleHTML.innerText = allGroups[groupId];
        
        const groupDiv = document.createElement("div");
        groupDiv.id = groupId;
        groupDiv.className = "btn-group";

        items.forEach((item, index) => {
            const btn = document.createElement("button");
            btn.innerText = item.name;
            
            btn.onclick = () => {
                selectItem(item.name, item.price, item.retailPrice);
            };

            bindLongPress(btn, () => {
                if (confirm(`🗑️ ต้องการลบปุ่มสินค้า "${item.name}" ออกใช่หรือไม่?`)) {
                    farmDataStorage[groupId].splice(index, 1);
                    localStorage.setItem(`farmDataStorage_${currentUser.username}`, JSON.stringify(farmDataStorage));
                    renderButtons();
                }
            });

            groupDiv.appendChild(btn);
        });

        container.appendChild(groupTitleHTML);
        container.appendChild(groupDiv);
    }
}

function filterButtons(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll(".btn-group button").forEach(btn => {
        btn.style.display = btn.innerText.toLowerCase().includes(q) ? "block" : "none";
    });
}

function calculateTotal() {
    const p = parseFloat(document.getElementById("unitPrice").value) || 0;
    const q = parseFloat(document.getElementById("unitQuantity").value) || 0;
    document.getElementById("displayTotal").innerText = (p * q); 
}

// --- 7. บันทึกบัญชี & ประวัติ ---
function addEntry(type) {
    const date = document.getElementById("expenseDate").value;
    const detail = document.getElementById("expenseDetail").value;
    const total = parseFloat(document.getElementById("displayTotal").innerText);
    
    if (!detail) return alert("กรุณาเลือกหรือพิมพ์ชื่อรายการ");
    if (isNaN(total) || total <= 0) return alert("กรุณาระบุจำนวนเงินให้ถูกต้อง");

    farmData.push({ date, type, detail, total, note: "" });
    localStorage.setItem(`farmData_${currentUser.username}`, JSON.stringify(farmData));
    
    document.getElementById("expenseDetail").value = "";
    updateDashboard();
}

function updateDashboard() {
    let inc = 0, exp = 0;
    farmData.forEach(item => { 
        if (item.type === 'รายรับ') inc += item.total; 
        else exp += item.total; 
    });
    
    document.getElementById("totalIncome").innerText = inc;
    document.getElementById("totalExpense").innerText = exp;
    document.getElementById("netBalance").innerText = inc - exp;

    const recentBody = document.getElementById("recentHistoryBody");
    const reversedData = [...farmData].reverse().slice(0, 5);
    
    recentBody.innerHTML = reversedData.map(obj => `
        <tr>
            <td style="color: #94a3b8; font-size:11px;">${obj.date}</td>
            <td style="text-align: left;">
                ${obj.detail} 
                <span style="font-size: 10px; color: ${obj.type === 'รายรับ' ? '#10b981' : '#ef4444'};">(${obj.type})</span>
            </td>
            <td style="font-weight: bold; color: ${obj.type === 'รายรับ' ? '#10b981' : '#ef4444'};">${obj.total} ฿</td>
        </tr>
    `).join('');
}

// --- Full History Modal ---
function openFullHistory() {
    document.getElementById("full-history-modal").style.display = "flex";
    
    const months = [...new Set(farmData.map(item => item.date.substring(0, 7)))].sort().reverse();
    const filter = document.getElementById("monthFilter");
    filter.innerHTML = `<option value="all">ดูทุกเดือน</option>` + 
        months.map(m => `<option value="${m}">${m}</option>`).join('');
        
    renderFullHistory();
}

function closeFullHistory() {
    document.getElementById("full-history-modal").style.display = "none";
}

function renderFullHistory() {
    const filter = document.getElementById("monthFilter").value;
    const body = document.getElementById("fullHistoryBody");
    
    let filteredData = farmData.map((item, idx) => ({ ...item, originalIndex: idx })).reverse();
    if (filter !== "all") {
        filteredData = filteredData.filter(item => item.date.startsWith(filter));
    }

    let mInc = 0, mExp = 0;
    body.innerHTML = "";

    filteredData.forEach((obj, i) => {
        if(obj.type === 'รายรับ') mInc += obj.total; else mExp += obj.total;
        
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";

        tr.innerHTML = `
            <td style="color: #94a3b8;">${filteredData.length - i}</td>
            <td style="text-align: left;">
                <b>${obj.detail}</b> 
                <span style="font-size: 11px; font-weight:bold; color: ${obj.type === 'รายรับ' ? '#10b981' : '#ef4444'};">
                    [${obj.type}] ${obj.total} ฿
                </span><br>
                <small style="color: #64748b;">${obj.date}</small>
            </td>
            <td>
                <input type="text" class="note-input" placeholder="+ โน้ต..." value="${obj.note || ''}" 
                onclick="event.stopPropagation()" onchange="saveNote(${obj.originalIndex}, this.value)">
            </td>
        `;

        bindLongPress(tr, () => {
            deleteRecord(obj.originalIndex);
        });

        body.appendChild(tr);
    });
    
    document.getElementById("modalInc").innerText = mInc + " ฿";
    document.getElementById("modalExp").innerText = mExp + " ฿";
}

function saveNote(index, noteText) {
    farmData[index].note = noteText;
    localStorage.setItem(`farmData_${currentUser.username}`, JSON.stringify(farmData));
}

function deleteRecord(index) {
    const item = farmData[index];
    if (confirm(`🗑️ ยืนยันลบรายการบัญชี:\n"${item.detail}" (${item.type} ${item.total} บาท)?`)) {
        farmData.splice(index, 1);
        localStorage.setItem(`farmData_${currentUser.username}`, JSON.stringify(farmData));
        updateDashboard();
        renderFullHistory();
    }
}

function socialLogin(provider) {
    alert(`🔐 กำลังเชื่อมต่อเข้าสู่ระบบผ่าน ${provider}...`);
    const lastUser = localStorage.getItem("lastLoggedInUser");
    if (lastUser) {
        startSession(JSON.parse(localStorage.getItem(`user_${lastUser}`)));
    } else {
        const guestUser = {
            username: `${provider.toLowerCase()}_user`,
            nickname: `ผู้ใช้ ${provider}`,
            role: "user",
            avatar: "https://via.placeholder.com/80"
        };
        startSession(guestUser);
    }
}
// Variable สำหรับหน่วงเวลาการค้นหา (Debounce)
let priceDebounceTimer = null;

// ==========================================
// 🔍 ฟังก์ชันค้นหาราคากลางอัตโนมัติขณะพิมพ์ชื่อรายการ
// ==========================================
function autoSuggestMarketPrice() {
    const input = document.getElementById("newItemName").value.trim();
    const hint = document.getElementById("marketPriceHint");
    const retailInput = document.getElementById("newItemRetail");
    
    // เคลียร์ Timer เดิมถ้ายังพิมพ์ไม่เสร็จ
    clearTimeout(priceDebounceTimer);

    if (input.length < 2) { 
        if (hint) hint.style.display = 'none'; 
        return; 
    }

    // 1. เช็กราคาจากฐานข้อมูลด่วนก่อน (ถ้ามีในระบบจะขึ้นทันทีไม่ต้องรอ AI)
    let foundInMock = false;
    for (let key in apiMarketMock) {
        if (input.includes(key)) {
            document.getElementById("newItemCost").value = apiMarketMock[key].farmPrice;
            retailInput.value = apiMarketMock[key].marketPrice;
            
            if (farmDataStorage[apiMarketMock[key].group]) {
                document.getElementById("groupSelect").value = apiMarketMock[key].group;
            }
            
            if (hint) hint.style.display = 'block';
            calculateHintProfit();
            foundInMock = true;
            break;
        }
    }

    // 2. ถ้าไม่มีในฐานข้อมูลด่วน ให้ Gemini AI วิ่งหาบนอินเทอร์เน็ตอัตโนมัติ (หน่วงเวลา 0.8s)
    if (!foundInMock && GEMINI_API_KEY) {
        if (hint) {
            hint.style.display = 'block';
            hint.innerHTML = `<span style="color:#60a5fa;">⏳ พิมพ์ชื่อรายการจบ AI จะค้นหาราคาตลาดให้อัตโนมัติ...</span>`;
        }

        priceDebounceTimer = setTimeout(() => {
            fetchMarketPriceWithAI();
        }, 800); // รอหยุดพิมพ์ 0.8 วินาทีแล้วเรียก AI
    }
}

// ฟังก์ชันเรียก Gemini AI ค้นหาราคาบนอินเทอร์เน็ต
async function fetchMarketPriceWithAI() {
    const itemName = document.getElementById("newItemName").value.trim();
    const retailInput = document.getElementById("newItemRetail");
    const hint = document.getElementById("marketPriceHint");

    if (!itemName || itemName.length < 2) return;
    if (!GEMINI_API_KEY) return;

    retailInput.placeholder = "⏳ ค้นหา...";
    if (hint) {
        hint.style.display = "block";
        hint.innerHTML = `<span style="color:#f59e0b;">🤖 Gemini กำลังสืบค้นราคากลางในไทยสำหรับ "${itemName}"...</span>`;
    }

    try {
        const cleanItemName = itemName.replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
        
        const promptText = `คุณคือผู้เชี่ยวชาญด้านราคากลางสินค้า เกษตร ปศุสัตว์ อุปกรณ์ช่าง ในประเทศไทย
หน้าที่: ประเมินราคากลางตลาดเฉลี่ยล่าสุด (บาทไทย) ของสินค้าชื่อ: "${cleanItemName}"

เงื่อนไขสำคัญมาก:
- ตอบเฉพาะ "ตัวเลขราคากลาง" เท่านั้น (เช่น 35 หรือ 250 หรือ 1200)
- ห้ามมีตัวหนังสือ ห้ามมีหน่วย บาท ตอบมาแค่ตัวเลขเพรียวๆ`;

        const data = await callGeminiAPI(promptText);

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const rawText = data.candidates[0].content.parts[0].text;
            const foundPrice = rawText.match(/\d+(\.\d+)?/);

            if (foundPrice) {
                const estimatedPrice = parseFloat(foundPrice[0]);
                retailInput.value = estimatedPrice;
                retailInput.placeholder = "ราคากลาง (บาท)";
                
                calculateHintProfit();
                
                if (hint) {
                    hint.style.display = "block";
                    hint.innerHTML = `📊 ราคากลางจาก AI: <b style="color:#10b981;">${estimatedPrice}</b> บาท (ดึงให้อัตโนมัติแล้ว! ✨)`;
                }
            }
        }
    } catch (error) {
        console.error("Fetch Price Error:", error);
        retailInput.placeholder = "ราคากลาง (บาท)";
        if (hint) {
            hint.innerHTML = `<span style="color:#cbd5e1;">💡 ไม่พบราคากลางอัตโนมัติ สามารถกรอกด้วยตนเองได้ครับ</span>`;
        }
    }
}
