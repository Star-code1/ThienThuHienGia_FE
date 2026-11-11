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

// Token hết hạn / không hợp lệ: xoá phiên đăng nhập và đưa về trang chủ
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && localStorage.getItem('ttm_token') && !url.includes('/auth/discord')) {
      localStorage.removeItem('ttm_token');
      localStorage.removeItem('ttm_user');
      if (window.location.pathname !== '/') window.location.assign('/');
    }
    return Promise.reject(error);
  }
);

export default {
  // Lấy danh sách events đang active
  getActiveEvents() {
    return apiClient.get('/events/active');
  },
  // Lấy danh sách member đã điểm danh từ Bot Discord
  getAttendance(eventId) {
    return apiClient.get(`/attendance/${eventId}`);
  },
  // Lấy danh sách thành viên sở hữu role chưa vote cho sự kiện
  getUnvotedMembers(eventId, roleId = '1438967271149146302') {
    return apiClient.get(`/attendance/${eventId}/unvoted`, { params: { roleId } });
  },
  // Đánh dấu thành viên Vote mà không đánh (No-Show)
  toggleNoShow(eventId, data) {
    return apiClient.put(`/attendance/${eventId}/toggle-no-show`, data);
  },
  // Lấy bảng xếp hạng thành viên vắng mặt & điểm công tội
  getAbsentRankings(params = {}) {
    return apiClient.get('/attendance/rankings/absent', { params });
  },
  // Thống kê vote Vắng: tổng quan N tháng gần nhất
  getAbsenceOverview(params = {}) {
    return apiClient.get('/attendance/absence-stats/overview', { params });
  },
  // Thống kê vote Vắng: chi tiết từng đệ tử trong 1 tháng (YYYY-MM)
  getAbsenceMonth(month) {
    return apiClient.get(`/attendance/absence-stats/month/${month}`);
  },
  // Lưu/xoá ghi chú cho đệ tử vắng nhiều (chỉ Đương Gia / Đường Chủ)
  saveAbsenceNote(month, userId, content) {
    return apiClient.put(`/attendance/absence-stats/month/${month}/note/${userId}`, { content });
  },
  // Lấy sơ đồ đội hình đã lưu
  getLineup(eventId) {
    return apiClient.get(`/lineup/${eventId}`);
  },
  // Lưu sơ đồ đội hình mới (Chỉ lưu vào DB)
  saveLineup(eventId, lineupData) {
    return apiClient.post(`/lineup/${eventId}`, lineupData);
  },
  // Kích hoạt gửi thông báo đội hình đến thành viên qua Discord DM
  notifyLineup(eventId) {
    return apiClient.post(`/lineup/${eventId}/notify`);
  },

  // ===== QUẢN LÝ KỸ NĂNG / PHÂN CÔNG =====
  getSkills() {
    return apiClient.get('/skills');
  },
  createSkill(data) {
    return apiClient.post('/skills', data);
  },
  uploadSkillIcon(image) {
    return apiClient.post('/skills/upload-icon', { image });
  },
  deleteSkill(id) {
    return apiClient.delete(`/skills/${id}`);
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