// Shared navigation + simple auth state
const ESGFIT_TOTAL_QUESTIONS = 61;

function isDiagnoseComplete() {
  try {
    const a = JSON.parse(localStorage.getItem('esgfit_answers') || '{"P":{},"E":{},"S":{},"G":{}}');
    const count = ['P','E','S','G'].reduce((n, k) => n + Object.keys(a[k] || {}).length, 0);
    return count >= ESGFIT_TOTAL_QUESTIONS;
  } catch { return false; }
}

function navHTML(active) {
  const isSub = active === 'sub';
  const homeHref = isSub ? '../index.html' : 'index.html';
  const diagHref = isSub ? 'diagnose.html' : 'pages/diagnose.html';
  const newsHref = isSub ? 'news.html' : 'pages/news.html';
  const aboutHref = isSub ? 'about.html' : 'pages/about.html';
  const loginHref = isSub ? 'login.html' : 'pages/login.html';
  return `
  <nav class="nav">
    <div class="nav-inner">
      <a href="${homeHref}" class="logo">
        <span class="logo-mark">E</span>
        <span>ESGFit</span>
      </a>
      <ul class="nav-links">
        <li><a href="${homeHref}">홈</a></li>
        <li><a href="${diagHref}">ESG 진단</a></li>
        <li><a href="${newsHref}">ESG 뉴스</a></li>
        <li><a href="${aboutHref}">서비스 소개</a></li>
      </ul>
      <div class="nav-actions" id="navActions">
        <a href="${loginHref}" class="btn btn-ghost">로그인</a>
        <a href="${loginHref}?tab=signup" class="btn btn-primary">무료로 시작</a>
      </div>
    </div>
  </nav>`;
}

function footerHTML() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="logo">
            <span class="logo-mark">E</span>
            <span>ESGFit</span>
          </div>
          <p>기업의 ESG 경영 전환을 돕는 AI 기반 진단·컨설팅 플랫폼.
          P·E·S·G 4개 영역 정밀 진단과 실질적 개선안을 제공합니다.</p>
        </div>
        <div class="footer-col">
          <h5>서비스</h5>
          <ul>
            <li><a href="#">ESG 진단</a></li>
            <li><a href="#">개선 컨설팅</a></li>
            <li><a href="#">공시 리포트</a></li>
            <li><a href="#">API 연동</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>리소스</h5>
          <ul>
            <li><a href="#">ESG 뉴스</a></li>
            <li><a href="#">가이드북</a></li>
            <li><a href="#">사례 연구</a></li>
            <li><a href="#">블로그</a></li>
          </ul>
        </div>
        
        </div>
      </div>
      <div class="footer-bottom">
        © 2026 ESGFit. All rights reserved.
      </div>
    </div>
  </footer>`;
}

function renderLayout(active) {
  const navRoot = document.getElementById('navRoot');
  const footerRoot = document.getElementById('footerRoot');
  if (navRoot) navRoot.innerHTML = navHTML(active);
  if (footerRoot) footerRoot.innerHTML = footerHTML();

  const user = JSON.parse(localStorage.getItem('esgfit_user') || 'null');
  if (user) {
    const actions = document.getElementById('navActions');
    if (actions) {
      const isSub = active === 'sub';
      const diagHref = isSub ? 'diagnose.html' : 'pages/diagnose.html';
      const resultsHref = isSub ? 'results.html' : 'pages/results.html';
      const complete = isDiagnoseComplete();
      const myDiagHref = complete ? resultsHref : diagHref;
      const myDiagLabel = complete ? '내 진단 결과' : '진단 이어하기';
      actions.innerHTML = `
        <a href="${myDiagHref}" class="btn btn-ghost">${myDiagLabel}</a>
        <button class="btn btn-outline" id="logoutBtn">${user.name || user.email} · 로그아웃</button>`;
      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('esgfit_user');
        location.reload();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const scope = document.body.dataset.scope || 'root';
  renderLayout(scope);
});
