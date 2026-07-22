// ==========================================
// ละม้ายฟาร์ม (Ultimate Edition: Firebase + Gemini AI + PWA)
// ==========================================

let currentUser = null;
let farmData = []; // สำหรับเก็บข้อมูลรายรับ/รายจ่าย (ประวัติบัญชี)
let farmDataStorage = {}; // สำหรับเก็บข้อมูลปุ่มสินค้า (แบ่งตามกลุ่ม)
let customGroupTitles = {}; // สำหรับเก็บชื่อกลุ่มที่ผู้ใช้สร้างใหม่
let priceDebounceTimer = null;

// ชื่อกลุ่มเริ่มต้น
const defaultGroupTitles = {
    "pets-group": "สัตว์เลี้ยง",
    "plants-group": "พืชสวน",
    "consumable-group": "วัสดุสิ้นเปลือง"
};

// ข้อมูลจำลองสำหรับค้นหาราคา (ส่วนนี้คุณสามารถลบ "มะละกอฮอลแลนด์" ออกได้ถ้าต้องการ)
const apiMarketMock = {
    "มะละกอฮอลแลนด์": { marketPrice: 35, farmPrice: 30, group: "plants-group", emoji: "🥭" },
    "ปุ๋ยคอก": { marketPrice: 50, farmPrice: 40, group: "consumable-group", emoji: "💩" },
    "อาหารไก่ซีพี": { marketPrice: 480, farmPrice: 460, group: "consumable-group", emoji: "🌾" },
    "ท่อpvc 1นิ้ว": { marketPrice: 65, farmPrice: 55, group: "consumable-group", emoji: "🚰" },
    "ปั๊มน้ำ": { marketPrice: 2500, farmPrice: 2400, group: "consumable-group", emoji: "⚡" },
    "ไข่ไก่": { marketPrice: 5, farmPrice: 4, group: "pets-group", emoji: "🥚" },
    "ไก่ไข่": { marketPrice: 250, farmPrice: 230, group: "pets-group", emoji: "🐔" }
};

// ==========================================
// --- 1. ระบบ Admin & UI ---
// ==========================================

function initAdminAccount() {
    let adminUser = {
        username: "karn", password: "karn99", nickname: "ลูกกานต์ (ผู้ดูแลระบบ)",
        role: "admin", avatar: "https://via.placeholder.com/80/3b82f6/ffffff?text=ADMIN"
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
    element.addEventListener('contextmenu', (e) => { e.preventDefault(); callback(e); });
}

function previewRegAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById("regAvatarPreview").src = e.target.result;
        reader.readAsDataURL(file);
    }
}

// ==========================================
// --- 2. ระบบ Authentication ---
// ==========================================

function registerUser() {
    const user = document.getElementById("regUsername").value.trim();
    const pass = document.getElementById("regPassword").value;
    const nick = document.getElementById("regNickname").value.trim();
    const passRegex = /^(?=.*[A-Z])[A-Za-z\d]{4,}$/;

    if (!user || !pass || !nick) return alert("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ");
    if (!passRegex.test(pass)) return alert("รหัสผ่านต้องมีอักษรพิมพ์ใหญ่ 1 ตัว และยาวอย่างน้อย 4 ตัวอักษร");

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

    // เก็บลง LocalStorage และ Firebase (ถ้า Firebase พร้อม)
    localStorage.setItem(`user_${user}`, JSON.stringify(newUserProfile));
    if (window.database) {
        window.database.ref(`users/${user}/profile`).set(newUserProfile);
    }

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
        alert("📱 ยืนยันตัวตนด้วย Biometric สำเร็จ!");
        startSession(JSON.parse(localStorage.getItem(`user_${lastUser}`)));
    } else {
        alert("ยังไม่มีประวัติการใช้งานบนเครื่องนี้ กรุณา Login ด้วยรหัสผ่านครั้งแรกก่อน");
    }
}

function socialLogin(provider) {
    alert(`🔐 กำลังเชื่อมต่อเข้าสู่ระบบผ่าน ${provider}...`);
    const guestUser = {
        username: `${provider.toLowerCase()}_user`,
        nickname: `ผู้ใช้ ${provider}`,
        role: "user",
        avatar: "https://via.placeholder.com/80"
    };
    startSession(guestUser);
}

// ==========================================
// --- 3. เริ่มต้นเซสชั่น & ดึงข้อมูลจาก Firebase ---
// ==========================================

function startSession(userObj) {
    currentUser = userObj;
    localStorage.setItem("lastLoggedInUser", userObj.username);

    if (currentUser.username === "karn") {
        currentUser.nickname = "ลูกกานต์ (ผู้ดูแลระบบ)";
        currentUser.role = "admin";
    }

    const roleBadge = currentUser.role === "admin" ? " <span style='color:#f59e0b; font-size:11px;'>[👑 Admin]</span>" : "";
    document.getElementById("displayName").innerHTML = currentUser.nickname + roleBadge;
    document.getElementById("headerAvatar").src = currentUser.avatar || "https://via.placeholder.com/45";

    const btnSetKey = document.getElementById("btnSetGeminiKey");
    if (btnSetKey) btnSetKey.style.display = (currentUser.role === "admin") ? "inline-block" : "none";

    switchPage('app-page');
    document.getElementById('expenseDate').valueAsDate = new Date();

    if (!window.database) {
        console.error("Firebase database ไม่พร้อมใช้งาน");
        return;
    }

    const userRef = window.database.ref(`users/${currentUser.username}`);

    // ดึงประวัติบัญชี
    userRef.child('farmData').on('value', (snapshot) => {
        const data = snapshot.val();
        farmData = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
        updateDashboard();
    });

    // ดึงรายการปุ่มสินค้า
    userRef.child('farmDataStorage').on('value', (snapshot) => {
        const data = snapshot.val();
        const defaultStorage = {
            "pets-group": [{ name: "🥚 ไข่ไก่", price: 4, retailPrice: 5 }, { name: "🐔 ไก่ไข่", price: 230, retailPrice: 250 }],
            "plants-group": [{ name: "🥭 มะละกอฮอลแลนด์", price: 30, retailPrice: 35 }],
            "consumable-group": [{ name: "💩 ปุ๋ยคอก", price: 40, retailPrice: 50 }, { name: "🌾 อาหารไก่ซีพี", price: 460, retailPrice: 480 }]
        };
        farmDataStorage = data || defaultStorage;
        renderButtons();
    });

    // ดึงชื่อกลุ่มที่กำหนดเอง
    userRef.child('customGroupTitles').on('value', (snapshot) => {
        customGroupTitles = snapshot.val() || {};
        updateGroupDropdownOptions();
        renderButtons();
    });
}

function logout() { 
    currentUser = null; 
    location.reload(); 
}

// ==========================================
// --- 4. ระบบ AI Gemini ---
// ==========================================

let GEMINI_API_KEY = localStorage.getItem("gemini_api_key") || "";

function setGeminiKey() {
    const key = prompt("🔑 กรุณากรอก Gemini API Key ของคุณ:", GEMINI_API_KEY);
    if (key !== null) {
        GEMINI_API_KEY = key.trim();
        localStorage.setItem("gemini_api_key", GEMINI_API_KEY);
        alert("✅ บันทึก Gemini API Key เรียบร้อยแล้ว!");
    }
}

async function callGeminiAPI(promptText, retries = 2) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
            });
            const data = await response.json();
            if (response.status === 503 && i < retries) {
                await new Promise(res => setTimeout(res, 1500));
                continue;
            }
            if (!response.ok) throw new Error(data.error?.message || `Error ${response.status}`);
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
    content.innerText = "⏳ กำลังดึงข้อมูลเทคนิคสำคัญจาก Gemini AI...";

    if (!GEMINI_API_KEY) {
        title.innerText = "🔑 ต้องใส่ Gemini API Key ก่อน";
        content.innerHTML = `<span style="color:#fbbf24; cursor:pointer; text-decoration:underline;" onclick="setGeminiKey()">คลิกที่นี่เพื่อตั้งค่า API Key</span>`;
        return;
    }

    try {
        const promptText = `คุณคือวิศวกรและผู้เชี่ยวชาญเทคนิคการเกษตร ปศุสัตว์ ประจำฟาร์ม\nรายการที่ต้องวิเคราะห์: "${cleanItemName}"\nเขียนเน้นย้ำจุดควรระวังสำคัญที่สุด เจาะจงเชิงปฏิบัติ ความยาวไม่เกิน 2-3 ประโยค`;
        const data = await callGeminiAPI(promptText);
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            title.innerText = "💡 เทคนิคสำคัญจาก AI: " + cleanItemName;
            content.innerText = data.candidates[0].content.parts[0].text;
        }
    } catch (error) {
        title.innerText = "⚠️ ระบบ AI ไม่สามารถดึงข้อมูลได้";
        content.innerText = error.message;
    }
}

function closeKnowledge() { 
    document.getElementById("knowledgeBox").style.display = "none"; 
}

function autoSuggestMarketPrice() {
    const input = document.getElementById("newItemName").value.trim();
    const hint = document.getElementById("marketPriceHint");
    const retailInput = document.getElementById("newItemRetail");

    clearTimeout(priceDebounceTimer);
    if (input.length < 2) { 
        if (hint) hint.style.display = 'none'; 
        return; 
    }

    let foundInMock = false;
    for (let key in apiMarketMock) {
        if (input.includes(key)) {
            document.getElementById("newItemCost").value = apiMarketMock[key].farmPrice;
            retailInput.value = apiMarketMock[key].marketPrice;
            if (hint) hint.style.display = 'block';
            calculateHintProfit();
            foundInMock = true;
            break;
        }
    }

    if (!foundInMock && GEMINI_API_KEY) {
        if (hint) {
            hint.style.display = 'block';
            hint.innerHTML = `<span style="color:#60a5fa;">⏳ พิมพ์ชื่อรายการจบ AI จะค้นหาราคาตลาดให้อัตโนมัติ...</span>`;
        }
        priceDebounceTimer = setTimeout(() => { fetchMarketPriceWithAI(); }, 800);
    }
}

async function fetchMarketPriceWithAI() {
    const itemName = document.getElementById("newItemName").value.trim();
    const retailInput = document.getElementById("newItemRetail");
    const hint = document.getElementById("marketPriceHint");

    if (!itemName || itemName.length < 2 || !GEMINI_API_KEY) return;

    try {
        const promptText = `ประเมินราคากลางตลาดเฉลี่ยล่าสุด (บาทไทย) ของสินค้าชื่อ: "${itemName}" ตอบเฉพาะตัวเลขเพรียวๆ เช่น 35`;
        const data = await callGeminiAPI(promptText);
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const foundPrice = data.candidates[0].content.parts[0].text.match(/\d+(\.\d+)?/);
            if (foundPrice) {
                const estimatedPrice = parseFloat(foundPrice[0]);
                retailInput.value = estimatedPrice;
                calculateHintProfit();
                if (hint) {
                    hint.style.display = "block";
                    hint.innerHTML = `📊 ราคากลางจาก AI: <b style="color:#10b981;">${estimatedPrice}</b> บาท ✨`;
                }
            }
        }
    } catch (e) {
        if (hint) hint.innerHTML = `<span style="color:#cbd5e1;">💡 สามารถกรอกราคากลางด้วยตนเองได้</span>`;
    }
}

// ==========================================
// --- 5. ฟังก์ชันจัดการปุ่มสินค้าและบัญชี ---
// ==========================================

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

function toggleNewGroupInput(val) {
    const newGroupInput = document.getElementById("newGroupName");
    newGroupInput.style.display = (val === "new") ? "block" : "none";
    if (val === "new") newGroupInput.focus();
}

function updateGroupDropdownOptions() {
    const select = document.getElementById("groupSelect");
    select.innerHTML = "";
    for (let key in defaultGroupTitles) select.innerHTML += `<option value="${key}">กลุ่ม: ${defaultGroupTitles[key]}</option>`;
    for (let key in customGroupTitles) select.innerHTML += `<option value="${key}">กลุ่ม: ${customGroupTitles[key]}</option>`;
    select.innerHTML += `<option value="new">-- ➕ สร้างกลุ่มใหม่ --</option>`;
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
        if (!newTitle) return alert("กรุณาระบุชื่อกลุ่มใหม่");
        group = "group_" + Date.now();
        customGroupTitles[group] = newTitle;
        window.database.ref(`users/${currentUser.username}/customGroupTitles`).set(customGroupTitles);
    }

    if (!farmDataStorage[group]) farmDataStorage[group] = [];
    farmDataStorage[group].push({ name, price: farmPrice, retailPrice: marketPrice });
    window.database.ref(`users/${currentUser.username}/farmDataStorage`).set(farmDataStorage);

    document.getElementById("newItemName").value = "";
    document.getElementById("newItemCost").value = "";
    document.getElementById("newItemRetail").value = "";
    document.getElementById("newGroupName").style.display = 'none';
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
            btn.onclick = () => selectItem(item.name, item.price, item.retailPrice);
            
            // ใช้ Long Press เพื่อลบปุ่ม
            bindLongPress(btn, () => {
                if (confirm(`🗑️ ต้องการลบปุ่มสินค้า "${item.name}" ออกใช่หรือไม่?`)) {
                    farmDataStorage[groupId].splice(index, 1);
                    window.database.ref(`users/${currentUser.username}/farmDataStorage`).set(farmDataStorage);
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

// ==========================================
// --- 6. บันทึกประวัติและแสดงตารางบัญชี ---
// ==========================================

function addEntry(type) {
    const date = document.getElementById("expenseDate").value;
    const detail = document.getElementById("expenseDetail").value;
    const total = parseFloat(document.getElementById("displayTotal").innerText);

    if (!detail) return alert("กรุณาเลือกหรือพิมพ์ชื่อรายการ");
    if (isNaN(total) || total <= 0) return alert("กรุณาระบุจำนวนเงินให้ถูกต้อง");

    const newRecord = { 
        date: date, 
        type: type, 
        detail: detail, 
        total: total, 
        note: "", 
        timestamp: Date.now() 
    };
    
    // บันทึกลง Cloud (Push)
    window.database.ref(`users/${currentUser.username}/farmData`).push(newRecord)
        .then(() => { 
            document.getElementById("expenseDetail").value = ""; 
        })
        .catch(err => alert("เกิดข้อผิดพลาดในการบันทึก: " + err.message));
}

function deleteEntry(entryId) {
    if (confirm("🗑️ ต้องการลบรายการบันทึกนี้ใช่หรือไม่?")) {
        window.database.ref(`users/${currentUser.username}/farmData/${entryId}`).remove()
            .then(() => {
                alert("✅ ลบรายการเรียบร้อยแล้ว");
                // อัปเดตตารางประวัติถ้า modal เปิดอยู่
                if (document.getElementById("full-history-modal").style.display === "flex") {
                    renderFullHistory();
                }
            })
            .catch(err => alert("เกิดข้อผิดพลาดในการลบ: " + err.message));
    }
}

function updateDashboard() {
    let inc = 0, exp = 0;
    farmData.forEach(item => { 
        if (item.type === 'รายรับ') inc += item.total; 
        else exp += item.total; 
    });

    document.getElementById("totalIncome").innerText = inc.toLocaleString();
    document.getElementById("totalExpense").innerText = exp.toLocaleString();
    document.getElementById("netBalance").innerT
