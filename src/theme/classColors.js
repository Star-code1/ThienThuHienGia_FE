// src/theme/classColors.js
// Bảng màu chủ đạo cho từng Phái (class) trong Thiên Thư Hiền Giả.
// Đây là nguồn dữ liệu màu sắc DUY NHẤT — mọi component đều import từ đây
// để đảm bảo một Phái luôn hiển thị đúng 1 màu xuyên suốt toàn bộ giao diện.

export const CLASS_LIST = [
  { name: 'Tố Vấn',   hex: '#ec6a9e' }, // hồng
  { name: 'Huyết Hà', hex: '#ef5757' }, // đỏ
  { name: 'Thần Tương', hex: '#4d8fea' }, // lam
  { name: 'Toái Mộng', hex: '#22d3ee' }, // cyan
  { name: 'Thiết Y',  hex: '#f5c518' }, // vàng
  { name: 'Long Ngâm', hex: '#34d399' }, // lục
  { name: 'Cửu Linh', hex: '#a78bfa' }, // tím
];

export const UNKNOWN_COLOR = { name: '', hex: '#5b6472' }; // xám trung tính khi chưa xếp phái

// Chuẩn hoá chuỗi để so khớp không phân biệt hoa/thường & khoảng trắng thừa
const normalize = (s) => (s || '').trim().toLowerCase();

/**
 * Trả về thông tin { name, hex } của một Phái dựa trên tên (className / roleOrClass).
 * Nếu không khớp phái nào trong danh sách, trả về màu xám mặc định.
 */
export function getClassInfo(className) {
  const target = normalize(className);
  if (!target) return { ...UNKNOWN_COLOR, name: '' };
  const found = CLASS_LIST.find((c) => normalize(c.name) === target);
  return found || { ...UNKNOWN_COLOR, name: className };
}

/** Trả về nhanh mã hex của một Phái. */
export function getClassHex(className) {
  return getClassInfo(className).hex;
}

/** Tạo màu nền mờ (rgba) từ hex + độ mờ alpha (0-1), dùng cho badge/chip. */
export function hexToRgba(hex, alpha = 1) {
  const clean = (hex || UNKNOWN_COLOR.hex).replace('#', '');
  const bigint = parseInt(clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}