// src/theme/classColors.js
import cuulinhImg from '../assets/cuulinh.webp';
import huyethaImg from '../assets/huyetha.webp';
import longngamImg from '../assets/longngam.png';
import thantuongImg from '../assets/thantuong.webp';
import thietyImg from '../assets/thiety.webp';
import toaimongImg from '../assets/toaimong.png';
import tovanImg from '../assets/tovan.webp';

export const CLASS_LIST = [
  { name: 'Tố Vấn',   hex: '#ec6a9e', short: 'TV', icon: tovanImg },
  { name: 'Huyết Hà', hex: '#ef5757', short: 'HH', icon: huyethaImg },
  { name: 'Thần Tương', hex: '#4d8fea', short: 'TT', icon: thantuongImg },
  { name: 'Toái Mộng', hex: '#22d3ee', short: 'TM', icon: toaimongImg },
  { name: 'Thiết Y',  hex: '#f5c518', short: 'TY', icon: thietyImg },
  { name: 'Long Ngâm', hex: '#34d399', short: 'LN', icon: longngamImg },
  { name: 'Cửu Linh', hex: '#a78bfa', short: 'CL', icon: cuulinhImg },
];

export const UNKNOWN_COLOR = { name: 'Chưa rõ', hex: '#7b879c', short: '?', icon: null };

const normalize = (s) => (s || '').trim().toLowerCase();

export function getClassInfo(className) {
  const target = normalize(className);
  if (!target) return { ...UNKNOWN_COLOR, name: '' };
  
  const found = CLASS_LIST.find((c) => normalize(c.name) === target);
  if (found) return found;

  const partial = CLASS_LIST.find((c) => target.includes(normalize(c.name)) || normalize(c.name).includes(target));
  return partial || { ...UNKNOWN_COLOR, name: className };
}

export function getClassHex(className) {
  return getClassInfo(className).hex;
}

export function getClassIcon(className) {
  return getClassInfo(className).icon;
}

export function hexToRgba(hex, alpha = 1) {
  const clean = (hex || UNKNOWN_COLOR.hex).replace('#', '');
  const bigint = parseInt(
    clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}