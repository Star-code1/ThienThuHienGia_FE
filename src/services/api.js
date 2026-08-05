import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default {
  // Lấy danh sách events đang active
  getActiveEvents() {
    return api.get('/events/active');
  },
  // Lấy danh sách member đã điểm danh từ Bot Discord
  getAttendance(eventId) {
    return api.get(`/attendance/${eventId}`);
  },
  // Lấy sơ đồ đội hình đã lưu
  getLineup(eventId) {
    return api.get(`/lineup/${eventId}`);
  },
  // Lưu sơ đồ đội hình mới
  saveLineup(eventId, lineupData) {
    return api.post(`/lineup/${eventId}`, lineupData);
  },

  // ===== DỮ LIỆU TRẬN ĐẤU & RÚT KINH NGHIỆM =====
  getMatchAnalysis() {
    return api.get('/match-analysis');
  },
  createMatchAnalysis(data) {
    return api.post('/match-analysis', data);
  },
  updateMatchAnalysis(id, data) {
    return api.put(`/match-analysis/${id}`, data);
  },
  deleteMatchAnalysis(id) {
    return api.delete(`/match-analysis/${id}`);
  },
  uploadMatchImage(image) {
    return api.post('/match-analysis/upload-image', { image });
  }
};