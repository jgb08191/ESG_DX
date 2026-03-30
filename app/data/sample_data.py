"""샘플 데이터 생성 모듈 - 공공데이터 기반 시뮬레이션 데이터"""

import random
from datetime import datetime, timedelta

# 부서별 직원 데이터 (제조업 기준)
DEPARTMENTS = {
    "내연기관 조립": {"headcount": 45, "avg_tenure": 84, "green_target": "전기차 배터리 조립"},
    "도장 공정": {"headcount": 30, "avg_tenure": 60, "green_target": "수성 도료 공정"},
    "엔진 가공": {"headcount": 35, "avg_tenure": 72, "green_target": "모터 제조"},
    "품질 검사": {"headcount": 20, "avg_tenure": 48, "green_target": "AI 기반 품질 검사"},
    "물류 관리": {"headcount": 25, "avg_tenure": 36, "green_target": "스마트 물류"},
    "시설 관리": {"headcount": 15, "avg_tenure": 96, "green_target": "에너지 관리 시스템"},
}

# NCS 기반 직무 역량 매핑
SKILL_MAPPING = {
    "내연기관 조립": {
        "current": ["기계 조립", "유압 시스템", "엔진 테스트", "품질 측정", "도면 해독"],
        "green": ["배터리 셀 조립", "전기 안전", "BMS 이해", "고전압 취급", "배터리 테스트"],
    },
    "도장 공정": {
        "current": ["스프레이 도장", "유성 도료 조합", "건조 공정", "색상 매칭", "표면 처리"],
        "green": ["수성 도료 기술", "환경 규제 이해", "VOC 관리", "친환경 코팅", "폐수 처리"],
    },
    "엔진 가공": {
        "current": ["CNC 가공", "선반 작업", "연삭", "열처리", "정밀 측정"],
        "green": ["전기모터 권선", "인버터 조립", "전자 제어", "모터 시험", "자동화 프로그래밍"],
    },
    "품질 검사": {
        "current": ["육안 검사", "치수 측정", "SPC 관리", "불량 분석", "검사 장비 운용"],
        "green": ["AI 비전 검사", "데이터 분석", "머신러닝 기초", "센서 활용", "자동화 검사"],
    },
    "물류 관리": {
        "current": ["재고 관리", "입출고", "지게차 운전", "ERP 운용", "포장"],
        "green": ["WMS 운용", "AGV 관리", "IoT 센서", "데이터 기반 예측", "자동화 설비"],
    },
    "시설 관리": {
        "current": ["전기 설비", "배관", "공조 시스템", "안전 관리", "설비 점검"],
        "green": ["태양광 관리", "ESS 운용", "EMS 시스템", "탄소 모니터링", "에너지 효율 진단"],
    },
}

# 산업재해 위험 요인 (친환경 전환 관련 신규)
SAFETY_HAZARDS = [
    {
        "process": "배터리 조립",
        "hazard": "리튬이온 전해액 누출",
        "risk_level": "high",
        "regulation": "산업안전보건법 제117조 (유해물질 관리)",
        "guideline": "전해액 취급 시 방폭 장갑, 보안경 착용 필수. 환기 시설 가동 상태 확인. 누출 시 즉시 중화제 살포 후 전문 업체 처리.",
    },
    {
        "process": "고전압 시스템",
        "hazard": "감전 사고",
        "risk_level": "critical",
        "regulation": "전기사업법 제73조, 산업안전보건기준에 관한 규칙 제301조",
        "guideline": "작업 전 반드시 전원 차단 및 잔류 전하 방전 확인. 절연 장갑 및 절연화 착용. 2인 1조 작업 원칙.",
    },
    {
        "process": "수성 도료 공정",
        "hazard": "미생물 오염에 의한 피부질환",
        "risk_level": "medium",
        "regulation": "산업안전보건법 제125조 (작업환경측정)",
        "guideline": "수성 도료 보관 온도 15-25도 유지. 방부제 농도 정기 측정. 피부 보호구 착용.",
    },
    {
        "process": "태양광 패널 설치",
        "hazard": "고소 추락 및 감전",
        "risk_level": "high",
        "regulation": "산업안전보건기준에 관한 규칙 제42조 (추락 방지)",
        "guideline": "안전대 부착 설비 설치 필수. 작업 전 지붕 구조 하중 검토. 패널 연결 시 DC 전압 확인.",
    },
    {
        "process": "ESS 운용",
        "hazard": "배터리 열폭주 및 화재",
        "risk_level": "critical",
        "regulation": "전기설비기술기준 제225조, 소방시설법",
        "guideline": "BMS 알람 즉시 대응 체계 구축. 소화 설비 자동 연동. 주 1회 온도 이상 징후 점검.",
    },
    {
        "process": "폐배터리 해체",
        "hazard": "유해가스 흡입",
        "risk_level": "high",
        "regulation": "폐기물관리법 제13조, 화학물질관리법",
        "guideline": "밀폐 공간 작업 시 가스 농도 사전 측정. 송기마스크 착용. 작업 시간 2시간 이내 제한.",
    },
    {
        "process": "스마트 물류 AGV",
        "hazard": "AGV 충돌 사고",
        "risk_level": "medium",
        "regulation": "산업안전보건기준에 관한 규칙 제189조 (산업용 로봇)",
        "guideline": "AGV 운행 구역 안전 펜스 설치. 비상정지 버튼 위치 숙지. 보행자 통행로 분리.",
    },
]

# 교육 프로그램 데이터 (K-디지털 트레이닝 등)
TRAINING_PROGRAMS = [
    {"name": "전기차 배터리 제조 전문가 과정", "provider": "K-디지털 트레이닝", "duration_weeks": 12, "skills": ["배터리 셀 조립", "BMS 이해", "고전압 취급"]},
    {"name": "스마트 팩토리 운영 전문가", "provider": "폴리텍", "duration_weeks": 16, "skills": ["자동화 프로그래밍", "IoT 센서", "데이터 기반 예측"]},
    {"name": "AI 품질검사 실무", "provider": "K-디지털 트레이닝", "duration_weeks": 8, "skills": ["AI 비전 검사", "데이터 분석", "머신러닝 기초"]},
    {"name": "친환경 도장 기술자", "provider": "직업능력개발원", "duration_weeks": 6, "skills": ["수성 도료 기술", "VOC 관리", "친환경 코팅"]},
    {"name": "신재생에너지 관리사", "provider": "에너지공단", "duration_weeks": 10, "skills": ["태양광 관리", "ESS 운용", "EMS 시스템"]},
    {"name": "전기안전 전문가 과정", "provider": "안전보건공단", "duration_weeks": 4, "skills": ["전기 안전", "고전압 취급", "배터리 테스트"]},
    {"name": "스마트 물류 전문가", "provider": "K-디지털 트레이닝", "duration_weeks": 8, "skills": ["WMS 운용", "AGV 관리", "자동화 설비"]},
    {"name": "탄소중립 에너지 관리", "provider": "환경부", "duration_weeks": 6, "skills": ["탄소 모니터링", "에너지 효율 진단", "EMS 시스템"]},
]

# 고용장려금 및 인센티브 데이터
INCENTIVES = [
    {"name": "고용유지지원금", "condition": "경영 악화 시 고용 유지", "amount": "인건비의 최대 90%", "duration": "최대 6개월"},
    {"name": "전환 배치 훈련 지원금", "condition": "직무 전환 훈련 실시", "amount": "훈련비 전액 + 훈련수당", "duration": "훈련 기간"},
    {"name": "청년추가고용장려금", "condition": "청년 정규직 신규 채용", "amount": "연 900만원/인", "duration": "3년"},
    {"name": "탄소중립 설비전환 보조금", "condition": "친환경 공정 전환", "amount": "설비 투자비의 최대 50%", "duration": "1회"},
    {"name": "ESG 우수기업 세제 혜택", "condition": "ESG 등급 A 이상", "amount": "법인세 감면 10%", "duration": "매년"},
    {"name": "정규직 전환 지원금", "condition": "비정규직의 정규직 전환", "amount": "1인당 960만원", "duration": "1년"},
]


def generate_employees(count_per_dept=None):
    """부서별 직원 샘플 데이터 생성"""
    employees = []
    names = [
        "김민수", "이서연", "박준혁", "최유진", "정도현", "강민지", "조성호", "윤하은",
        "임재원", "한소희", "오태양", "신지우", "권혁진", "송미래", "류건우", "배수빈",
        "전승민", "황지현", "안동욱", "문채원", "장세진", "노유나", "하정훈", "고은서",
        "남기범", "서윤아", "홍대원", "양시현", "유재민", "구하린", "백성준", "표지영",
    ]

    emp_id = 1
    for dept_name, dept_info in DEPARTMENTS.items():
        count = count_per_dept or dept_info["headcount"]
        for i in range(min(count, len(names))):
            # 11개월 계약 패턴 시뮬레이션: 일부 직원은 11개월 근처 근속
            is_short_contract = random.random() < 0.15  # 15% 확률
            if is_short_contract:
                tenure = random.randint(10, 12)
            else:
                tenure = random.randint(6, dept_info["avg_tenure"] + 24)

            skills = random.sample(
                SKILL_MAPPING[dept_name]["current"],
                k=min(3, len(SKILL_MAPPING[dept_name]["current"])),
            )

            risk = "high" if is_short_contract else ("medium" if tenure < 24 else "low")

            employees.append({
                "id": f"EMP-{emp_id:04d}",
                "name": names[i % len(names)],
                "department": dept_name,
                "current_role": dept_name + " 작업자",
                "tenure_months": tenure,
                "skills": skills,
                "training_progress": round(random.uniform(0, 100), 1) if random.random() > 0.5 else 0.0,
                "risk_level": risk,
                "contract_type": "기간제" if is_short_contract else "정규직",
                "hire_date": (datetime.now() - timedelta(days=tenure * 30)).strftime("%Y-%m-%d"),
            })
            emp_id += 1

    return employees


def generate_turnover_data():
    """월별 퇴사 데이터 - 11개월 쪼개기 계약 패턴 시뮬레이션"""
    data = []
    for month in range(1, 13):
        # 11~12개월에 퇴사가 집중되는 패턴
        if month in [11, 12]:
            count = random.randint(15, 30)
        else:
            count = random.randint(2, 8)

        data.append({
            "tenure_month": month,
            "turnover_count": count,
            "label": f"{month}개월차",
        })

    # 24개월 이후까지 확장
    for month in [18, 24, 36, 48, 60]:
        data.append({
            "tenure_month": month,
            "turnover_count": random.randint(1, 5),
            "label": f"{month}개월차",
        })

    return data


def generate_company():
    """샘플 기업 데이터"""
    return {
        "id": "COMP-001",
        "name": "대한모터스(주)",
        "industry": "자동차 제조업",
        "employee_count": 170,
        "green_transition_stage": "early",
        "departments": DEPARTMENTS,
        "established": "1998",
        "revenue": "2,400억원",
        "location": "경기도 화성시",
    }
