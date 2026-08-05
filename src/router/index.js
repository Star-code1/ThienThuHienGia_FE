import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LineupView from '../views/LineupView.vue';
import ScheduleView from '../views/ScheduleView.vue';
import RosterView from '../views/RosterView.vue';
import StatsView from '../views/StatsView.vue';
import AuthCallbackView from '../views/AuthCallbackView.vue';
import ProfileView from '../views/ProfileView.vue';
import MatchAnalysisView from '../views/MatchAnalysisView.vue';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Trang Chủ - Thiên Thư Môn', requiresAuth: false }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallbackView,
    meta: { title: 'Xác Thực Discord - Thiên Thư Môn', requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { title: 'Hồ Sơ Đệ Tử - Thiên Thư Môn', requiresAuth: true }
  },
  {
    path: '/lineup',
    name: 'Lineup',
    component: LineupView,
    meta: { title: 'Sơ Đồ Bang Chiến - Thiên Thư Môn', requiresAuth: true }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: ScheduleView,
    meta: { title: 'Lịch Bang Chiến - Thiên Thư Môn', requiresAuth: true }
  },
  {
    path: '/match-analysis',
    name: 'MatchAnalysis',
    component: MatchAnalysisView,
    meta: { title: 'Dữ Liệu Trận Đấu - Thiên Thư Môn', requiresAuth: true }
  },
  {
    path: '/roster',
    name: 'Roster',
    component: RosterView,
    meta: { title: 'Danh Sách Bang Hội - Thiên Thư Môn', requiresAuth: true }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsView,
    meta: { title: 'Thống Kê Điểm Danh - Thiên Thư Môn', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    authStore.openLoginPrompt();
    next({ name: 'Home' });
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
