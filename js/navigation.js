/**
 * 네비게이션: 햄버거 메뉴 토글 + 부드러운 스크롤
 */

const initNavigation = () => {
  const hamburger = document.querySelector('#hamburger');
  const navMenu = document.querySelector('#nav-menu');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  // 메뉴 열림 여부를 버튼의 접근성 속성에도 반영
  const syncMenuA11y = () => {
    const isOpen = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  };

  const closeMenu = () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    syncMenuA11y();
  };

  // 1) 햄버거 메뉴: 클릭할 때마다 active 클래스를 토글
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    syncMenuA11y();
  });

  // 2) 부드러운 스크롤: 앵커의 기본 점프 동작을 막고 scrollIntoView로 이동
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', targetId); // 주소창 해시도 갱신
      closeMenu(); // 모바일에서 메뉴 클릭 후 메뉴 닫기
    });
  });

  // 태블릿 이상으로 화면이 커지면 열린 모바일 메뉴 상태를 초기화
  window.matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);
};
