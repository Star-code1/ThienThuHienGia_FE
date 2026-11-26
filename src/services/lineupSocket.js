import { io } from 'socket.io-client';

// Địa chỉ server Socket.IO: ưu tiên VITE_SOCKET_URL, sau đó suy ra từ VITE_API_BASE_URL,
// còn lại dùng cùng origin (dev đã proxy /socket.io sang backend).
function resolveUrl() {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit) return explicit;
  const api = import.meta.env.VITE_API_BASE_URL || '/api';
  if (/^https?:\/\//.test(api)) return new URL(api).origin;
  return window.location.origin;
}

export function createLineupSocket() {
  return io(resolveUrl(), {
    auth: (cb) => cb({ token: localStorage.getItem('ttm_token') || '' }),
    transports: ['websocket', 'polling'],
    reconnectionDelayMax: 5000,
  });
}
