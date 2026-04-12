export const LEVEL_LABELS = {
  1: '해당 없음 / 인식 없음',
  2: '인식은 있으나 계획 미수립',
  3: '계획 수립 완료 (정책·방침 문서화)',
  4: '실행 중 (담당자 지정, 활동 이행)',
  5: '고도화 (정량 성과관리, 제3자 검증, 지속 개선)',
};

export const CATEGORIES = {
  P: {
    name: '정보공시',
    fullName: 'Public Disclosure',
    color: '#60a5fa',
    bgColor: 'from-blue-500/20 to-blue-600/10',
    borderColor: 'border-blue-500/30',
    icon: 'FileText',
  },
  E: {
    name: '환경',
    fullName: 'Environmental',
    color: '#34d399',
    bgColor: 'from-emerald-500/20 to-emerald-600/10',
    borderColor: 'border-emerald-500/30',
    icon: 'Leaf',
  },
  S: {
    name: '사회',
    fullName: 'Social',
    color: '#fbbf24',
    bgColor: 'from-amber-500/20 to-amber-600/10',
    borderColor: 'border-amber-500/30',
    icon: 'Users',
  },
  G: {
    name: '지배구조',
    fullName: 'Governance',
    color: '#f87171',
    bgColor: 'from-red-500/20 to-red-600/10',
    borderColor: 'border-red-500/30',
    icon: 'Building2',
  },
};

export const ESG_ITEMS = [
  // P - 정보공시
  { id: 'P-1-1', area: 'P', category: 'ESG 정보공시 형식', item: 'ESG 정보공시 방식', question: 'ESG 정보를 어떤 형태로든 공시하고 있습니까?' },
  { id: 'P-2-1', area: 'P', category: 'ESG 정보공시 내용', item: 'ESG 핵심이슈 및 KPI', question: 'ESG 핵심이슈와 KPI를 설정하고 있습니까?' },

  // E - 환경
  { id: 'E-1-1', area: 'E', category: '환경경영 목표', item: '환경경영 목표 수립', question: '환경 관련 목표를 수립하고 있습니까?' },
  { id: 'E-1-2', area: 'E', category: '환경경영 추진체계', item: '환경경영 추진체계', question: '환경 전담 조직/담당자가 있습니까?' },
  { id: 'E-2-1', area: 'E', category: '온실가스', item: '온실가스 배출량', question: '온실가스 배출량을 파악하고 있습니까?' },
  { id: 'E-3-1', area: 'E', category: '에너지', item: '에너지 사용량', question: '에너지 사용량을 관리하고 있습니까?' },
  { id: 'E-5-1', area: 'E', category: '폐기물', item: '폐기물 배출량', question: '폐기물 발생량을 관리하고 있습니까?' },
  { id: 'E-7-1', area: 'E', category: '환경 법/규제 위반', item: '환경 법/규제 위반', question: '환경 법규 위반 이력이 없습니까?' },
  { id: 'E-10-1', area: 'E', category: '유해물질', item: '유해화학물질 관리', question: '유해물질 관리 체계가 있습니까?' },

  // S - 사회
  { id: 'S-1-1', area: 'S', category: '노동', item: '신규 채용 및 고용 유지', question: '채용·이직률을 관리하고 있습니까?' },
  { id: 'S-1-2', area: 'S', category: '노동', item: '정규직 비율', question: '정규직 비율을 관리하고 있습니까?' },
  { id: 'S-1-4', area: 'S', category: '노동', item: '교육훈련비', question: '임직원 교육훈련을 지원하고 있습니까?' },
  { id: 'S-2-1', area: 'S', category: '다양성 및 양성평등', item: '여성 구성원 비율', question: '여성 구성원 비율을 관리하고 있습니까?' },
  { id: 'S-2-2', area: 'S', category: '다양성 및 양성평등', item: '장애인 고용률', question: '장애인 의무 고용률을 준수합니까?' },
  { id: 'S-3-1', area: 'S', category: '산업안전', item: '안전보건 추진체계', question: '산업안전 관리체계가 구축되어 있습니까?' },
  { id: 'S-3-2', area: 'S', category: '산업안전', item: '산업재해율', question: '산업재해 예방 활동을 하고 있습니까?' },
  { id: 'S-4-1', area: 'S', category: '인권', item: '인권정책 수립', question: '인권·성희롱 방지 정책이 있습니까?' },
  { id: 'S-5-1', area: 'S', category: '동반성장', item: '협력사 ESG 경영', question: '협력사에 ESG 기준을 적용합니까?' },
  { id: 'S-7-1', area: 'S', category: '지역사회', item: '지역사회 공헌', question: '지역사회 공헌 활동을 합니까?' },
  { id: 'S-8-1', area: 'S', category: '정보보호', item: '정보보호 시스템', question: '정보보호 체계를 운영합니까?' },
  { id: 'S-9-1', area: 'S', category: '사회 법/규제 위반', item: '사회 법/규제 위반', question: '사회 관련 법규 위반 이력이 없습니까?' },

  // G - 지배구조
  { id: 'G-1-1', area: 'G', category: '이사회 구성', item: '이사회 내 ESG 안건', question: '이사회에서 ESG를 논의합니까?' },
  { id: 'G-2-1', area: 'G', category: '이사회 활동', item: '전체 이사 출석률', question: '이사회 출석률이 양호합니까?' },
  { id: 'G-3-4', area: 'G', category: '주주권리', item: '배당정책 및 이행', question: '배당정책을 수립·이행합니까?' },
  { id: 'G-4-1', area: 'G', category: '윤리경영', item: '윤리규범 위반사항 공시', question: '윤리강령이 있고 준수합니까?' },
  { id: 'G-5-1', area: 'G', category: '감사기구', item: '내부감사부서 설치', question: '내부감사 기능이 있습니까?' },
  { id: 'G-6-1', area: 'G', category: '지배구조 법/규제 위반', item: '지배구조 법/규제 위반', question: '지배구조 법규 위반 이력이 없습니까?' },
];

export function calculateGrade(scores) {
  const answered = Object.values(scores).filter((v) => v > 0);
  if (answered.length === 0) return { grade: '-', score: 0, percent: 0 };
  const total = answered.reduce((a, b) => a + b, 0);
  const maxPossible = answered.length * 5;
  const percent = Math.round((total / maxPossible) * 100);
  let grade;
  if (percent >= 80) grade = 'A';
  else if (percent >= 60) grade = 'B';
  else if (percent >= 40) grade = 'C';
  else grade = 'D';
  return { grade, score: total, percent };
}

export function calculateAreaGrade(scores, area) {
  const areaItems = ESG_ITEMS.filter((item) => item.area === area);
  const areaScores = {};
  areaItems.forEach((item) => {
    if (scores[item.id]) areaScores[item.id] = scores[item.id];
  });
  return calculateGrade(areaScores);
}
