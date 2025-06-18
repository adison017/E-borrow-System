export const getPicUrl = (pic) => {
  if (!pic) return 'https://cdn-icons-png.flaticon.com/512/3474/3474360.png';
  // ถ้าเป็น URL เต็มหรือ /uploads แล้ว ให้คืนเลย
  if (pic.startsWith('http')) return pic;
  if (pic.startsWith('/uploads')) return `http://localhost:5000${pic}`;
  // ถ้าเป็นชื่อไฟล์ ให้เติม URL เต็ม
  return `http://localhost:5000/uploads/${pic}`;
};