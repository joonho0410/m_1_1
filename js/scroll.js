/**
 * 스크롤 관련 인터랙션
 * - 헤더 배경 변경 (60px 이상)
 * - 스크롤 탑 버튼 표시 (300px 이상)
 * - 스크롤 애니메이션 (Intersection Observer, threshold 0.2)
 */

const HEADER_SCROLL_THRESHOLD = 60; // px
const SCROLL_TOP_THRESHOLD = 300; // px
const REVEAL_THRESHOLD = 0.2; // 요소의 20%가 보이면 애니메이션 시작

const initScrollEffects = () => {
  const header = document.querySelector('#header');
  const scrollTopButton = document.querySelector('#scroll-top');

  const handleScroll = () => {
    const { scrollY } = window;
    header.classList.toggle('scrolled', scrollY >= HEADER_SCROLL_THRESHOLD);
    scrollTopButton.classList.toggle('visible', scrollY >= SCROLL_TOP_THRESHOLD);
  };

  // passive: 스크롤 성능 최적화 (preventDefault를 호출하지 않는다고 브라우저에 알림)
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // 새로고침 시 이미 스크롤된 위치일 수 있으므로 1회 실행

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

const initRevealAnimation = () => {
  const revealElements = document.querySelectorAll('.reveal');

  // 구형 브라우저 대비: 지원하지 않으면 바로 보이게
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.add('is-visible');
        observer.unobserve(target); // 한 번 나타난 요소는 더 이상 관찰하지 않음
      });
    },
    { threshold: REVEAL_THRESHOLD }
  );

  revealElements.forEach((el) => observer.observe(el));
};
