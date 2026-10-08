/**
 * Contact 폼 유효성 검사
 * 흐름: input/submit 이벤트 → formState(값·에러·touched) 변경 → renderForm()
 *       → 입력 필드 근처 에러 메시지 표시/숨김, 성공 메시지 표시
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 필드별 검증 규칙: 값을 받아 에러 메시지(문자열)를 반환, 문제가 없으면 빈 문자열
const validators = {
  name: (value) => (value.trim() ? '' : '이름을 입력해 주세요.'),
  email: (value) => {
    if (!value.trim()) return '이메일을 입력해 주세요.';
    if (!EMAIL_PATTERN.test(value.trim())) return '올바른 이메일 형식이 아닙니다. (예: you@example.com)';
    return '';
  },
  message: (value) => (value.trim() ? '' : '메시지를 입력해 주세요.'),
};

const FIELD_NAMES = Object.keys(validators); // ['name', 'email', 'message']

const createInitialFormState = () => ({
  values: { name: '', email: '', message: '' },
  errors: { name: '', email: '', message: '' },
  touched: { name: false, email: false, message: false }, // 사용자가 건드린 필드만 에러 표시
  isSubmitted: false,
});

let formState = createInitialFormState();

const renderForm = () => {
  const { values, errors, touched, isSubmitted } = formState;

  FIELD_NAMES.forEach((field) => {
    const input = document.querySelector(`#${field}`);
    const errorEl = document.querySelector(`#${field}-error`);
    const visibleError = touched[field] ? errors[field] : '';

    input.value = values[field];
    errorEl.textContent = visibleError;
    input.classList.toggle('invalid', Boolean(visibleError));
    input.setAttribute('aria-invalid', String(Boolean(visibleError)));
  });

  document.querySelector('#form-success').textContent = isSubmitted
    ? '메시지가 성공적으로 전송되었습니다. 감사합니다!'
    : '';
};

const validateField = (field, value) => validators[field](value);

const initContactForm = () => {
  const form = document.querySelector('#contact-form');

  // input 이벤트: 입력할 때마다 값과 에러 상태를 갱신 (이벤트 위임 - 폼 하나에만 등록)
  form.addEventListener('input', (event) => {
    const { name, value } = event.target;
    if (!FIELD_NAMES.includes(name)) return;

    formState = {
      ...formState,
      values: { ...formState.values, [name]: value },
      errors: { ...formState.errors, [name]: validateField(name, value) },
      isSubmitted: false,
    };
    renderForm();
  });

  // blur(포커스 아웃) 시 해당 필드를 touched로 표시 → 이때부터 에러 노출
  // blur는 버블링되지 않으므로 focusout 사용
  form.addEventListener('focusout', (event) => {
    const { name } = event.target;
    if (!FIELD_NAMES.includes(name)) return;

    formState = { ...formState, touched: { ...formState.touched, [name]: true } };
    renderForm();
  });

  // submit 이벤트: 기본 동작(페이지 새로고침) 방지 후 전체 검증
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const { values } = formState;
    const errors = Object.fromEntries(
      FIELD_NAMES.map((field) => [field, validateField(field, values[field])])
    );
    const hasError = Object.values(errors).some(Boolean);

    if (hasError) {
      formState = {
        ...formState,
        errors,
        touched: { name: true, email: true, message: true },
        isSubmitted: false,
      };
      renderForm();
      // 첫 번째 에러 필드로 포커스 이동
      const firstInvalid = FIELD_NAMES.find((field) => errors[field]);
      document.querySelector(`#${firstInvalid}`).focus();
      return;
    }

    // 실제 전송은 하지 않고(보너스 과제 범위), 폼을 초기화한 뒤 성공 메시지를 표시
    formState = { ...createInitialFormState(), isSubmitted: true };
    renderForm();
  });

  renderForm();
};
