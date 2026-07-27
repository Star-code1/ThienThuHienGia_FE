import { defineStore } from 'pinia';
import api from '../services/api';
import Swal from 'sweetalert2';


export const useLineupStore = defineStore('lineup', {
  state: () => ({
    eventId: '',
    title: 'ĐỘI HÌNH BANG CHIẾN',
    attendancePool: [], // Danh sách những người điểm danh nhưng chưa được xếp slot
    divisions: [],      // Danh sách các Đoàn -> Teams -> Slots
    loading: false,
    events: [],
  }),

  actions: {
    // Khởi tạo sơ đồ mặc định nếu chưa có trên DB
    initDefaultLineup(numDivisions = 2, teamsPerDivision = 5, slotsPerTeam = 6) {
      this.divisions = Array.from({ length: numDivisions }, (_, dIdx) => ({
        divisionName: `Đoàn ${dIdx + 1}`,
        teams: Array.from({ length: teamsPerDivision }, (_, tIdx) => ({
          teamName: `Team ${tIdx + 1}`,
          teamTag: '', // Gắn tag sau (VD: "VẬT TƯ")
          slots: Array.from({ length: slotsPerTeam }, (_, sIdx) => ({
            slotIndex: sIdx,
            userId: null,
            displayName: '',
            roleOrClass: '',
            note: '',
          })),
        })),
      }));
    },

    async fetchEventData(eventId) {
      this.loading = true;
      this.eventId = eventId;
      try {
        // 1. Lấy danh sách điểm danh từ Discord Bot
        const attRes = await api.getAttendance(eventId);
        const attendances = attRes.data || [];

        // 2. Lấy sơ đồ đội hình đã lưu (nếu có)
        const lineupRes = await api.getLineup(eventId);
        if (lineupRes.data && lineupRes.data.divisions) {
          this.title = lineupRes.data.title;
          this.divisions = lineupRes.data.divisions;
        } else {
          this.initDefaultLineup(); // Dựng khung mặc định nếu chưa có
        }

        // 3. Lọc danh sách Pool (Loại bỏ những người đã được đưa vào slot)
        const occupiedUserIds = new Set();
        this.divisions.forEach(div => {
          div.teams.forEach(team => {
            team.slots.forEach(slot => {
              if (slot.userId) occupiedUserIds.add(slot.userId);
            });
          });
        });

        this.attendancePool = attendances.filter(
          item => item.status === 'present' && !occupiedUserIds.has(item.userId)
        );
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        this.loading = false;
      }
    },

    // Xóa thành viên khỏi Slot và trả về Pool
    clearSlot(divisionIndex, teamIndex, slotIndex) {
      const slot = this.divisions[divisionIndex].teams[teamIndex].slots[slotIndex];
      if (slot.userId) {
        this.attendancePool.push({
          userId: slot.userId,
          displayName: slot.displayName,
          className: slot.roleOrClass,
        });
        slot.userId = null;
        slot.displayName = '';
        slot.roleOrClass = '';
        slot.note = '';
      }
    },


async saveCurrentLineup() {
  try {
    await api.saveLineup(this.eventId, {
      title: this.title,
      divisions: this.divisions,
    });
    
    // Thông báo thành công
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Đã lưu đội hình thành công.',
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    // Thông báo thất bại
    Swal.fire({
      icon: 'error',
      title: 'Lưu thất bại',
      text: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
      confirmButtonText: 'Đóng',
      confirmButtonColor: '#d33',
    });
  }
},

    async fetchEventsList() {
      try {
        const response = await api.getActiveEvents();
        this.events = response.data || [];
      } catch (error) {
        console.error('Lỗi khi tải danh sách events:', error);
      }
    },
  },
});