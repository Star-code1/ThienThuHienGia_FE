import { defineStore } from 'pinia';
import api from '../services/api';
import Swal from 'sweetalert2';
import { getClassInfo } from '../theme/classColors';

export const useLineupStore = defineStore('lineup', {
  state: () => ({
    eventId: '',
    title: 'ĐỘI HÌNH BANG CHIẾN',
    viewMode: 'edit', // 'matrix' (xem chuẩn) hoặc 'edit' (chỉnh sửa / kéo thả)
    
    // Danh sách các Đoàn (Divisions) -> Teams -> Slots
    divisions: [],
    
    // Danh sách điểm danh chưa xếp slot (Pool chờ)
    attendancePool: [],

    // Danh sách đệ tử báo bận (status === 'absent')
    absentUsers: [],
    
    loading: false,
    events: [],
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
      return assigned + state.attendancePool.length;
    },
  },

  actions: {
    toggleViewMode() {
      this.viewMode = this.viewMode === 'matrix' ? 'edit' : 'matrix';
    },

    // Khởi tạo mặc định 2 Đoàn, mỗi đoàn 5 Team với 6 Slot
    initDefaultLineup() {
      const createDefaultDivision = (divNumber) => ({
        id: `div_${Date.now()}_${divNumber}_${Math.random().toString(36).substr(2, 4)}`,
        divisionName: `Đoàn ${divNumber}`,
        isCollapsed: false,
        teams: [1, 2, 3, 4, 5].map((tNum) => ({
          id: `team_${divNumber}_${tNum}_${Math.random().toString(36).substr(2, 4)}`,
          teamName: `Team ${tNum}`,
          teamTag: '',
          slots: Array.from({ length: 6 }, (_, sIdx) => ({
            slotIndex: sIdx,
            userId: null,
            displayName: '',
            roleName: '',
            className: '',
            note: '',
            isLeader: sIdx === 0,
            isChecked: false,
            skills: [],
          })),
        })),
      });

      this.divisions = [
        createDefaultDivision(1),
        createDefaultDivision(2),
      ];
    },

    // Thêm một Đoàn mới
    addDivision() {
      const newDivNumber = this.divisions.length + 1;
      const newDiv = {
        id: `div_${Date.now()}_${newDivNumber}_${Math.random().toString(36).substr(2, 4)}`,
        divisionName: `Đoàn ${newDivNumber}`,
        isCollapsed: false,
        teams: [1, 2, 3, 4, 5].map((tNum) => ({
          id: `team_${newDivNumber}_${tNum}_${Math.random().toString(36).substr(2, 4)}`,
          teamName: `Team ${tNum}`,
          teamTag: '',
          slots: Array.from({ length: 6 }, (_, sIdx) => ({
            slotIndex: sIdx,
            userId: null,
            displayName: '',
            roleName: '',
            className: '',
            note: '',
            isLeader: sIdx === 0,
            isChecked: false,
            skills: [],
          })),
        })),
      };
      this.divisions.push(newDiv);
    },

    // Xoá một Đoàn
    removeDivision(dIdx) {
      const div = this.divisions[dIdx];
      if (!div) return;

      // Trả các thành viên trong đoàn về pool
      if (div.teams) {
        div.teams.forEach((team) => {
          if (team.slots) {
            team.slots.forEach((slot) => {
              if (slot.userId && !slot.userId.startsWith('leader_') && !slot.userId.startsWith('ext_')) {
                this.attendancePool.push({
                  userId: slot.userId,
                  displayName: slot.displayName,
                  username: slot.displayName,
                  className: slot.className || slot.class,
                  roleName: slot.roleName || slot.role,
                  note: slot.note || '',
                });
              }
            });
          }
        });
      }

      this.divisions.splice(dIdx, 1);
    },

    // Đổi trạng thái thu gọn Đoàn
    toggleDivisionCollapse(dIdx) {
      if (this.divisions[dIdx]) {
        this.divisions[dIdx].isCollapsed = !this.divisions[dIdx].isCollapsed;
      }
    },

    // Thêm Team vào Đoàn
    addTeamToDivision(dIdx) {
      const div = this.divisions[dIdx];
      if (!div) return;
      const nextTeamNum = (div.teams?.length || 0) + 1;
      div.teams.push({
        id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        teamName: `Team ${nextTeamNum}`,
        teamTag: '',
        slots: Array.from({ length: 6 }, (_, sIdx) => ({
          slotIndex: sIdx,
          userId: null,
          displayName: '',
          roleName: '',
          className: '',
          note: '',
          isLeader: sIdx === 0,
          isChecked: false,
          skills: [],
        })),
      });
    },

    // Xoá Team khỏi Đoàn
    removeTeam(dIdx, tIdx) {
      const div = this.divisions[dIdx];
      if (!div || !div.teams || !div.teams[tIdx]) return;
      
      const team = div.teams[tIdx];
      if (team.slots) {
        team.slots.forEach((slot) => {
          if (slot.userId && !slot.userId.startsWith('leader_') && !slot.userId.startsWith('ext_')) {
            this.attendancePool.push({
              userId: slot.userId,
              displayName: slot.displayName,
              username: slot.displayName,
              className: slot.className || slot.class,
              roleName: slot.roleName || slot.role,
              note: slot.note || '',
            });
          }
        });
      }
      div.teams.splice(tIdx, 1);
    },

    // Xoá trắng tất cả thành viên trong Team
    clearTeam(dIdx, tIdx) {
      const team = this.divisions[dIdx]?.teams[tIdx];
      if (!team || !team.slots) return;

      team.slots.forEach((slot) => {
        if (slot.userId) {
          if (!slot.userId.startsWith('leader_') && !slot.userId.startsWith('ext_')) {
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
          slot.skills = [];
        }
      });
    },

    // Tải dữ liệu từ DB
    async fetchEventData(eventId) {
      this.loading = true;
      this.eventId = eventId;
      try {
        const [attRes, lineupRes] = await Promise.all([
          api.getAttendance(eventId),
          api.getLineup(eventId)
        ]);

        const attendances = attRes.data || [];

        // Store absent users
        this.absentUsers = attendances.filter((item) => item.status === 'absent');

        if (lineupRes.data && lineupRes.data.divisions && lineupRes.data.divisions.length > 0) {
          this.title = lineupRes.data.title || 'ĐỘI HÌNH BANG CHIẾN';
          this.divisions = lineupRes.data.divisions;
          
          // Đảm bảo mỗi slot có đủ mảng skills & isLeader
          this.divisions.forEach((div) => {
            if (div.isCollapsed === undefined) div.isCollapsed = false;
            if (div.teams) {
              div.teams.forEach((team) => {
                if (team.slots) {
                  team.slots.forEach((slot, sIdx) => {
                    slot.isLeader = (sIdx === 0);
                    if (!slot.skills) slot.skills = [];
                  });
                }
              });
            }
          });
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

      if (targetSlot.userId && !targetSlot.userId.startsWith('leader_')) {
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

    // Xóa vĩnh viễn đệ tử ngoại bang khỏi sơ đồ và danh sách chờ
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
                  slot.skills = [];
                }
              });
            }
          });
        }
      });
    },

    // Gán kỹ năng cho slot
    toggleSkillOnSlot({ dIdx, tIdx, sIdx, skill }) {
      const slot = this.divisions[dIdx]?.teams[tIdx]?.slots[sIdx];
      if (!slot) return;
      if (!slot.skills) slot.skills = [];

      const skillId = skill._id || skill.id;
      const existIdx = slot.skills.findIndex((s) => (s._id || s.id) === skillId || s.name === skill.name);

      if (existIdx !== -1) {
        slot.skills.splice(existIdx, 1);
      } else {
        slot.skills.push({
          id: skillId,
          name: skill.name,
          iconUrl: skill.iconUrl,
        });
      }
    },

    removeSkillFromSlot({ dIdx, tIdx, sIdx, skillId }) {
      const slot = this.divisions[dIdx]?.teams[tIdx]?.slots[sIdx];
      if (!slot || !slot.skills) return;
      slot.skills = slot.skills.filter((s) => (s._id || s.id) !== skillId && s.id !== skillId);
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
        skills: [...(targetSlot.skills || [])],
        isExternal: targetSlot.isExternal,
      };

      targetSlot.userId = srcSlot.userId;
      targetSlot.displayName = srcSlot.displayName;
      targetSlot.className = srcSlot.className || srcSlot.class || '';
      targetSlot.roleName = srcSlot.roleName || srcSlot.role || '';
      targetSlot.note = srcSlot.note || '';
      targetSlot.isChecked = srcSlot.isChecked || false;
      targetSlot.skills = [...(srcSlot.skills || [])];
      targetSlot.isExternal = srcSlot.isExternal;

      srcSlot.userId = tempTargetData.userId;
      srcSlot.displayName = tempTargetData.displayName;
      srcSlot.className = tempTargetData.className;
      srcSlot.roleName = tempTargetData.roleName;
      srcSlot.note = tempTargetData.note;
      srcSlot.isChecked = tempTargetData.isChecked;
      srcSlot.skills = tempTargetData.skills;
      srcSlot.isExternal = tempTargetData.isExternal;
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

      if (targetSlot.userId && !targetSlot.userId.startsWith('leader_')) {
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
        if (!slot.userId.startsWith('leader_') && !slot.userId.startsWith('ext_')) {
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
        slot.skills = [];
      }
    },

    toggleSlotCheck(dIdx, tIdx, sIdx) {
      const slot = this.divisions[dIdx]?.teams[tIdx]?.slots[sIdx];
      if (slot) {
        slot.isChecked = !slot.isChecked;
      }
    },

    async saveCurrentLineup() {
      try {
        await api.saveLineup(this.eventId, {
          title: this.title,
          divisions: this.divisions,
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