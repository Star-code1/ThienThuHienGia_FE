// Cảnh giới tu luyện & huy hiệu, suy ra từ số trận tham chiến thực tế (attendedCount)
// Dữ liệu nguồn: GET /api/attendance/rankings/absent

export const REALMS = [
  { name: 'Luyện Khí', min: 0, icon: '🌱', hex: '#94a3b8' },
  { name: 'Trúc Cơ', min: 5, icon: '🪨', hex: '#34d399' },
  { name: 'Kim Đan', min: 15, icon: '🔶', hex: '#f5c518' },
  { name: 'Nguyên Anh', min: 30, icon: '🔥', hex: '#f97316' },
  { name: 'Hóa Thần', min: 50, icon: '👑', hex: '#e11d48' },
];

/** Cảnh giới hiện tại + tiến độ lên cảnh giới kế tiếp */
export function getRealm(attended = 0) {
  const n = Math.max(0, Number(attended) || 0);
  let idx = 0;
  REALMS.forEach((r, i) => { if (n >= r.min) idx = i; });
  const current = REALMS[idx];
  const next = REALMS[idx + 1] || null;
  const progress = next ? (n - current.min) / (next.min - current.min) : 1;
  return { ...current, next, remaining: next ? next.min - n : 0, progress: Math.min(1, Math.max(0, progress)) };
}

/** Huy hiệu đạt được, theo thống kê của một thành viên */
export function getBadges(s = {}) {
  const events = s.totalEvents || 0;
  const attended = s.attendedCount || 0;
  const rate = events > 0 ? attended / events : 0;
  const badges = [];
  if (events >= 5 && rate >= 0.9) badges.push({ icon: '🏅', name: 'Chuyên Cần', desc: 'Tham chiến từ 90% số trận' });
  if (events >= 3 && (s.totalAbsentCount || 0) === 0) badges.push({ icon: '🛡️', name: 'Không Vắng', desc: 'Chưa vắng trận nào' });
  if ((s.reputationScore || 0) >= 10) badges.push({ icon: '⭐', name: 'Công Thần', desc: 'Điểm công tội từ +10' });
  if (attended >= 20) badges.push({ icon: '🏯', name: 'Trụ Cột', desc: 'Từ 20 trận tham chiến' });
  return badges;
}
