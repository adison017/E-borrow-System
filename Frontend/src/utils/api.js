export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";
export const UPLOAD_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5000";

// Helper function สำหรับ fetch API ที่แนบ JWT token
export function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers ? { ...options.headers } : {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
}

// Equipment
export const getEquipment = () => authFetch(`${API_BASE}/equipment`).then(res => res.json());

// Upload image and return filename only
export const uploadImage = async (file, item_code) => {
  const formData = new FormData();
  formData.append("image", file);
  if (item_code) formData.append("item_code", item_code); // ส่ง item_code ไปด้วย
  const res = await authFetch("http://localhost:5000/api/equipment/upload", {
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
  return authFetch(`${API_BASE}/equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
};

export const updateEquipment = (item_code, data) => {
  // Always use item_code as canonical identifier
  const payload = { ...data, item_code };
  return authFetch(`${API_BASE}/equipment/${item_code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
};

export const deleteEquipment = (item_code) => authFetch(`${API_BASE}/equipment/${item_code}`, { method: "DELETE" }).then(res => res.json());

// Category
export const getCategories = () => authFetch(`${API_BASE}/category`).then(res => res.json());
export const addCategory = (data) => authFetch(`${API_BASE}/category`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json());
export const updateCategory = (id, data) => authFetch(`${API_BASE}/category/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json());
export const deleteCategory = (id) => authFetch(`${API_BASE}/category/${id}`, { method: "DELETE" }).then(res => res.json());

// Update equipment status
export const updateEquipmentStatus = (item_code, status) => {
  // item_code must be string (not id)
  if (!item_code || typeof item_code !== 'string') throw new Error('item_code is required');
  // status: can be string or object (support both)
  const statusPayload = typeof status === 'object' && status.status ? status : { status };
  return authFetch(`${API_BASE}/equipment/${item_code}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statusPayload),
  }).then(res => res.json());
};

// Borrow
export const getAllBorrows = () => authFetch(`${API_BASE}/borrows`).then(res => res.json());
export const getBorrowById = (id) => authFetch(`${API_BASE}/borrows/${id}`).then(res => res.json());

// Get repair requests by item_id
export const getRepairRequestsByItemId = (item_id) => {
  return authFetch(`${API_BASE}/repair-requests/item/${item_id}`)
    .then(res => res.json());
};

export const updateBorrowStatus = (borrow_id, status, rejection_reason, signature_image, handover_photo) => {
  console.log('=== updateBorrowStatus API Debug ===');
  console.log('borrow_id:', borrow_id);
  console.log('status:', status);
  console.log('rejection_reason:', rejection_reason);
  console.log('signature_image exists:', !!signature_image);
  console.log('signature_image length:', signature_image ? signature_image.length : 0);
  console.log('handover_photo exists:', !!handover_photo);
  console.log('handover_photo length:', handover_photo ? handover_photo.length : 0);

  const body = { status };
  if (rejection_reason !== undefined) body.rejection_reason = rejection_reason;
  if (signature_image !== undefined) body.signature_image = signature_image;
  if (handover_photo !== undefined) body.handover_photo = handover_photo;

  console.log('Request body:', {
    status: body.status,
    rejection_reason: body.rejection_reason,
    signature_image_length: body.signature_image ? body.signature_image.length : 0,
    handover_photo_length: body.handover_photo ? body.handover_photo.length : 0
  });

  return authFetch(`${API_BASE}/borrows/${borrow_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(res => res.json());
};

// Add this helper for news
export const getNews = async () => {
  const res = await authFetch(`${API_BASE}/news`);
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};