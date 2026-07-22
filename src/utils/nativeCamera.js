// src/utils/nativeCamera.js
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const takeFarmPhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt // ให้เลือกระหว่างถ่ายภาพหรือเลือกจากอัลบั้ม
    });
    return image.webPath; // ส่งคืนลิงก์รูปภาพสำหรับแสดงผลในแอป
  } catch (error) {
    console.error("Camera error:", error);
    return null;
  }
};
