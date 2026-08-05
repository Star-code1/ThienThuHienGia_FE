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

    // Danh sách đệ tử báo bận (status === 'absent')
    absentUsers: [],
    
    loading: false,
    events: [],

    // Panels bên phải
    rightPanels: {
      rung1: {},
      rung2: {},
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
    },

    // Dynamic busy count: number of users in event with status === 'absent'
    totalBusyCount: (state) => {
      return state.absentUsers ? state.absentUsers.length : (state.rightPanels.rollCall?.totalBusy || 0);
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

        // Store absent users (status === 'absent')
        this.absentUsers = attendances.filter((item) => item.status === 'absent');

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

        // Update totalBusy count with exact number of absent users
        if (!this.rightPanels.rollCall) {
          this.rightPanels.rollCall = { title: 'CHỐT ĐIỂM DANH', totalCheckedIn: 0, totalBusy: 0 };
        }
        this.rightPanels.rollCall.totalBusy = this.absentUsers.length;

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

    // Thêm đệ tử ngoại bang / lính đánh thuê vào danh sách chờ (Pool)
    addExternalMember({ displayName, className, note }) {
      if (!displayName || !displayName.trim()) return null;
      const newMember = {
        userId: `ext_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        displayName: displayName.trim(),
        username: displayName.trim(),
        className: className || 'Long Ngâm',
        roleName: note || '',
        note: note || '',
        status: 'present',
        isExternal: true,
      };
      this.attendancePool.unshift(newMember);
      return newMember;
    },

    // Thêm trực tiếp đệ tử ngoại bang vào Slot chỉ định
    assignExternalMemberToSlot({ targetDIdx, targetTIdx, targetSIdx, displayName, className, note }) {
      const targetSlot = this.divisions[targetDIdx]?.teams[targetTIdx]?.slots[targetSIdx];
      if (!targetSlot || !displayName || !displayName.trim()) return;

      if (targetSlot.userId && !targetSlot.userId.startsWith('leader_') && !targetSlot.userId.startsWith('rung')) {
        this.attendancePool.push({
          userId: targetSlot.userId,
          displayName: targetSlot.displayName,
          username: targetSlot.displayName,
          className: targetSlot.className || targetSlot.class,
          roleName: targetSlot.roleName || targetSlot.role,
          note: targetSlot.note || '',
          isExternal: targetSlot.isExternal || targetSlot.userId.startsWith('ext_'),
        });
      }

      targetSlot.userId = `ext_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      targetSlot.displayName = displayName.trim();
      targetSlot.className = className || 'Long Ngâm';
      targetSlot.roleName = note || '';
      targetSlot.note = note || '';
      targetSlot.isExternal = true;
      targetSlot.isChecked = false;
    },

    // Thêm trực tiếp đệ tử ngoại bang vào ô Trưởng Rừng
    assignExternalMemberToRung({ rungKey, displayName, className, note }) {
      const rung = this.rightPanels[rungKey];
      if (!rung || !displayName || !displayName.trim()) return;

      if (rung.userId && !rung.userId.startsWith('rung')) {
        this.attendancePool.push({
          userId: rung.userId,
          displayName: rung.leaderName,
          username: rung.leaderName,
          className: rung.class,
          roleName: rung.subTag,
          note: rung.subTag,
          isExternal: rung.isExternal || rung.userId.startsWith('ext_'),
        });
      }

      rung.userId = `ext_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      rung.leaderName = displayName.trim();
      rung.class = className || 'Huyết Hà';
      rung.subTag = note || 'Trưởng Rừng';
      rung.isExternal = true;
    },

    // Xóa vĩnh viễn đệ tử ngoại bang / đánh thuê khỏi sơ đồ và danh sách chờ
    deleteExternalMember(userId) {
      if (!userId) return;

      // 1. Xóa khỏi attendancePool
      const poolIdx = this.attendancePool.findIndex((m) => m.userId === userId);
      if (poolIdx !== -1) {
        this.attendancePool.splice(poolIdx, 1);
      }

      // 2. Xóa khỏi các slot trong divisions
      this.divisions.forEach((div) => {
        if (div.teams) {
          div.teams.forEach((team) => {
            if (team.slots) {
              team.slots.forEach((slot) => {
                if (slot.userId === userId) {
                  slot.userId = null;
                  slot.displayName = '';
                  slot.roleName = '';
                  slot.className = '';
                  slot.note = '';
                  slot.isExternal = false;
                  slot.isChecked = false;
                }
              });
            }
          });
        }
      });

      // 3. Xóa khỏi ô Trưởng Rừng
      ['rung1', 'rung2'].forEach((key) => {
        const rung = this.rightPanels[key];
        if (rung && rung.userId === userId) {
          rung.userId = null;
          rung.leaderName = '';
          rung.class = '';
          rung.subTag = '';
          rung.isExternal = false;
        }
      });
    },

    // Gán thành viên từ Pool vào ô Trưởng Rừng
    assignToRungFromPool({ rungKey, member }) {
      const rung = this.rightPanels[rungKey];
      if (!rung || !member) return;

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

      const poolIdx = this.attendancePool.findIndex((m) => m.userId === member.userId);
      if (poolIdx !== -1) {
        this.attendancePool.splice(poolIdx, 1);
      }
    },

    assignToRungFromSlot({ rungKey, srcDIdx, srcTIdx, srcSIdx }) {
      const srcSlot = this.divisions[srcDIdx]?.teams[srcTIdx]?.slots[srcSIdx];
      const rung = this.rightPanels[rungKey];
      if (!srcSlot || !srcSlot.userId || !rung) return;

      const tempRungUser = rung.userId;
      const tempRungName = rung.leaderName;
      const tempRungClass = rung.class;
      const tempRungTag = rung.subTag;

      rung.userId = srcSlot.userId;
      rung.leaderName = srcSlot.displayName;
      rung.class = srcSlot.className || srcSlot.class || 'Huyết Hà';
      rung.subTag = srcSlot.note || srcSlot.roleName || 'Trưởng Rừng';

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