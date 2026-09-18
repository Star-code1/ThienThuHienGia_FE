import { defineStore } from 'pinia';
import api from '../services/api';
import Swal from 'sweetalert2';

export const useSkillStore = defineStore('skill', {
  state: () => ({
    skills: [],
    loading: false,
  }),

  getters: {
    allSkills: (state) => state.skills,
  },

  actions: {
    async fetchSkills() {
      this.loading = true;
      try {
        const res = await api.getSkills();
        if (res.data && Array.isArray(res.data)) {
          this.skills = res.data;
          // Clear any legacy mock data from local storage
          localStorage.setItem('ttm_skills_db', JSON.stringify(this.skills));
        } else {
          this.skills = [];
        }
      } catch (err) {
        console.warn('Không kết nối được BE skill:', err);
        const savedLocal = localStorage.getItem('ttm_skills_db');
        if (savedLocal) {
          try {
            const parsed = JSON.parse(savedLocal);
            // Filter out any legacy mock skills with unsplash or mock ids
            this.skills = Array.isArray(parsed)
              ? parsed.filter((s) => !s.id?.startsWith('skill_thaicucdo') && !s.id?.startsWith('skill_nhuphongtube') && !s.id?.startsWith('skill_battu') && !s.id?.startsWith('skill_phongtuyet') && !s.id?.startsWith('skill_chuong') && !s.id?.startsWith('skill_camam') && !s.id?.startsWith('skill_phancam'))
              : [];
          } catch {
            this.skills = [];
          }
        } else {
          this.skills = [];
        }
      } finally {
        this.loading = false;
      }
    },

    async addSkill({ name, iconUrl, category, description }) {
      if (!name || !name.trim()) {
        Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập tên kỹ năng!' });
        return null;
      }
      if (!iconUrl) {
        Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng tải ảnh hoặc nhập URL ảnh kỹ năng!' });
        return null;
      }

      const newSkillData = {
        name: name.trim(),
        iconUrl: iconUrl.trim(),
        category: category || 'Chung',
        description: description || '',
      };

      try {
        let created;
        try {
          const res = await api.createSkill(newSkillData);
          created = res.data;
        } catch (e) {
          console.warn('Lưu vào BE thất bại, lưu cục bộ:', e);
          created = {
            id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            ...newSkillData,
            createdAt: new Date().toISOString(),
          };
        }

        this.skills.push(created);
        localStorage.setItem('ttm_skills_db', JSON.stringify(this.skills));

        Swal.fire({
          icon: 'success',
          title: 'Đã thêm kỹ năng!',
          text: `Kỹ năng "${newSkillData.name}" đã được lưu vào database.`,
          timer: 1500,
          showConfirmButton: false,
          background: '#12161f',
          color: '#e0b854',
        });
        return created;
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: error.message });
        return null;
      }
    },

    async deleteSkill(skillId) {
      try {
        try {
          await api.deleteSkill(skillId);
        } catch (e) {
          console.warn('Xoá trên BE thất bại, xoá cục bộ:', e);
        }

        this.skills = this.skills.filter((s) => (s._id || s.id) !== skillId);
        localStorage.setItem('ttm_skills_db', JSON.stringify(this.skills));

        Swal.fire({
          icon: 'success',
          title: 'Đã xoá!',
          text: 'Kỹ năng đã được xoá khỏi danh mục.',
          timer: 1200,
          showConfirmButton: false,
          background: '#12161f',
          color: '#e0b854',
        });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: error.message });
      }
    },
  },
});
