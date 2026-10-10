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
        note: '',
        isCollapsed: false,
        teams: [1, 2, 3, 4, 5].map((tNum) => ({
          id: `team_${divNumber}_${tNum}_${Math.random().toString(36).substr(2, 4)}`,
          teamName: `Team ${tNum}`,
          teamTag: '',
          note: '',
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
        note: '',
        isCollapsed: false,
        teams: [1, 2, 3, 4, 5].map((tNum) => ({
          id: `team_${newDivNumber}_${tNum}_${Math.random().toString(36).substr(2, 4)}`,
          teamName: `Team ${tNum}`,
          teamTag: '',
          note: '',
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
        note: '',
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

    setSlotNote(dIdx, tIdx, sIdx, note) {
      const slot = this.divisions[dIdx]?.teams[tIdx]?.slots[sIdx];
      if (slot) {
        slot.note = note || '';
      }
    },

    setTeamNote(dIdx, tIdx, note) {
      const team = this.divisions[dIdx]?.teams[tIdx];
      if (team) {
        team.note = note || '';
      }
    },

    setDivisionNote(dIdx, note) {
      const div = this.divisions[dIdx];
      if (div) {
        div.note = note || '';
      }
    },

    updateNotesBatch({ dIdx, tIdx, sIdx, memberNote, teamNote, divisionNote }) {
      if (dIdx !== undefined && this.divisions[dIdx]) {
        if (divisionNote !== undefined) {
          this.divisions[dIdx].note = divisionNote;
        }
        if (tIdx !== undefined && this.divisions[dIdx].teams?.[tIdx]) {
          if (teamNote !== undefined) {
            this.divisions[dIdx].teams[tIdx].note = teamNote;
          }
          if (sIdx !== undefined && this.divisions[dIdx].teams[tIdx].slots?.[sIdx]) {
            if (memberNote !== undefined) {
              this.divisions[dIdx].teams[tIdx].slots[sIdx].note = memberNote;
            }
          }
        }
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

    // Phân tích và tạo dữ liệu đối soát trước khi kế thừa đội hình từ trận A sang trận B
    async previewInheritLineup({ sourceEventId, includeExternal = false }) {
      if (!sourceEventId) return null;

      const [sourceLineupRes, targetAttRes] = await Promise.all([
        api.getLineup(sourceEventId),
        this.eventId ? api.getAttendance(this.eventId) : Promise.resolve({ data: [] }),
      ]);

      const sourceLineup = sourceLineupRes.data;
      if (!sourceLineup || !sourceLineup.divisions || sourceLineup.divisions.length === 0) {
        return null;
      }

      const targetAttendances = targetAttRes.data || [];
      const presentUsers = targetAttendances.filter((a) => a.status === 'present');
      const absentUsers = targetAttendances.filter((a) => a.status === 'absent');

      const presentMap = new Map(presentUsers.map((u) => [u.userId, u]));
      const absentMap = new Map(absentUsers.map((u) => [u.userId, u]));

      const matchedList = [];
      const skippedList = [];
      const usedUserIds = new Set();

      sourceLineup.divisions.forEach((div, dIdx) => {
        if (div.teams) {
          div.teams.forEach((team, tIdx) => {
            if (team.slots) {
              team.slots.forEach((slot, sIdx) => {
                const sourceUserId = slot.userId;
                if (!sourceUserId) return;

                const location = `${div.divisionName || `Đoàn ${dIdx + 1}`} - ${team.teamName || `Team ${tIdx + 1}`} (Slot ${sIdx + 1})`;

                if (sourceUserId.startsWith('leader_')) {
                  // Leader placeholder
                  return;
                }

                if (sourceUserId.startsWith('ext_') || slot.isExternal) {
                  if (includeExternal) {
                    matchedList.push({
                      userId: sourceUserId,
                      displayName: slot.displayName || 'Khách mời',
                      className: slot.className || slot.class || 'Chưa rõ',
                      location,
                      isExternal: true,
                    });
                  } else {
                    skippedList.push({
                      userId: sourceUserId,
                      displayName: slot.displayName || 'Khách mời',
                      className: slot.className || slot.class || 'Chưa rõ',
                      location,
                      statusText: 'Đệ tử ngoại bang (bỏ qua)',
                    });
                  }
                  return;
                }

                if (presentMap.has(sourceUserId)) {
                  const pUser = presentMap.get(sourceUserId);
                  matchedList.push({
                    userId: sourceUserId,
                    displayName: pUser.displayName || pUser.username || slot.displayName,
                    className: pUser.className || pUser.class || slot.className || slot.class,
                    location,
                  });
                  usedUserIds.add(sourceUserId);
                } else if (absentMap.has(sourceUserId)) {
                  const aUser = absentMap.get(sourceUserId);
                  skippedList.push({
                    userId: sourceUserId,
                    displayName: aUser.displayName || aUser.username || slot.displayName,
                    className: aUser.className || aUser.class || slot.className || slot.class,
                    location,
                    statusText: 'Báo bận',
                  });
                } else {
                  skippedList.push({
                    userId: sourceUserId,
                    displayName: slot.displayName,
                    className: slot.className || slot.class || 'Chưa rõ',
                    location,
                    statusText: 'Chưa vote / Không tham gia',
                  });
                }
              });
            }
          });
        }
      });

      const poolList = presentUsers
        .filter((u) => !usedUserIds.has(u.userId))
        .map((u) => ({
          userId: u.userId,
          displayName: u.displayName || u.username,
          className: u.className || u.class,
        }));

      return {
        matchedCount: matchedList.length,
        skippedCount: skippedList.length,
        poolCount: poolList.length,
        matchedList,
        skippedList,
        poolList,
        sourceDivisions: sourceLineup.divisions,
        sourceTitle: sourceLineup.title,
      };
    },

    // Áp dụng kế thừa đội hình từ trận A sang trận B
    async applyInheritLineup({ sourceEventId, includeSkills = true, includeExternal = false }) {
      if (!sourceEventId) {
        throw new Error('Chưa chọn chiến kỳ nguồn để kế thừa.');
      }
      if (!this.eventId) {
        throw new Error('Chưa chọn chiến kỳ đích hiện tại.');
      }

      const [sourceLineupRes, targetAttRes] = await Promise.all([
        api.getLineup(sourceEventId),
        api.getAttendance(this.eventId),
      ]);

      const sourceLineup = sourceLineupRes.data;
      if (!sourceLineup || !sourceLineup.divisions || sourceLineup.divisions.length === 0) {
        throw new Error('Chiến kỳ nguồn không có sơ đồ đội hình hợp lệ.');
      }

      const targetAttendances = targetAttRes.data || [];
      const presentUsers = targetAttendances.filter((a) => a.status === 'present');
      const absentUsers = targetAttendances.filter((a) => a.status === 'absent');

      const presentMap = new Map(presentUsers.map((u) => [u.userId, u]));
      const usedUserIds = new Set();

      // Deep clone divisions từ trận A
      const clonedDivisions = JSON.parse(JSON.stringify(sourceLineup.divisions));

      clonedDivisions.forEach((div, dIdx) => {
        if (div.isCollapsed === undefined) div.isCollapsed = false;
        if (div.teams) {
          div.teams.forEach((team, tIdx) => {
            if (team.slots) {
              team.slots.forEach((slot, sIdx) => {
                slot.slotIndex = sIdx;
                slot.isLeader = sIdx === 0;
                if (!slot.skills) slot.skills = [];

                const sourceUserId = slot.userId;

                if (!sourceUserId) {
                  slot.userId = null;
                  slot.displayName = '';
                  slot.className = '';
                  slot.roleName = '';
                  slot.note = '';
                  slot.isChecked = false;
                  slot.isExternal = false;
                  slot.skills = [];
                  return;
                }

                if (sourceUserId.startsWith('leader_')) {
                  slot.isChecked = false;
                  if (!includeSkills) slot.skills = [];
                  return;
                }

                if (sourceUserId.startsWith('ext_') || slot.isExternal) {
                  if (includeExternal) {
                    slot.isChecked = false;
                    if (!includeSkills) slot.skills = [];
                  } else {
                    slot.userId = null;
                    slot.displayName = '';
                    slot.className = '';
                    slot.roleName = '';
                    slot.note = '';
                    slot.isChecked = false;
                    slot.isExternal = false;
                    slot.skills = [];
                  }
                  return;
                }

                // Thành viên Discord chuẩn
                if (presentMap.has(sourceUserId)) {
                  const pUser = presentMap.get(sourceUserId);
                  slot.userId = pUser.userId;
                  slot.displayName = pUser.displayName || pUser.username || slot.displayName;
                  slot.className = pUser.className || pUser.class || slot.className || slot.class;
                  slot.roleName = pUser.roleName || pUser.role || slot.roleName || '';
                  slot.note = slot.note || '';
                  slot.isChecked = false;
                  slot.isExternal = false;
                  if (!includeSkills) {
                    slot.skills = [];
                  }
                  usedUserIds.add(sourceUserId);
                } else {
                  // Thành viên ở trận A bận hoặc chưa vote ở trận B -> Để trống slot
                  slot.userId = null;
                  slot.displayName = '';
                  slot.className = '';
                  slot.roleName = '';
                  slot.note = '';
                  slot.isChecked = false;
                  slot.isExternal = false;
                  slot.skills = [];
                }
              });
            }
          });
        }
      });

      this.divisions = clonedDivisions;
      this.attendancePool = presentUsers.filter((u) => !usedUserIds.has(u.userId));
      this.absentUsers = absentUsers;

      Swal.fire({
        icon: 'success',
        title: 'Kế thừa thành công!',
        html: `Đã sao chép đội hình từ chiến kỳ trước.<br>Đã gán <b>${usedUserIds.size}</b> thành viên vào sơ đồ và chuyển <b>${this.attendancePool.length}</b> đệ tử vào Hàng Chờ.`,
        timer: 3000,
        showConfirmButton: true,
        confirmButtonText: 'Đã Hiểu',
        confirmButtonColor: '#3b82f6',
        background: '#12161f',
        color: '#ffffff',
      });
    },
  },
});