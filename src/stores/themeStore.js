import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // Saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('ttm_theme');
  const theme = ref(savedTheme || 'dark');

  const applyTheme = (newTheme) => {
    theme.value = newTheme;
    localStorage.setItem('ttm_theme', newTheme);
    const root = document.documentElement;
    const body = document.body;

    if (newTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    }
  };

  const initTheme = () => {
    applyTheme(theme.value);
  };

  const toggleTheme = () => {
    const nextTheme = theme.value === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  };

  return {
    theme,
    initTheme,
    toggleTheme,
    setTheme: applyTheme
  };
});
