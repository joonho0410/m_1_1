/**
 * 다크 모드
 * 흐름: 토글 버튼 click → themeState.theme 변경 → renderTheme() → <html data-theme> 변경
 *       → CSS 변수가 [data-theme="dark"] 값으로 바뀌어 전체 화면 스타일 변경
 */

const THEME_STORAGE_KEY = 'theme';

// 상태: 저장된 값이 있으면 사용, 없으면 라이트 모드
const themeState = {
  theme: storage.get(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light',
};

// 렌더링: 상태를 화면(DOM)에 반영
const renderTheme = () => {
  const { theme } = themeState;
  const isDark = theme === 'dark';
  const toggleButton = document.querySelector('#theme-toggle');
  const icon = toggleButton.querySelector('.theme-icon');

  document.documentElement.setAttribute('data-theme', theme);
  icon.textContent = isDark ? '☀️' : '🌙';
  toggleButton.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
};

// 상태 변경: 상태를 바꾸고 → 저장하고 → 다시 렌더링
const setTheme = (nextTheme) => {
  themeState.theme = nextTheme;
  storage.set(THEME_STORAGE_KEY, nextTheme);
  renderTheme();
};

const initTheme = () => {
  renderTheme(); // 새로고침 직후 저장된 테마 반영

  document.querySelector('#theme-toggle').addEventListener('click', () => {
    setTheme(themeState.theme === 'dark' ? 'light' : 'dark');
  });
};
