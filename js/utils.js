/**
 * 공통 유틸리티
 * - 여러 파일에서 함께 쓰는 작은 헬퍼 함수 모음
 */

// 외부 데이터(GitHub 저장소 설명 등)를 innerHTML에 넣기 전에 HTML 특수문자를 이스케이프한다.
// → 저장소 설명에 <script> 같은 문자열이 있어도 태그로 해석되지 않도록 (XSS 방지)
const escapeHTML = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// 로컬스토리지는 시크릿 모드/차단 환경에서 예외를 던질 수 있으므로 안전하게 감싼다.
const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // 저장에 실패해도 화면 동작에는 문제가 없으므로 무시
    }
  },
};
