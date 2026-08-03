import { defineStore } from 'pinia';
import api from '../services/api';
import Swal from 'sweetalert2';
import { CLASS_LIST, getClassInfo } from '../theme/classColors';

export const useLineupStore = defineStore('lineup', {
  state: () => ({
    eventId: '',
    title: 'ĐỘI HÌNH BANG CHIẾN',
    viewMode: 'matrix', // 'matrix' (xem chuẩn) hoặc 'edit' (chỉnh sửa / kéo thả)
    
    // Khối các Đoàn (Divisions) -> Teams -> Slots
    divisions: [],
    
    // Danh sách điểm danh chưa xếp slot
    attendancePool: [],
    
    loading: false,
    events: [],

    // Panels bên phải
    rightPanels: {
      rung1: { title: 'RỪNG 1 (TRÁI)', userId: 'rung1_default', leaderName: 'Kéo thành viên vào', subTag: 'Rừng Trái', class: 'Huyết Hà' },
      rung2: { title: 'RỪNG 2 (PHẢI)', userId: 'rung2_default', leaderName: 'Kéo thành viên vào', subTag: 'Rừng Phải', class: 'Huyết Hà' },
      rollCall: {
        title: 'CHỐT ĐIỂM DANH',
        totalCheckedIn: 0,
        totalBusy: 0,
      },
      tactics: {
        title: 'LƯU Ý & CHIẾN THUẬT',
        notes: [
          'Yêu cầu mọi người onl sớm trước 30 phút để chuẩn bị, ai onl sát giờ nhắn trên Discord cho Leader',
          'Giờ ra vật tư: 22:50 > 17:40 > 12:30 > 7:20 > 2:20',
          'Tập trung nghe call chỉ huy trong phòng Voice Discord'
        ]
      }
    },
    
    // Băng rôn chiến thuật bên dưới
    bannerNotes: [
      { id: 'b1', text: 'Các Tố Vấn mid build trâu nhiều chút nhé', color: 'purple' },
      { id: 'b2', text: 'Tank cầm Thái Cực Đồ + Như Phong Tự Bế + Phong Tuyết Kinh Đào hoặc Chuông', color: 'gold' }
    ]
  }),

  getters: {
    classCounts: (state) => {
      const counts = {
        'Long Ngâm': 0,
        'Thiết Y': 0,
        'Tố Vấn': 0,
        'Huyết Hà': 0,
        'Toái Mộng': 0,
        'Thần Tương': 0,
        'Cửu Linh': 0,
      };

      state.divisions.forEach((div) => {
        if (div.teams) {
          div.teams.forEach((team) => {
            if (team.slots) {
              team.slots.forEach((slot) => {
                if (slot.userId && (slot.className || slot.class)) {
                  const info = getClassInfo(slot.className || slot.class);
                  if (counts[info.name] !== undefined) {
                    counts[info.name]++;
                  }
                }
              });
            }
          });
        }
      });

      // Cộng thêm vị trí Trưởng Rừng nếu có phái
      ['rung1', 'rung2'].forEach((key) => {
        const rung = state.rightPanels[key];
        if (rung && rung.userId && rung.class) {
          const info = getClassInfo(rung.class);
          if (counts[info.name] !== undefined) {
            counts[info.name]++;
          }
        }
      });

      return counts;
    },

    totalAssigned: (state) => {
      let total = 0;
      state.divisions.forEach((div) => {
        if (div.teams) {
          div.teams.forEach((team) => {
            if (team.slots) {
              team.slots.forEach((slot) => {
                if (slot.userId) total++;
              });
            }
          });
        }
      });

      ['rung1', 'rung2'].forEach((key) => {
        if (state.rightPanels[key]?.userId) total++;
      });

      return total;
    },

    totalAttendance: (state) => {
      let assigned = 0;
      state.divisions.forEach((div) => {
        if (div.teams) {
          div.teams.forEach((team) => {
            if (team.slots) {
              team.slots.forEach((slot) => {
                if (slot.userId) assigned++;
              });
            }
          });
        }
      });

      ['rung1', 'rung2'].forEach((key) => {
        if (state.rightPanels[key]?.userId) assigned++;
      });

      return assigned + state.attendancePool.length;
    }
  },

  actions: {
    toggleViewMode() {
      this.viewMode = this.viewMode === 'matrix' ? 'edit' : 'matrix';
    },

    initDefaultLineup() {
      this.divisions = [
        {
          divisionName: 'ĐOÀN 1 MID',
          leaderTag: 'LEADER',
          footerTag: 'HEAL AOE',
          teams: [1, 2, 3, 4, 5].map((num) => ({
            teamName: `Nhóm ${num}`,
            teamTag: '',
            footerTag: 'VAI TRÒ',
            slots: Array.from({ length: 6 }, (_, sIdx) => ({
              slotIndex: sIdx,
              userId: null,
              displayName: '',
              roleName: '',
              className: '',
              note: '',
              isLeader: sIdx === 0,
              isChecked: false,
            })),
          })),
        },
        {
          divisionName: 'NHÓM 4 - 5 (TRANG 1)',
          leaderTag: 'LEADER',
          footerTag: 'VAI TRÒ',
          teams: [4, 5].map((num) => ({
            teamName: `Nhóm ${num}`,
            teamTag: '',
            footerTag: 'VAI TRÒ',
            slots: Array.from({ length: 6 }, (_, sIdx) => ({
              slotIndex: sIdx,
              userId: null,
              displayName: '',
              roleName: '',
              className: '',
              note: '',
              isLeader: sIdx === 0,
              isChecked: false,
            })),
          })),
        },
        {
          divisionName: 'NHÓM 1 - 2 - 3 (TRANG 1)',
          leaderTag: 'LEADER',
          footerTag: 'VAI TRÒ',
          teams: [1, 2, 3].map((num) => ({
            teamName: `Nhóm ${num}`,
            teamTag: '',
            footerTag: 'VAI TRÒ',
            slots: Array.from({ length: 6 }, (_, sIdx) => ({
              slotIndex: sIdx,
              userId: null,
              displayName: '',
              roleName: '',
              className: '',
              note: '',
              isLeader: sIdx === 0,
              isChecked: false,
            })),
          })),
        },
      ];
    },

    async fetchEventData(eventId) {
      this.loading = true;
      this.eventId = eventId;
      try {
        const attRes = await api.getAttendance(eventId);
        const attendances = attRes.data || [];

        const lineupRes = await api.getLineup(eventId);
        if (lineupRes.data && lineupRes.data.divisions && lineupRes.data.divisions.length > 0) {
          this.title = lineupRes.data.title || 'ĐỘI HÌNH BANG CHIẾN';
          this.divisions = lineupRes.data.divisions;
          
          this.divisions.forEach((div) => {
            if (div.teams) {
              div.teams.forEach((team) => {
                if (team.slots) {
                  team.slots.forEach((slot, sIdx) => {
                    slot.isLeader = (sIdx === 0);
                  });
                }
              });
            }
          });

          if (lineupRes.data.rightPanels) this.rightPanels = lineupRes.data.rightPanels;
          if (lineupRes.data.bannerNotes) this.bannerNotes = lineupRes.data.bannerNotes;
        } else {
          this.initDefaultLineup();
        }

        const occupiedUserIds = new Set();
        this.divisions.forEach((div) => {
          if (div.teams) {
            div.teams.forEach((team) => {
              if (team.slots) {
                team.slots.forEach((slot) => {
                  if (slot.userId) occupiedUserIds.add(slot.userId);
                });
              }
            });
          }
        });

        ['rung1', 'rung2'].forEach((key) => {
          if (this.rightPanels[key]?.userId) {
            occupiedUserIds.add(this.rightPanels[key].userId);
          }
        });

        this.attendancePool = attendances.filter(
          (item) => item.status === 'present' && !occupiedUserIds.has(item.userId)
        );
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu từ DB:', error);
      } finally {
        this.loading = false;
      }
    },

    // Gán thành viên từ Pool vào ô Trưởng Rừng
    assignToRungFromPool({ rungKey, member }) {
      const rung = this.rightPanels[rungKey];
      if (!rung || !member) return;

      // Nếu ô Rừng đang có người, trả người cũ về Pool
      if (rung.userId && !rung.userId.startsWith('rung')) {
        this.attendancePool.push({
          userId: rung.userId,
          displayName: rung.leaderName,
          username: rung.leaderName,
          className: rung.class,
          roleName: rung.subTag,
        });
      }

      rung.userId = member.userId;
      rung.leaderName = member.displayName || member.username || '';
      rung.class = member.className || member.class || 'Huyết Hà';
      rung.subTag = member.roleName || member.role || 'Trưởng Rừng';

      // Xóa thành viên khỏi Pool
      const poolIdx = this.attendancePool.findIndex((m) => m.userId === member.userId);
      if (poolIdx !== -1) {
        this.attendancePool.splice(poolIdx, 1);
      }
    },

    // Di chuyển thành viên từ Slot trong ma trận sang ô Trưởng Rừng
    assignToRungFromSlot({ rungKey, srcDIdx, srcTIdx, srcSIdx }) {
      const srcSlot = this.divisions[srcDIdx]?.teams[srcTIdx]?.slots[srcSIdx];
      const rung = this.rightPanels[rungKey];
      if (!srcSlot || !srcSlot.userId || !rung) return;

      const tempRungUser = rung.userId;
      const tempRungName = rung.leaderName;
      const tempRungClass = rung.class;
      const tempRungTag = rung.subTag;

      // Gán Trưởng Rừng = thành viên từ slot
      rung.userId = srcSlot.userId;
      rung.leaderName = srcSlot.displayName;
      rung.class = srcSlot.className || srcSlot.class || 'Huyết Hà';
      rung.subTag = srcSlot.note || srcSlot.roleName || 'Trưởng Rừng';

      // Trả người ở Rừng cũ sang slot (Hoán đổi)
      if (tempRungUser && !tempRungUser.startsWith('rung')) {
        srcSlot.userId = tempRungUser;
        srcSlot.displayName = tempRungName;
        srcSlot.className = tempRungClass;
        srcSlot.roleName = tempRungTag;
        srcSlot.note = tempRungTag;
      } else {
        srcSlot.userId = null;
        srcSlot.displayName = '';
        srcSlot.className = '';
        srcSlot.roleName = '';
        srcSlot.note = '';
      }
    },

    // Xóa người khỏi vị trí Trưởng Rừng
    clearRung(rungKey) {
      const rung = this.rightPanels[rungKey];
      if (rung && rung.userId) {
        if (!rung.userId.startsWith('rung')) {
          this.attendancePool.push({
            userId: rung.userId,
            displayName: rung.leaderName,
            username: rung.leaderName,
            className: rung.class,
            roleName: rung.subTag,
          });
        }
        rung.userId = null;
        rung.leaderName = '';
        rung.class = '';
        rung.subTag = '';
      }
    },

    moveOrSwapSlot({ srcDIdx, srcTIdx, srcSIdx, targetDIdx, targetTIdx, targetSIdx }) {
      if (
        srcDIdx === targetDIdx &&
        srcTIdx === targetTIdx &&
        srcSIdx === targetSIdx
      ) {
        return;
      }

      const srcSlot = this.divisions[srcDIdx]?.teams[srcTIdx]?.slots[srcSIdx];
      const targetSlot = this.divisions[targetDIdx]?.teams[targetTIdx]?.slots[targetSIdx];

      if (!srcSlot || !targetSlot) return;

      const tempTargetData = {
        userId: targetSlot.userId,
        displayName: targetSlot.displayName,
        className: targetSlot.className || targetSlot.class || '',
        roleName: targetSlot.roleName || targetSlot.role || '',
        note: targetSlot.note || '',
        isChecked: targetSlot.isChecked || false,
      };

      targetSlot.userId = srcSlot.userId;
      targetSlot.displayName = srcSlot.displayName;
      targetSlot.className = srcSlot.className || srcSlot.class || '';
      targetSlot.roleName = srcSlot.roleName || srcSlot.role || '';
      targetSlot.note = srcSlot.note || '';
      targetSlot.isChecked = srcSlot.isChecked || false;

      srcSlot.userId = tempTargetData.userId;
      srcSlot.displayName = tempTargetData.displayName;
      srcSlot.className = tempTargetData.className;
      srcSlot.roleName = tempTargetData.roleName;
      srcSlot.note = tempTargetData.note;
      srcSlot.isChecked = tempTargetData.isChecked;
    },

    assignFromPool({ targetDIdx, targetTIdx, targetSIdx, member }) {
      const targetSlot = this.divisions[targetDIdx]?.teams[targetTIdx]?.slots[targetSIdx];
      if (!targetSlot || !member) return;

      if (targetSlot.userId) {
        this.attendancePool.push({
          userId: targetSlot.userId,
          displayName: targetSlot.displayName,
          username: targetSlot.displayName,
          className: targetSlot.className || targetSlot.class,
          roleName: targetSlot.roleName || targetSlot.role,
        });
      }

      targetSlot.userId = member.userId;
      targetSlot.displayName = member.displayName || member.username || '';
      targetSlot.className = member.className || member.class || '';
      targetSlot.roleName = member.roleName || member.role || '';
      targetSlot.note = member.note || member.roleName || member.role || '';
      targetSlot.isChecked = false;

      const poolIdx = this.attendancePool.findIndex((m) => m.userId === member.userId);
      if (poolIdx !== -1) {
        this.attendancePool.splice(poolIdx, 1);
      }
    },

    assignLeaderToSlot({ targetDIdx, targetTIdx, targetSIdx, leader }) {
      const targetSlot = this.divisions[targetDIdx]?.teams[targetTIdx]?.slots[targetSIdx];
      if (!targetSlot || !leader) return;

      if (targetSlot.userId && !targetSlot.userId.startsWith('leader_') && !targetSlot.userId.startsWith('rung')) {
        this.attendancePool.push({
          userId: targetSlot.userId,
          displayName: targetSlot.displayName,
          username: targetSlot.displayName,
          className: targetSlot.className || targetSlot.class,
          roleName: targetSlot.roleName || targetSlot.role,
        });
      }

      targetSlot.userId = leader.userId || `leader_${Date.now()}_${Math.random()}`;
      targetSlot.displayName = leader.displayName || leader.leaderName || 'Leader';
      targetSlot.className = leader.className || leader.class || 'Thiết Y';
      targetSlot.roleName = leader.roleName || leader.subTag || 'Leader';
      targetSlot.note = leader.note || leader.subTag || 'Leader';
      targetSlot.isChecked = false;
    },

    clearSlot(dIdx, tIdx, sIdx) {
      const slot = this.divisions[dIdx]?.teams[tIdx]?.slots[sIdx];
      if (slot && slot.userId) {
        if (!slot.userId.startsWith('leader_') && !slot.userId.startsWith('rung')) {
          this.attendancePool.push({
            userId: slot.userId,
            displayName: slot.displayName,
            username: slot.displayName,
            className: slot.className || slot.class,
            roleName: slot.roleName || slot.role,
          });
        }
        slot.userId = null;
        slot.displayName = '';
        slot.roleName = '';
        slot.className = '';
        slot.note = '';
        slot.isChecked = false;
      }
    },

    toggleSlotCheck(dIdx, tIdx, sIdx) {
      const slot = this.divisions[dIdx]?.teams[tIdx]?.slots[sIdx];
      if (slot) {
        slot.isChecked = !slot.isChecked;
      }
    },

    addTacticNote(noteText) {
      if (noteText && noteText.trim()) {
        this.rightPanels.tactics.notes.push(noteText.trim());
      }
    },

    removeTacticNote(index) {
      this.rightPanels.tactics.notes.splice(index, 1);
    },

    async saveCurrentLineup() {
      try {
        await api.saveLineup(this.eventId, {
          title: this.title,
          divisions: this.divisions,
          rightPanels: this.rightPanels,
          bannerNotes: this.bannerNotes,
        });

        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Đã lưu sơ đồ đội hình vào database.',
          timer: 1800,
          showConfirmButton: false,
          background: '#12161f',
          color: '#e0b854',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lưu thất bại',
          text: error.message || 'Đã có lỗi xảy ra khi lưu.',
          confirmButtonText: 'Đóng',
          confirmButtonColor: '#ef5757',
          background: '#12161f',
          color: '#ffffff',
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