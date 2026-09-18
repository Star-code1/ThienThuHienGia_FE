import { defineStore } from 'pinia';
import api from '../services/api';
import Swal from 'sweetalert2';

// Built-in default skills for Guild War tactics
export const DEFAULT_SKILLS = [
  {
    id: 'skill_thaicucdo',
    name: 'Thái Cực Đồ',
    iconUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=80&auto=format&fit=crop&q=60',
    category: 'Tuyệt Kỹ / Phòng Thủ',
    description: 'Tạo trận đồ thái cực giảm sát thương và phản đòn',
  },
  {
    id: 'skill_nhuphongtube',
    name: 'Như Phong Tự Bế',
    iconUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=80&auto=format&fit=crop&q=60',
    category: 'Khống Chế',
    description: 'Chặn đường và cản trở di chuyển kẻ địch',
  },
  {
    id: 'skill_battu',
    name: 'Bất Tử / Bất Diệt',
    iconUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=80&auto=format&fit=crop&q=60',
    category: 'Sinh Tồn',
    description: 'Miễn tử trong thời gian ngắn khi nhận đòn chí mạng',
  },
  {
    id: 'skill_phongtuyet',
    name: 'Phong Tuyết Kinh Đào',
    iconUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=80&auto=format&fit=crop&q=60',
    category: 'Sát Thương / Khống Chế',
    description: 'Gây bão tuyết đóng băng và làm chậm diện rộng',
  },
  {
    id: 'skill_chuong',
    name: 'Chuông Trấn Hồn',
    iconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&auto=format&fit=crop&q=60',
    category: 'Hỗ Trợ',
    description: 'Hóa giải khống chế toàn đội và tăng kháng hiệu ứng',
  },
  {
    id: 'skill_camam',
    name: 'Cầm Âm Trợ Lực',
    iconUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&auto=format&fit=crop&q=60',
    category: 'Hồi Máu / Buff',
    description: 'Tăng cường trị liệu và hồi phục năng lượng',
  },
  {
    id: 'skill_phancam',
    name: 'Phần Cầm Tuyệt Sát',
    iconUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=80&auto=format&fit=crop&q=60',
    category: 'Tuyệt Kỹ / Sát Thương',
    description: 'Bộc phá sát thương diện rộng dọn dẹp giao tranh',
  }
];

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
        if (res.data && res.data.length > 0) {
          this.skills = res.data;
        } else {
          // Lấy từ localStorage hoặc dùng DEFAULT_SKILLS
          const savedLocal = localStorage.getItem('ttm_skills_db');
          if (savedLocal) {
            this.skills = JSON.parse(savedLocal);
          } else {
            this.skills = [...DEFAULT_SKILLS];
            localStorage.setItem('ttm_skills_db', JSON.stringify(this.skills));
          }
        }
      } catch (err) {
        console.warn('Không kết nối được BE skill, fallback về localStorage:', err);
        const savedLocal = localStorage.getItem('ttm_skills_db');
        if (savedLocal) {
          this.skills = JSON.parse(savedLocal);
        } else {
          this.skills = [...DEFAULT_SKILLS];
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
