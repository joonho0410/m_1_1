/**
 * Projects 섹션 - GitHub API 연동
 * 흐름: 페이지 로드/재시도 click → fetchProjects()
 *       → projectsState.status 변경 (loading → success | empty | error)
 *       → renderProjects()가 상태에 맞는 UI를 그림
 */

const GITHUB_USERNAME = 'joonho0410';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// 상태: status는 'loading' | 'success' | 'empty' | 'error' 중 하나
const projectsState = {
  status: 'loading',
  projects: [],
  errorMessage: '',
};

// 상태 변경 함수: 바뀐 부분만 합친 뒤 항상 다시 렌더링한다. (React의 setState와 같은 역할)
const setProjectsState = (nextState) => {
  Object.assign(projectsState, nextState);
  renderProjects();
};

// 저장소 객체 1개 → 카드 HTML 문자열 (구조분해 할당 + 템플릿 리터럴)
const createProjectCard = ({ name, description, html_url, language, stargazers_count, updated_at }) => {
  const updatedDate = new Date(updated_at).toLocaleDateString('ko-KR');

  return `
    <article class="project-card">
      <h3 class="project-title">
        <a href="${escapeHTML(html_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(name)}</a>
      </h3>
      <p class="project-desc">${escapeHTML(description ?? '설명이 없습니다.')}</p>
      <div class="project-meta">
        ${language ? `<span class="project-lang">${escapeHTML(language)}</span>` : ''}
        <span>⭐ ${stargazers_count}</span>
        <span>업데이트 ${updatedDate}</span>
      </div>
    </article>
  `;
};

// 렌더링: 현재 상태에 따라 상태 메시지 영역 / 카드 그리드 영역을 채운다.
const renderProjects = () => {
  const statusEl = document.querySelector('#projects-status');
  const gridEl = document.querySelector('#projects-grid');
  const { status, projects, errorMessage } = projectsState;

  statusEl.innerHTML = '';
  gridEl.innerHTML = '';

  if (status === 'loading') {
    statusEl.innerHTML = `
      <div class="status-message">
        <div class="spinner" aria-hidden="true"></div>
        <p>로딩 중...</p>
      </div>
    `;
    return;
  }

  if (status === 'error') {
    statusEl.innerHTML = `
      <div class="status-message error">
        <p>프로젝트를 불러올 수 없습니다.</p>
        <p>${escapeHTML(errorMessage)}</p>
        <button type="button" class="btn btn-primary" id="projects-retry">다시 시도</button>
      </div>
    `;
    // innerHTML로 새로 만든 버튼이므로 렌더링할 때마다 이벤트를 연결한다.
    document.querySelector('#projects-retry').addEventListener('click', fetchProjects);
    return;
  }

  if (status === 'empty') {
    statusEl.innerHTML = `
      <div class="status-message">
        <p>표시할 프로젝트가 없습니다.</p>
      </div>
    `;
    return;
  }

  // success: map으로 데이터 배열 → HTML 문자열 배열 → join으로 하나의 문자열
  gridEl.innerHTML = projects.map(createProjectCard).join('');
};

// HTTP 상태 코드별로 사용자에게 보여줄 에러 메시지
const getErrorMessage = (status) => {
  if (status === 403 || status === 429) {
    return 'GitHub API 요청 한도(시간당 60회)를 초과했습니다. 잠시 후 다시 시도해 주세요.';
  }
  if (status === 404) {
    return 'GitHub 사용자를 찾을 수 없습니다.';
  }
  return `서버 응답 오류가 발생했습니다. (HTTP ${status})`;
};

// 비동기 요청: fetch + async/await + try/catch
const fetchProjects = async () => {
  setProjectsState({ status: 'loading', errorMessage: '' });

  try {
    const response = await fetch(GITHUB_API_URL);

    // fetch는 4xx/5xx 응답에서도 reject되지 않으므로 직접 확인해서 throw
    if (!response.ok) {
      throw new Error(getErrorMessage(response.status));
    }

    const repos = await response.json();
    // filter: Fork한 저장소는 제외하고 내가 만든 저장소만 표시
    const ownRepos = repos.filter(({ fork }) => !fork);

    setProjectsState({
      status: ownRepos.length > 0 ? 'success' : 'empty',
      projects: ownRepos,
    });
  } catch (error) {
    // 네트워크 끊김(TypeError) 또는 위에서 throw한 에러가 모두 여기로 온다.
    const message = error instanceof TypeError ? '네트워크 연결을 확인해 주세요.' : error.message;
    setProjectsState({ status: 'error', projects: [], errorMessage: message });
  }
};

const initProjects = () => {
  fetchProjects();
};
