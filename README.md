# ESG DX — K-ESG 자가진단 플랫폼

K-ESG 가이드라인 기반 **27개 핵심 진단항목**을 온라인으로 자가진단하고,  
**Gemini AI 챗봇**을 통해 실시간 맞춤형 ESG 개선 전략을 제안받을 수 있는 플랫폼입니다.

---

## 주요 기능

### 1. 메인 랜딩 (Clean & Minimal)
- 밝은 화이트 배경(`#F8FAFC`) + 스카이 블루(`#00A3FF`) 포인트
- 화면 중앙에 **E · S · G** 대형 타이포그래피 버튼 배치
- 각 글자 클릭 시 해당 영역의 진단 폼이 **모달**로 열림
- **P(정보공시)** 는 별도 강조 카드로 하단에 배치
- 메인 화면에는 차트 없음 — 깔끔한 랜딩 유지

### 2. 진단 모달 (DiagnosticModal)
- K-ESG 27개 핵심항목에 대해 **1~5단계** 점수 선택
  - 1단계: 해당 없음 / 인식 없음
  - 2단계: 인식은 있으나 계획 미수립
  - 3단계: 계획 수립 완료 (정책·방침 문서화)
  - 4단계: 실행 중 (담당자 지정, 활동 이행)
  - 5단계: 고도화 (정량 성과관리, 제3자 검증, 지속 개선)
- 영역별 진행률 실시간 표시
- 점검 기준 안내 가이드 포함

### 3. 종합 리포트 대시보드 (별도 화면)
- 상단바 **"종합 리포트"** 버튼 클릭 시 Framer Motion 전환으로 대시보드 진입
- **ESG 종합등급(A~D)** + P/E/S/G 영역별 등급 카드
- **레이더 차트**: S영역 12개 항목 종합 현황
- **고용 안정성 지수 바 차트**: S-1-1 신규채용, S-1-2 정규직 비율 등
- **영역별 비교 파이 차트**: P·E·S·G 달성률
- **전체 항목 상세 테이블**: 27개 항목 점수·수준 일람

### 4. Gemini AI 챗봇
- 우측 하단 플로팅 아이콘 → 슬라이드 형태 채팅창
- **사용자 진단 점수를 자동으로 Gemini에게 전달** → 맞춤형 개선 방안 제안
- System Prompt: *"너는 K-ESG 가이드라인 전문가이며, 기업의 고용 안정성과 친환경 전환을 돕는 전략 컨설턴트야."*
- 빠른 질문 버튼 3종 (진단 결과 분석, S영역 개선 방안, 중대재해처벌법)
- **API Key 입력 필드** — 안전한 password 타입 입력

### 5. 회원 인증 (Firebase)
- 상단 우측 **Google / Kakao 간편 로그인** 버튼
- Firebase Authentication + Firestore 연동
- 로그인 시 사용자 정보 Firestore 저장 (회원가입)
- 진단 결과 자동 저장/불러오기
- Firebase 미설정 시 데모 모드로 동작

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 19, Vite 5 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Charts | Recharts (Radar, Bar, Pie) |
| Icons | Lucide React |
| AI Chatbot | Google Generative AI (Gemini 2.0 Flash) |
| Auth/DB | Firebase Auth + Firestore |

---

## 파일 구조

```
ESG_DX/
├── .gitignore                          # 보안: API 키, 빌드, 캐시 제외
├── index.html                          # HTML 진입점 (Noto Sans KR 폰트)
├── vite.config.js                      # Vite 설정 (React + Tailwind 플러그인)
├── package.json                        # 의존성 및 스크립트
│
├── public/                             # 정적 파일
│
└── src/
    ├── main.jsx                        # React 앱 진입점
    ├── index.css                       # Tailwind + 커스텀 테마 (#00A3FF, Mint)
    ├── App.jsx                         # 메인 앱 (뷰 라우팅, 상태관리, Firebase)
    │
    ├── data/
    │   ├── esgData.js                  # K-ESG 27개 항목, 등급 계산 로직
    │   └── firebaseConfig.js           # Firebase Auth, Firestore CRUD
    │
    └── components/
        ├── Header.jsx                  # 상단바 (로고, 종합리포트, 로그인)
        ├── HeroESG.jsx                 # 메인 E·S·G 타이포그래피 버튼 + P 카드
        ├── DiagnosticModal.jsx         # 영역별 진단 모달 (1~5단계 점수 입력)
        ├── Dashboard.jsx               # 종합 리포트 (차트, 등급, 상세 테이블)
        └── Chatbot.jsx                 # Gemini AI 플로팅 챗봇
```

---

## 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. Firebase 설정 (선택)
`src/data/firebaseConfig.js` 파일에서 Firebase 프로젝트 정보를 입력하면  
Google/Kakao 로그인 및 진단 결과 DB 저장 기능이 활성화됩니다.

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

Firebase Console에서 다음을 설정하세요:
1. Authentication → Google 로그인 제공업체 활성화
2. Firestore Database → 생성 (테스트 모드)
3. 승인된 도메인에 localhost 추가

### 4. Gemini AI 챗봇 사용
1. [Google AI Studio](https://aistudio.google.com/)에서 API Key 발급
2. 챗봇 창 열기 → 🔑 아이콘 클릭 → API Key 입력
3. 진단 점수 입력 후 "현재 진단 결과를 분석해줘" 질문

### 5. 프로덕션 빌드
```bash
npm run build
```

---

## 보안

- `.gitignore`에 `.env`, `node_modules/`, `dist/`, API 키 파일, IDE 설정 등 포함
- Gemini API Key는 클라이언트에서 사용자가 직접 입력 (서버 저장 안 함)
- Firebase Config는 프론트엔드용 공개 키이나, Firestore Security Rules로 데이터 보호 권장

---

## ESG 등급 산정 기준

| 등급 | 점수 범위 | 의미 |
|------|----------|------|
| **A** | 80점 이상 | 우수 — 고도화 수준의 ESG 경영 |
| **B** | 60~79점 | 양호 — 체계적 실행 단계 |
| **C** | 40~59점 | 보통 — 계획 수립 단계 |
| **D** | 40점 미만 | 미흡 — 개선 필요 |

---

## 데이터 출처

- K-ESG 가이드라인 (산업통상자원부·한국생산성본부)
- KSA ISO 26000 진단 Framework
- e-ESG (이크레더블)
- 중진공 ESG 통합플랫폼
