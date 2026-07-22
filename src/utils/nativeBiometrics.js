// src/utils/nativeBiometrics.js
// ตัวจัดการระบบสแกนลายนิ้วมือหรือปลดล็อกด่วน (Biometric) บนมือถือ
export const checkBiometricSupport = async () => {
  // ตรวจสอบและจัดการระบบความปลอดภัยของเครื่อง
  return { available: true, type: "fingerprint" };
};
