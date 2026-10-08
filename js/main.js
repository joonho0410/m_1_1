/**
 * 진입점
 * - defer로 로드되므로 이 시점에는 HTML 파싱이 끝나 DOM 요소를 바로 선택할 수 있다.
 * - 각 기능 모듈의 init 함수를 순서대로 호출한다.
 */

initTheme();
initNavigation();
initScrollEffects();
initRevealAnimation();
initProjects();
initContactForm();

document.querySelector('#current-year').textContent = new Date().getFullYear();
