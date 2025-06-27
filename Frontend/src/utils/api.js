const API_BASE = "http://localhost:5000/api";
const UPLOAD_BASE = "http://localhost:5000";

// Equipment
export const getEquipment = () => fetch(`${API_BASE}/equipment`).then(res => res.json());

// Upload image and return filename only
export const uploadImage = async (file, item_code) => {
  const formData = new FormData();
  formData.append("image", file);
  if (item_code) formData.append("item_code", item_code); // ส่ง item_code ไปด้วย
  const res = await fetch("http://localhost:5000/api/equipment/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.url;
};

export const addEquipment = (data) => {
  // Always use item_code as canonical identifier
  const payload = { ...data };
  if (!payload.item_code && (payload.id || payload.item_id)) payload.item_code = payload.id || payload.item_id;
  if (typeof payload.quantity === 'string') payload.quantity = Number(payload.quantity);
  if (typeof payload.price === 'string') payload.price = Number(payload.price);
  if (payload.price === '' || payload.price === null || isNaN(payload.price)) delete payload.price;
  if (!payload.purchaseDate) delete payload.purchaseDate;
  if (!payload.location) delete payload.location;
  return fetch(`${API_BASE}/equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
};

export const updateEquipment = (item_code, data) => {
  // Always use item_code as canonical identifier
  const payload = { ...data, item_code };
  return fetch(`${API_BASE}/equipment/${item_code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
};

export const deleteEquipment = (item_code) => fetch(`${API_BASE}/equipment/${item_code}`, { method: "DELETE" }).then(res => res.json());

// Category
export const getCategories = () => fetch(`${API_BASE}/category`).then(res => res.json());
export const addCategory = (data) => fetch(`${API_BASE}/category`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json());
export const updateCategory = (id, data) => fetch(`${API_BASE}/category/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteCategory = (id) => fetch(`${API_BASE}/category/${id}`, { method: "DELETE" }).then(res => res.json());

// Update equipment status
export const updateEquipmentStatus = (item_code, status) => {
  // item_code must be string (not id)
  if (!item_code || typeof item_code !== 'string') throw new Error('item_code is required');
  // status: can be string or object (support both)
  const statusPayload = typeof status === 'object' && status.status ? status : { status };
  return fetch(`${API_BASE}/equipment/${item_code}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statusPayload),
  }).then(res => res.json());
};

// Borrow
export const getAllBorrows = () => fetch(`${API_BASE}/borrows`).then(res => res.json());

export const updateBorrowStatus = (borrow_id, status, rejection_reason) => {
  const body = rejection_reason !== undefined
    ? { status, rejection_reason }
    : { status };
  return fetch(`${API_BASE}/borrows/${borrow_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(res => res.json());
};