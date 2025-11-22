const API_BASE = 'https://localhost:5443/api';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || 'Request failed';
    throw new Error(message);
  }
  return data;
};

const request = async (path, { method = 'GET', body, token } = {}) => {
  const headers = { Accept: 'application/json' };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  return handleResponse(response);
};

const apiGet = (path, token) => request(path, { token });
const apiPost = (path, body, token) => request(path, { method: 'POST', body, token });
const apiPut = (path, body, token) => request(path, { method: 'PUT', body, token });
const apiDelete = (path, token) => request(path, { method: 'DELETE', token });

export const Api = {
  login: (email, password) => apiPost('/auth/login', { email, password }),
  register: (name, email, password) => apiPost('/auth/register', { name, email, password }),
  getMe: (token) => apiGet('/auth/me', token),
  googleLogin: (credential) => apiPost('/auth/google', { credential }),
  fetchProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiGet(`/products${query ? `?${query}` : ''}`);
  },
  fetchProduct: (id) => apiGet(`/products/${id}`),
  checkout: (payload, token) => apiPost('/orders', payload, token),
  getMyOrders: (token) => apiGet('/orders/my', token),
  getAdminStats: (token) => apiGet('/admin/stats', token),
  getAdminOrders: (token) => apiGet('/admin/orders', token),
  getAdminOrder: (id, token) => apiGet(`/admin/orders/${id}`, token),
  createProduct: (data, token) => apiPost('/products', data, token),
  updateProduct: (id, data, token) => apiPut(`/products/${id}`, data, token),
  deleteProduct: (id, token) => apiDelete(`/products/${id}`, token)
};
