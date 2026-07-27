import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};