const API_BASE = "http://localhost:5000/api";
const UPLOAD_BASE = "http://localhost:5000";

// Equipment
export const getEquipment = () => fetch(`${API_BASE}/equipment`).then(res => res.json());

// Upload image and return filename only
export const uploadImage = async (file, id) => {
  const formData = new FormData();
  formData.append("image", file);
  if (id) formData.append("id", id); // ส่ง id ไปด้วย
  const res = await fetch("http://localhost:5000/api/equipment/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.url; // ต้องเป็น .url
};

export const addEquipment = (data) => {
  // ส่งทั้ง id และ item_id เพื่อความเข้ากันได้
  // ถ้า data.id มีอยู่แล้ว ไม่ต้อง overwrite item_id
  const payload = { ...data };
  if (!payload.item_id && payload.id) payload.item_id = payload.id;
  // แปลง quantity, price เป็น number ถ้าเป็น string
  if (typeof payload.quantity === 'string') payload.quantity = Number(payload.quantity);
  if (typeof payload.price === 'string') payload.price = Number(payload.price);
  // ถ้า price เป็นค่าว่าง/null ให้ลบออก
  if (payload.price === '' || payload.price === null || isNaN(payload.price)) delete payload.price;
  // ถ้า purchaseDate เป็นค่าว่าง/null ให้ลบออก
  if (!payload.purchaseDate) delete payload.purchaseDate;
  // ถ้า location เป็นค่าว่าง/null ให้ลบออก
  if (!payload.location) delete payload.location;
  return fetch(`${API_BASE}/equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
};

export const updateEquipment = (item_id, data) => {
  // ส่งทั้ง id และ item_id เพื่อความเข้ากันได้
  const payload = { ...data, item_id: item_id, id: item_id };
  return fetch(`${API_BASE}/equipment/${item_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
};

export const deleteEquipment = (item_id) => fetch(`${API_BASE}/equipment/${item_id}`, { method: "DELETE" }).then(res => res.json());

// Category
export const getCategories = () => fetch(`${API_BASE}/category`).then(res => res.json());
export const addCategory = (data) => fetch(`${API_BASE}/category`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json());
export const updateCategory = (id, data) => fetch(`${API_BASE}/category/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteCategory = (id) => fetch(`${API_BASE}/category/${id}`, { method: "DELETE" }).then(res => res.json());