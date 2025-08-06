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
    console.log('API Request - URL:', url);
    console.log('API Request - Token present:', !!token);
  } else {
    console.log('API Request - No token found in localStorage');
  }
  return fetch(url, { ...options, headers });
}

// Equipment
export const getEquipment = () => authFetch(`${API_BASE}/equipment`).then(res => {
  console.log('getEquipment response status:', res.status);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}).catch(error => {
  console.error('getEquipment error:', error);
  throw error;
});

// Upload image to Cloudinary and return URL
export const uploadImage = async (file, item_code) => {
  try {
    console.log('[UPLOAD] Starting upload for item_code:', item_code);

    const formData = new FormData();
    formData.append("image", file);

    // ใช้ query parameter สำหรับ item_code
    const url = item_code
      ? `${API_BASE}/equipment/upload?item_code=${encodeURIComponent(item_code)}`
      : `${API_BASE}/equipment/upload`;

    const res = await authFetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('[UPLOAD] Upload failed:', errorData);
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await res.json();
    console.log('[UPLOAD] Upload successful:', data);
    return data.url;
  } catch (error) {
    console.error('[UPLOAD] Upload error:', error);
    throw error;
  }
};

export const addEquipment = (data) => {
  // Always use item_code as canonical identifier
  const payload = { ...data };
  if (!payload.item_code && (payload.id || payload.item_id)) payload.item_code = payload.id || payload.item_id;
  if (typeof payload.quantity === 'string') payload.quantity = Number(payload.quantity);
  if (typeof payload.price === 'string') payload.price = Number(payload.price);
  if (payload.price === '' || payload.price === null || isNaN(payload.price)) delete payload.price;
  if (!payload.purchaseDate) delete payload.purchaseDate;
  if (!payload.room_id) delete payload.room_id;
  return authFetch(`${API_BASE}/equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
};

export const updateEquipment = (item_id, data) => {
  const payload = { ...data };
  console.log('updateEquipment - URL:', `${API_BASE}/equipment/${item_id}`);
  console.log('updateEquipment - Payload:', payload);

  return authFetch(`${API_BASE}/equipment/${item_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => {
    console.log('updateEquipment - Response status:', res.status);
    if (!res.ok) {
      return res.json().then(errorData => {
        console.error('updateEquipment - Error response:', errorData);
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error || errorData.message || 'Unknown error'}`);
      });
    }
    return res.json();
  }).catch(error => {
    console.error('updateEquipment - Error:', error);
    throw error;
  });
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

  return authFetch(`${API_BASE}/borrows/${borrow_id}/status`, {
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

// Room
export const getRooms = () => authFetch(`${API_BASE}/rooms`).then(res => res.json());