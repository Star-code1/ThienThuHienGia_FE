import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default {
  // Lấy danh sách events đang active
  getActiveEvents() {
    return apiClient.get('/events/active');
  },
  // Lấy danh sách member đã điểm danh từ Bot Discord
  getAttendance(eventId) {
    return apiClient.get(`/attendance/${eventId}`);
  },
  // Lấy sơ đồ đội hình đã lưu
  getLineup(eventId) {
    return apiClient.get(`/lineup/${eventId}`);
  },
  // Lưu sơ đồ đội hình mới
  saveLineup(eventId, lineupData) {
    return apiClient.post(`/lineup/${eventId}`, lineupData);
  },

  // ===== DỮ LIỆU TRẬN ĐẤU & RÚT KINH NGHIỆM =====
  getMatchAnalysis() {
    return apiClient.get('/match-analysis');
  },
  createMatchAnalysis(data) {
    return apiClient.post('/match-analysis', data);
  },
  updateMatchAnalysis(id, data) {
    return apiClient.put(`/match-analysis/${id}`, data);
  },
  deleteMatchAnalysis(id) {
    return apiClient.delete(`/match-analysis/${id}`);
  },
  uploadMatchImage(image) {
    return apiClient.post('/match-analysis/upload-image', { image });
  }
};