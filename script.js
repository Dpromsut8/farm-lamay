// ==========================================
// ระบบเชื่อมต่อ Firebase Realtime Database - ละม้ายฟาร์ม
// ==========================================

// อ้างอิงตำแหน่งคลังข้อมูลรายการ
const dbRef = database.ref('transactions');

// ตัวแปรเก็บรายการทั้งหมดในหน่วยความจำ
let allTransactions = [];

// 1. ดึงข้อมูลจาก Cloud Firebase แบบ Realtime (เมื่อมีคนบันทึก/ลบ ข้อมูลจะอัปเดตทันทีทุกเครื่อง)
dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    allTransactions = [];

    if (data) {
        // แปลงโครงสร้างข้อมูลจาก Firebase เข้า Array
        Object.keys(data).forEach((key) => {
            allTransactions.push({
                id: key,
                ...data[key]
            });
        });
        // เรียงลำดับรายการล่าสุดขึ้นก่อน
        allTransactions.sort((a, b) => b.timestamp - a.timestamp);
    }

    // อัปเดตการแสดงผลบนหน้าจอแอป
    renderUI();
});

// 2. ฟังก์ชันเพิ่มรายการ (รายรับ / รายจ่าย)
function addEntry(type) {
    const titleInput = document.getElementById('entryTitle') || document.getElementById('itemTitle');
    const amountInput = document.getElementById('entryAmount') || document.getElementById('itemAmount');

    const title = titleInput ? titleInput.value.trim() : '';
    const amount = amountInput ? parseFloat(amountInput.value) : 0;

    if (!title) {
        alert('กรุณากรอกชื่อรายการ/สินค้า');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    // บันทึกลง Cloud Database
    dbRef.push({
        type: type, // 'รายรับ' หรือ 'รายจ่าย'
        title: title,
        amount: amount,
        date: dateStr,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        // เคลียร์ช่องกรอกข้อมูลเมื่อบันทึกสำเร็จ
        if (titleInput) titleInput.value = '';
        if (amountInput) amountInput.value = '';
    }).catch((error) => {
        alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
    });
}

// 3. ฟังก์ชันลบรายการ
function deleteEntry(key) {
    if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
        database.ref('transactions/' + key).remove()
            .catch((error) => {
                alert('ไม่สามารถลบรายการได้: ' + error.message);
            });
    }
}

// 4. ฟังก์ชันคำนวณและแสดงผลตาราง
function renderUI() {
    const recentBody = document.getElementById('recentHistoryBody');
    const fullBody = document.getElementById('fullHistoryBody');
    
    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach(item => {
        if (item.type === 'รายรับ') {
            totalIncome += item.amount;
        } else if (item.type === 'รายจ่าย') {
            totalExpense += item.amount;
        }
    });

    // อัปเดตตัวเลขรวม (ถ้ามี Element แสดงผล)
    const incomeEl = document.getElementById('totalIncome');
    const expenseEl = document.getElementById('totalExpense');
    const balanceEl = document.getElementById('totalBalance');

    if (incomeEl) incomeEl.innerText = `฿${totalIncome.toLocaleString()}`;
    if (expenseEl) expenseEl.innerText = `฿${totalExpense.toLocaleString()}`;
    if (balanceEl) balanceEl.innerText = `฿${(totalIncome - totalExpense).toLocaleString()}`;

    // แสดงผล 5 รายการล่าสุด
    if (recentBody) {
        recentBody.innerHTML = '';
        const recentItems = allTransactions.slice(0, 5);
        if (recentItems.length === 0) {
            recentBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888;">ยังไม่มีรายการบันทึก</td></tr>`;
        } else {
            recentItems.forEach(item => {
                const isIncome = item.type === 'รายรับ';
                const color = isIncome ? '#10b981' : '#ef4444';
                const sign = isIncome ? '+' : '-';
                
                recentBody.innerHTML += `
                    <tr>
                        <td>${item.date || '-'}</td>
                        <td>${item.title}</td>
                        <td style="color:${color}; font-weight:bold;">${sign}${item.amount.toLocaleString()}</td>
                        <td><button onclick="deleteEntry('${item.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;">🗑️</button></td>
                    </tr>
                `;
            });
        }
    }

    // แสดงผลประวัติทั้งหมด
    if (fullBody) {
        fullBody.innerHTML = '';
        if (allTransactions.length === 0) {
            fullBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888;">ยังไม่มีรายการบันทึก</td></tr>`;
        } else {
            allTransactions.forEach(item => {
                const isIncome = item.type === 'รายรับ';
                const color = isIncome ? '#10b981' : '#ef4444';
                const sign = isIncome ? '+' : '-';

                fullBody.innerHTML += `
                    <tr>
                        <td>${item.date || '-'}</td>
                        <td>${item.title}</td>
                        <td style="color:${color}; font-weight:bold;">${sign}${item.amount.toLocaleString()}</td>
                        <td><button onclick="deleteEntry('${item.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;">🗑️</button></td>
                    </tr>
                `;
            });
        }
    }
}

// 5. ฟังก์ชันเปิด/ปิด หน้าประวัติเต็ม (Modal)
function openFullHistory() {
    const modal = document.getElementById('full-history-modal') || document.getElementById('fullHistoryModal');
    if (modal) modal.style.display = 'flex';
}

function closeFullHistory() {
    const modal = document.getElementById('full-history-modal') || document.getElementById('fullHistoryModal');
    if (modal) modal.style.display = 'none';
}
