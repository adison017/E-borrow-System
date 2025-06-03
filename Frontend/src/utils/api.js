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
  return fetch(`${API_BASE}/equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());
};
export const updateEquipment = (id, data) => {
  return fetch(`${API_BASE}/equipment/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());
};
export const deleteEquipment = (id) => fetch(`${API_BASE}/equipment/${id}`, { method: "DELETE" }).then(res => res.json());

// Category
export const getCategories = () => fetch(`${API_BASE}/category`).then(res => res.json());
export const addCategory = (data) => fetch(`${API_BASE}/category`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json());
export const updateCategory = (id, data) => fetch(`${API_BASE}/category/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteCategory = (id) => fetch(`${API_BASE}/category/${id}`, { method: "DELETE" }).then(res => res.json());