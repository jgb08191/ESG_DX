// ESG 경영 자가진단 체크리스트 (K-ESG · KSA · e-ESG · 중진공 통합)
// 총 61개 항목: P=5, E=17, S=22, G=17
const QUESTIONS = {
  P: {
    title: '정보공시 (Disclosure)',
    desc: 'ESG 정보의 공시 형식, 내용의 충실도, 제3자 검증 수준을 평가합니다. (5개 항목)',
    items: [
      { code: 'P-1-1', cat: 'ESG 정보공시 형식', name: 'ESG 정보공시 방식',
        q: 'ESG 관련 정보를 통합보고서, 지속가능경영보고서 등의 형태로 공시하고 있습니까?' },
      { code: 'P-1-2', cat: 'ESG 정보공시 형식', name: 'ESG 정보공시 주기',
        q: 'ESG 정보를 정기적(연 1회 이상)으로 공시하고 있습니까?' },
      { code: 'P-1-3', cat: 'ESG 정보공시 형식', name: 'ESG 정보공시 범위',
        q: 'ESG 정보공시 시 종속기업 및 관계사를 포함한 범위로 공시합니까?' },
      { code: 'P-2-1', cat: 'ESG 정보공시 내용', name: 'ESG 핵심이슈 및 KPI',
        q: '중대성 평가를 통해 ESG 핵심이슈를 도출하고 KPI를 설정·공시하고 있습니까?' },
      { code: 'P-3-1', cat: 'ESG 정보공시 검증', name: 'ESG 정보공시 검증',
        q: '공시된 ESG 정보에 대해 제3자 검증을 받고 있습니까?' },
    ]
  },
  E: {
    title: '환경 (Environmental)',
    desc: '온실가스·에너지·용수·폐기물·오염물질·원재료·유해물질 등 환경경영 전반을 진단합니다. (17개 항목)',
    items: [
      { code: 'E-1-1', cat: '환경경영 목표', name: '환경경영 목표 수립',
        q: '환경경영 관련 단기·중장기 목표를 수립하고 있습니까?' },
      { code: 'E-1-2', cat: '환경경영 추진체계', name: '환경경영 추진체계',
        q: '환경경영 전담조직 또는 담당자를 지정·운영하고 있습니까?' },
      { code: 'E-2-1', cat: '온실가스', name: '온실가스 배출량 (Scope1·2)',
        q: '사업장 직·간접 온실가스 배출량을 산정·관리하고 있습니까?' },
      { code: 'E-2-2', cat: '온실가스', name: '온실가스 배출량 (Scope3)',
        q: '공급망 등 기타 간접 온실가스 배출량을 파악하고 있습니까?' },
      { code: 'E-2-3', cat: '온실가스', name: '온실가스 배출량 검증',
        q: '온실가스 배출량에 대해 제3자 검증을 받고 있습니까?' },
      { code: 'E-3-1', cat: '에너지', name: '에너지 사용량',
        q: '에너지 총 사용량(전력, 가스, 유류 등)을 정량적으로 관리하고 있습니까?' },
      { code: 'E-3-2', cat: '에너지', name: '재생에너지 사용 비율',
        q: '태양광, 풍력 등 재생에너지 사용 비율을 관리하고 있습니까?' },
      { code: 'E-4-1', cat: '용수', name: '용수 사용량',
        q: '사업장 용수 사용량을 정량적으로 관리하고 있습니까?' },
      { code: 'E-4-2', cat: '용수', name: '재활용 용수 비율',
        q: '용수 재활용 비율을 관리·개선하고 있습니까?' },
      { code: 'E-5-1', cat: '폐기물', name: '폐기물 배출량',
        q: '폐기물 발생량을 정량적으로 관리하고 있습니까?' },
      { code: 'E-5-2', cat: '폐기물', name: '폐기물 재활용 비율',
        q: '폐기물 재활용률을 관리·개선하고 있습니까?' },
      { code: 'E-6-1', cat: '오염물질', name: '대기오염물질 배출량',
        q: '대기오염물질(NOx, SOx 등) 배출량을 관리하고 있습니까?' },
      { code: 'E-6-2', cat: '오염물질', name: '수질오염물질 배출량',
        q: '수질오염물질(BOD, COD 등) 배출량을 관리하고 있습니까?' },
      { code: 'E-7-1', cat: '환경 법/규제 위반', name: '환경 법/규제 위반',
        q: '최근 3년간 환경 관련 법규 위반 이력이 없습니까?' },
      { code: 'E-8-1', cat: '환경 라벨링', name: '친환경 인증 제품·서비스 비율',
        q: '친환경 인증(환경표지, 탄소발자국 등)을 취득한 제품이 있습니까?' },
      { code: 'E-9-1', cat: '원재료', name: '원재료 사용량',
        q: '원재료 사용량 및 재활용 원재료 비율을 관리하고 있습니까?' },
      { code: 'E-10-1', cat: '유해물질', name: '유해화학물질 사용·배출량',
        q: '제품 내 유해물질(RoHS, REACH 등) 관리 체계가 있습니까?' },
    ]
  },
  S: {
    title: '사회 (Social)',
    desc: '노동·다양성·산업안전·인권·동반성장·제품안전·지역사회·정보보호 등 사회 책임을 진단합니다. (22개 항목)',
    items: [
      { code: 'S-1-1', cat: '노동', name: '신규 채용 및 고용 유지',
        q: '신규 채용률과 자발적 이직률을 관리하고 있습니까?' },
      { code: 'S-1-2', cat: '노동', name: '정규직 비율',
        q: '전체 근로자 중 정규직 비율을 관리하고 있습니까?' },
      { code: 'S-1-3', cat: '노동', name: '자발적 이직률',
        q: '자발적 이직률을 측정하고 개선 방안을 수립하고 있습니까?' },
      { code: 'S-1-4', cat: '노동', name: '교육훈련비',
        q: '임직원 1인당 평균 교육훈련 시간·비용을 관리하고 있습니까?' },
      { code: 'S-1-5', cat: '노동', name: '복리후생비',
        q: '법정 외 복리후생 제도를 운영하고 있습니까?' },
      { code: 'S-1-6', cat: '노동', name: '결사의 자유 보장',
        q: '노동조합 가입 및 단체교섭권을 보장하고 있습니까?' },
      { code: 'S-2-1', cat: '다양성 및 양성평등', name: '여성 구성원 비율',
        q: '여성 구성원 비율(관리직 포함)을 관리하고 있습니까?' },
      { code: 'S-2-2', cat: '다양성 및 양성평등', name: '장애인 고용률',
        q: '장애인 의무 고용률을 준수하고 있습니까?' },
      { code: 'S-2-3', cat: '다양성 및 양성평등', name: '차별금지 방침',
        q: '성별·연령·장애 등에 따른 차별금지 방침이 수립되어 있습니까?' },
      { code: 'S-3-1', cat: '산업안전', name: '안전보건 추진체계',
        q: '산업안전보건 전담조직 및 안전보건관리 체계를 구축하고 있습니까?' },
      { code: 'S-3-2', cat: '산업안전', name: '산업재해율',
        q: '산업재해율을 관리하고, 재해예방 활동을 추진하고 있습니까?' },
      { code: 'S-3-3', cat: '산업안전', name: '안전보건 인허가',
        q: '중대재해처벌법 등 안전보건 관련 인허가를 취득하고 있습니까?' },
      { code: 'S-4-1', cat: '인권', name: '인권정책 수립',
        q: '인권정책(성희롱·괴롭힘 방지 포함)을 수립·공유하고 있습니까?' },
      { code: 'S-4-2', cat: '인권', name: '인권 리스크 평가',
        q: '인권영향평가 또는 인권 리스크 평가를 실시하고 있습니까?' },
      { code: 'S-5-1', cat: '동반성장', name: '협력사 ESG 경영',
        q: '협력사에 대해 ESG 관련 기준을 적용·지원하고 있습니까?' },
      { code: 'S-5-2', cat: '동반성장', name: '협력사 ESG 지원',
        q: '협력사 ESG 역량강화를 위한 교육·컨설팅을 지원합니까?' },
      { code: 'S-6-1', cat: '제품·서비스', name: '제품·서비스 안전',
        q: '제품·서비스의 안전성 및 품질 관리 체계를 운영하고 있습니까?' },
      { code: 'S-7-1', cat: '지역사회', name: '지역사회 공헌',
        q: '지역사회 공헌 활동(사회공헌 투자, 기부 등)을 수행하고 있습니까?' },
      { code: 'S-7-2', cat: '지역사회', name: '구성원 봉사참여',
        q: '임직원 자원봉사 프로그램을 운영하고 있습니까?' },
      { code: 'S-8-1', cat: '정보보호', name: '정보보호 시스템 구축',
        q: '정보보호 관리체계(ISMS 등)를 구축·운영하고 있습니까?' },
      { code: 'S-8-2', cat: '정보보호', name: '개인정보 침해 및 구제',
        q: '개인정보 침해 대응 절차 및 구제 체계가 있습니까?' },
      { code: 'S-9-1', cat: '사회 법/규제 위반', name: '사회 법/규제 위반',
        q: '최근 3년간 사회 관련 법규(노동법, 공정거래법 등) 위반 이력이 없습니까?' },
    ]
  },
  G: {
    title: '지배구조 (Governance)',
    desc: '이사회 구성·활동, 주주권리, 윤리경영, 감사기구, 준법 수준을 진단합니다. (17개 항목)',
    items: [
      { code: 'G-1-1', cat: '이사회 구성', name: '이사회 내 ESG 안건 상정',
        q: '이사회에서 ESG 관련 안건을 정기적으로 논의하고 있습니까?' },
      { code: 'G-1-2', cat: '이사회 구성', name: '사외이사 비율',
        q: '이사회 내 사외이사 비율이 적정 수준입니까?' },
      { code: 'G-1-3', cat: '이사회 구성', name: '대표이사 이사회 의장 분리',
        q: '대표이사와 이사회 의장이 분리되어 있습니까?' },
      { code: 'G-1-4', cat: '이사회 구성', name: '이사회 성별 다양성',
        q: '이사회 내 성별 다양성이 확보되어 있습니까?' },
      { code: 'G-1-5', cat: '이사회 구성', name: '사외이사 전문성',
        q: '사외이사의 산업·재무·ESG 전문성이 확보되어 있습니까?' },
      { code: 'G-2-1', cat: '이사회 활동', name: '전체 이사 출석률',
        q: '전체 이사의 이사회 출석률이 80% 이상입니까?' },
      { code: 'G-2-2', cat: '이사회 활동', name: '사내이사 출석률',
        q: '사내이사의 이사회 출석률이 80% 이상입니까?' },
      { code: 'G-2-3', cat: '이사회 활동', name: '이사회 산하 위원회',
        q: '감사위원회, ESG위원회 등 산하 위원회를 운영하고 있습니까?' },
      { code: 'G-2-4', cat: '이사회 활동', name: '이사회 안건 처리',
        q: '이사회 안건 처리가 투명하게 이루어지고 있습니까?' },
      { code: 'G-3-1', cat: '주주권리', name: '주주총회 소집 공고',
        q: '주주총회 소집 공고를 법정 기한 이전에 충분히 공고하고 있습니까?' },
      { code: 'G-3-2', cat: '주주권리', name: '주주총회 개최일',
        q: '주주총회를 집중일을 피해 개최하고 있습니까?' },
      { code: 'G-3-3', cat: '주주권리', name: '집중/전자/서면 투표제',
        q: '집중투표제, 전자투표제, 서면투표제를 도입하고 있습니까?' },
      { code: 'G-3-4', cat: '주주권리', name: '배당정책 및 이행',
        q: '배당정책을 수립하고 일관되게 이행하고 있습니까?' },
      { code: 'G-4-1', cat: '윤리경영', name: '윤리규범 위반사항 공시',
        q: '윤리강령을 수립하고 위반사항을 공시하고 있습니까?' },
      { code: 'G-5-1', cat: '감사기구', name: '내부감사부서 설치',
        q: '내부감사부서 또는 감사위원회를 설치·운영하고 있습니까?' },
      { code: 'G-5-2', cat: '감사기구', name: '감사기구 전문성',
        q: '감사기구 내 회계·재무 전문가가 포함되어 있습니까?' },
      { code: 'G-6-1', cat: '지배구조 법/규제 위반', name: '지배구조 법/규제 위반',
        q: '최근 3년간 지배구조 관련 법규 위반 이력이 없습니까?' },
    ]
  }
};

// K-ESG 가이드라인 5단계 평가 기준 (val 0~4 내부 저장)
const OPTIONS = [
  { label: '해당되지 않음', desc: '우리 기업에 적용되지 않는 항목', val: -1 },
  { label: '1단계', desc: '해당 없음 / 인식 없음', val: 0 },
  { label: '2단계', desc: '인식은 있으나 계획 미수립', val: 1 },
  { label: '3단계', desc: '계획 수립 완료 (정책·방침 문서화)', val: 2 },
  { label: '4단계', desc: '실행 중 (담당자 지정, 활동 이행)', val: 3 },
  { label: '5단계', desc: '고도화 (정량 성과관리, 제3자 검증, 지속 개선)', val: 4 },
];

const state = {
  cat: 'P',
  answers: { P: {}, E: {}, S: {}, G: {} },
};

function loadState() {
  const saved = localStorage.getItem('esgfit_answers');
  if (saved) {
    try { Object.assign(state.answers, JSON.parse(saved)); } catch {}
  }
}
function saveState() {
  localStorage.setItem('esgfit_answers', JSON.stringify(state.answers));
}

function computeScores() {
  const scores = {};
  for (const key of ['P','E','S','G']) {
    const items = QUESTIONS[key].items;
    const answers = Object.values(state.answers[key]);
    const applicable = answers.filter(val => val !== -1);
    const answered = applicable.length;
    const sum = applicable.reduce((a,b)=>a+b, 0);
    const totalItems = items.length - answers.filter(val => val === -1).length;
    const max = totalItems * 4;
    scores[key] = {
      answered,
      total: totalItems,
      score: max ? Math.round((sum / max) * 100) : 0,
    };
  }
  const answeredAll = ['P','E','S','G'].reduce((a,k)=>a+scores[k].answered, 0);
  const totalAll = ['P','E','S','G'].reduce((a,k)=>a+scores[k].total, 0);
  const scoreAll = Math.round(
    ['P','E','S','G'].reduce((a,k)=>a+scores[k].score, 0) / 4
  );
  scores.total = { answered: answeredAll, total: totalAll, score: scoreAll };
  return scores;
}

function renderTabs() {
  const tabs = document.getElementById('diagTabs');
  const s = computeScores();
  const cats = [
    { key: 'P', label: '정보공시', color: 'var(--p-color)' },
    { key: 'E', label: '환경', color: 'var(--e-color)' },
    { key: 'S', label: '사회', color: 'var(--s-color)' },
    { key: 'G', label: '지배구조', color: 'var(--g-color)' },
  ];
  tabs.innerHTML = cats.map(c => `
    <button class="diag-tab ${c.key === state.cat ? 'active' : ''}" data-cat="${c.key}">
      <span class="diag-tab-mark" style="background:${c.color}">${c.key}</span>
      <span>${c.label} <small style="opacity:.7;">${s[c.key].answered}/${s[c.key].total}</small></span>
    </button>
  `).join('');
  tabs.querySelectorAll('.diag-tab').forEach(el => {
    el.addEventListener('click', () => {
      state.cat = el.dataset.cat;
      render();
    });
  });
}

function renderQuestions() {
  const cat = QUESTIONS[state.cat];
  document.getElementById('diagTitle').textContent = cat.title;
  document.getElementById('diagDesc').textContent = cat.desc;

  const list = document.getElementById('diagList');
  list.innerHTML = cat.items.map((item, i) => {
    const answered = state.answers[state.cat][i];
    return `
      <div class="diag-q">
        <label class="diag-q-label">
          <span style="display:inline-block; font-size:11px; color:var(--text-muted); font-weight:600; margin-right:6px;">${item.code}</span>
          <span style="display:inline-block; font-size:11px; color:var(--primary); background:rgba(10,37,64,0.06); padding:2px 8px; border-radius:4px; margin-right:6px;">${item.cat}</span>
          <br>
          Q${i + 1}. ${item.q}
          <span class="diag-q-hint">${item.name}${item.hint ? ' · ' + item.hint : ''}</span>
        </label>
        <div class="diag-options" data-idx="${i}">
          ${OPTIONS.map(opt => `
            <button class="diag-opt ${answered === opt.val ? 'selected' : ''}" data-val="${opt.val}" title="${opt.desc}">
              <b>${opt.label}</b>
              <small style="display:block; font-size:10px; opacity:.75; font-weight:400; margin-top:2px;">${opt.desc}</small>
            </button>
          `).join('')}
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.diag-options').forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.diag-opt');
      if (!btn) return;
      const idx = parseInt(wrap.dataset.idx, 10);
      const val = parseInt(btn.dataset.val, 10);
      state.answers[state.cat][idx] = val;
      saveState();
      renderQuestions();
      renderSidebar();
      renderTabs();
    });
  });
}

function renderSidebar() {
  const s = computeScores();
  document.getElementById('sbScore').innerHTML = `${s.total.score}<span> / 100</span>`;
  document.getElementById('sbFill').style.width = `${(s.total.answered/s.total.total*100).toFixed(0)}%`;
  document.getElementById('sbProgress').textContent = `${s.total.answered} / ${s.total.total} 문항 응답 완료`;

  document.getElementById('sbSummary').innerHTML = `
    <div class="diag-summary-item"><span>🔵 정보공시 (P) <small style="color:var(--text-muted);">${s.P.answered}/${s.P.total}</small></span><span>${s.P.score}점</span></div>
    <div class="diag-summary-item"><span>🟢 환경 (E) <small style="color:var(--text-muted);">${s.E.answered}/${s.E.total}</small></span><span>${s.E.score}점</span></div>
    <div class="diag-summary-item"><span>🟡 사회 (S) <small style="color:var(--text-muted);">${s.S.answered}/${s.S.total}</small></span><span>${s.S.score}점</span></div>
    <div class="diag-summary-item"><span>🟣 지배구조 (G) <small style="color:var(--text-muted);">${s.G.answered}/${s.G.total}</small></span><span>${s.G.score}점</span></div>
  `;

  const finishBtn = document.getElementById('finishBtn');
  if (s.total.answered === s.total.total) {
    finishBtn.classList.remove('btn-outline');
    finishBtn.classList.add('btn-accent');
    finishBtn.textContent = '진단 완료 · 결과 보기 →';
  } else {
    finishBtn.classList.add('btn-outline');
    finishBtn.classList.remove('btn-accent');
    finishBtn.textContent = `결과 보기 (${s.total.answered}/${s.total.total})`;
  }
}

function render() {
  renderTabs();
  renderQuestions();
  renderSidebar();
  window.scrollTo({ top: document.getElementById('diagBody').offsetTop - 80, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat');
  if (cat && QUESTIONS[cat]) state.cat = cat;

  render();

  document.getElementById('finishBtn').addEventListener('click', () => {
    const s = computeScores();
    if (s.total.answered < s.total.total) {
      alert('아직 입력하지 않은 항목이 있습니다. 모든 문항에 답변해 주세요.');
      return;
    }
    location.href = 'results.html';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('모든 응답을 초기화하시겠습니까?')) {
      state.answers = { P:{}, E:{}, S:{}, G:{} };
      saveState();
      render();
    }
  });
});
