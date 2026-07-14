async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export async function uploadFile(file: File): Promise<string | null> {
  const compressedFile = await compressImage(file);
  
  const formData = new FormData();
  formData.append("file", compressedFile);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.url;
    } else {
      const errorText = await res.text();
      console.error("Upload API Error:", res.status, errorText);
      alert(`อัปโหลดล้มเหลว (Error ${res.status}): ระบบบน Vercel ยังไม่พร้อม กรุณาตรวจสอบการตั้งค่า Vercel Blob อีกครั้ง`);
    }
  } catch (e) {
    console.error("Upload Exception:", e);
    alert("เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่อีกครั้ง");
  }
  return null;
}
