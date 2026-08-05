import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('ttm_user') || 'null'),
    token: localStorage.getItem('ttm_token') || '',
    loading: false,
    error: null,
    guildMemberCount: 120,
    guildMembers: [],
    showLoginPromptModal: false
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    canEdit: (state) => Boolean(state.user && state.user.canEdit)
  },

  actions: {
    /**
     * Redirect user to Discord OAuth2 Authorize Page
     */
    loginWithDiscord() {
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID || '1518269619079610482';
      const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI || `${window.location.origin}/auth/callback`;
      const scope = encodeURIComponent('identify guilds');

      const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${scope}`;

      window.location.href = discordAuthUrl;
    },

    /**
     * Send OAuth code to Backend
     */
    async handleCallback(code) {
      this.loading = true;
      this.error = null;
      const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI || `${window.location.origin}/auth/callback`;

      try {
        const response = await axios.post('/api/auth/discord', { code, redirectUri });

        if (response.data && response.data.success) {
          this.token = response.data.token;
          this.user = response.data.user;

          localStorage.setItem('ttm_token', this.token);
          localStorage.setItem('ttm_user', JSON.stringify(this.user));

          this.loading = false;
          return { success: true, user: this.user };
        } else {
          this.error = response.data?.message || 'Đăng nhập thất bại.';
          this.loading = false;
          return { success: false, message: this.error };
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        const errMsg = err.response?.data?.message || 'Có lỗi xảy ra khi xác thực tài khoản với Discord Server.';
        this.error = errMsg;
        this.loading = false;
        return { success: false, message: errMsg };
      }
    },

    /**
     * Fetch current user profile
     */
    async fetchUser() {
      if (!this.token) return;

      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        if (response.data && response.data.user) {
          this.user = response.data.user;
          localStorage.setItem('ttm_user', JSON.stringify(this.user));
        }
      } catch (err) {
        if (err.response?.status === 401) {
          this.logout();
        }
      }
    },

    /**
     * Fetch all members having Bang Chúng role in Discord Server
     */
    async fetchGuildStats() {
      try {
        const res = await axios.get('/api/guild/members');
        if (res.data && res.data.success) {
          this.guildMemberCount = res.data.totalBangChungMembers || res.data.members?.length || 120;
          if (res.data.members && res.data.members.length > 0) {
            this.guildMembers = res.data.members;
          }
        }
      } catch (err) {
        // Keep default fallback
      }
    },

    /**
     * Open Login Required Modal
     */
    openLoginPrompt() {
      this.showLoginPromptModal = true;
    },

    closeLoginPrompt() {
      this.showLoginPromptModal = false;
    },

    /**
     * Logout
     */
    logout() {
      this.user = null;
      this.token = '';
      this.error = null;
      localStorage.removeItem('ttm_token');
      localStorage.removeItem('ttm_user');
    }
  }
});
