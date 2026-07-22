// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ค่า Config สำหรับเชื่อมต่อ Firebase ของละม้ายฟาร์ม
// (แนะนำให้ใช้ Environment Variables สำหรับโปรดักชันจริงเพื่อความปลอดภัย)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "lamai-farm.firebaseapp.com",
  projectId: "lamai-farm",
  storageBucket: "lamai-farm.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// เริ่มต้นระบบ Firebase
const app = initializeApp(firebaseConfig);

// ส่งออกระบบ Auth และ Firestore เพื่อนำไปใช้ในหน้าอื่นๆ
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
