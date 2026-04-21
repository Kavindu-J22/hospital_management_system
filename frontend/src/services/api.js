import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Handle 401 globally — auto logout ONLY for authenticated requests, not login attempts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Never redirect when the request itself was an auth/login call.
      // Those 401s mean "wrong credentials" and the login page must show the error.
      const requestUrl = error.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/');
      if (!isAuthRequest) {
        // A protected API returned 401 → token expired / invalid → force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  adminLogin: (data) => api.post('/auth/admin/login', data),
  doctorLogin: (data) => api.post('/auth/doctor/login', data),
  doctorRegister: (data) => api.post('/auth/doctor/register', data),
  patientLogin: (data) => api.post('/auth/patient/login', data),
  patientRegister: (data) => api.post('/auth/patient/register', data),
  getMe: () => api.get('/auth/me'),
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAccounts: () => api.get('/admin/accounts'),
  createAccount: (data) => api.post('/admin/accounts', data),
};

// ─── DOCTORS ──────────────────────────────────────────────────────────────────
export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getPublic: (params) => api.get('/doctors/public', { params }), // no auth needed
  getPending: () => api.get('/doctors/pending'),
  getOne: (id) => api.get(`/doctors/${id}`),
  approve: (id) => api.patch(`/doctors/${id}/approve`),
  reject: (id, data) => api.patch(`/doctors/${id}/reject`, data),
  update: (id, data) => api.patch(`/doctors/${id}`, data),
  getSpecializations: () => api.get('/doctors/specializations'),
};

// ─── PATIENTS ─────────────────────────────────────────────────────────────────
export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getOne: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.patch(`/patients/${id}`, data),
  getStats: () => api.get('/patients/stats'),
};

// ─── ROOMS ────────────────────────────────────────────────────────────────────
export const roomAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getAvailable: () => api.get('/rooms/available'),
  getStats: () => api.get('/rooms/stats'),
  getOne: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.patch(`/rooms/${id}`, data),
  assign: (id, data) => api.post(`/rooms/${id}/assign`, data),
};

// ─── SESSIONS ─────────────────────────────────────────────────────────────────
export const sessionAPI = {
  getAll: (params) => api.get('/sessions', { params }),
  getByDoctor: (doctorId, params) => api.get(`/sessions/doctor/${doctorId}`, { params }),
  getStats: () => api.get('/sessions/stats'),
  create: (data) => api.post('/sessions', data),
  extend: (id, data) => api.patch(`/sessions/${id}/extend`, data),
  updateStatus: (id, data) => api.patch(`/sessions/${id}/status`, data),
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getQueue: () => api.get('/appointments/queue'),
  getSessionQueue: (sessionId) => api.get(`/appointments/queue/${sessionId}`),
  getStats: () => api.get('/appointments/stats'),
  create: (data) => api.post('/appointments', data),
  confirm: (id) => api.patch(`/appointments/${id}/confirm`),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
};

// ─── PRESCRIPTIONS ────────────────────────────────────────────────────────────
export const prescriptionAPI = {
  getAll: (params) => api.get('/prescriptions', { params }),
  getOne: (id) => api.get(`/prescriptions/${id}`),
  getByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getByDoctor: (doctorId, params) => api.get(`/prescriptions/doctor/${doctorId}`, { params }),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.patch(`/prescriptions/${id}`, data),
};

export default api;
