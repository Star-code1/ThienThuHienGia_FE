import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LineupView from '../views/LineupView.vue';
import ScheduleView from '../views/ScheduleView.vue';
import RosterView from '../views/RosterView.vue';
import StatsView from '../views/StatsView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Trang Chủ - Thiên Thư Môn' }
  },
  {
    path: '/lineup',
    name: 'Lineup',
    component: LineupView,
    meta: { title: 'Sơ Đồ Bang Chiến - Thiên Thư Môn' }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: ScheduleView,
    meta: { title: 'Lịch Bang Chiến - Thiên Thư Môn' }
  },
  {
    path: '/roster',
    name: 'Roster',
    component: RosterView,
    meta: { title: 'Danh Sách Bang Hội - Thiên Thư Môn' }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsView,
    meta: { title: 'Thống Kê Điểm Danh - Thiên Thư Môn' }
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

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
