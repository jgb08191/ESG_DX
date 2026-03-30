"""고용 안정성 분석 엔진 - Stability Index 산출"""

from app.data.sample_data import generate_employees, generate_turnover_data, INCENTIVES


def calculate_stability_score(employees: list[dict]) -> dict:
    """기업의 고용 안정 점수(0~100)를 산출"""
    if not employees:
        return {"score": 0, "grade": "F", "details": {}}

    total = len(employees)

    # 1. 11개월 쪼개기 계약 비율 (감점 요소)
    short_contract = sum(1 for e in employees if e.get("contract_type") == "기간제")
    short_ratio = short_contract / total

    # 2. 평균 근속 기간
    avg_tenure = sum(e["tenure_months"] for e in employees) / total

    # 3. 11개월차 퇴사 집중도
    tenure_11m = sum(1 for e in employees if 10 <= e["tenure_months"] <= 12)
    turnover_11m_ratio = tenure_11m / total

    # 4. 교육 참여율
    training_active = sum(1 for e in employees if e.get("training_progress", 0) > 0)
    training_ratio = training_active / total

    # 점수 산출
    score = 100.0
    score -= short_ratio * 40  # 비정규직 비율 감점 (최대 -40)
    score -= turnover_11m_ratio * 30  # 11개월 퇴사 집중도 감점 (최대 -30)
    score += min(avg_tenure / 60, 1.0) * 15  # 평균 근속 가산 (최대 +15)
    score += training_ratio * 15  # 교육 참여 가산 (최대 +15)
    score = max(0, min(100, score))

    # 등급 산출
    if score >= 90:
        grade = "A+"
    elif score >= 80:
        grade = "A"
    elif score >= 70:
        grade = "B+"
    elif score >= 60:
        grade = "B"
    elif score >= 50:
        grade = "C"
    elif score >= 40:
        grade = "D"
    else:
        grade = "F"

    # 개선 권고사항
    recommendations = []
    if short_ratio > 0.1:
        recommendations.append(
            f"기간제 근로자 비율({short_ratio:.0%})이 높습니다. "
            f"정규직 전환 시 '정규직 전환 지원금(1인당 960만원)'을 활용하세요."
        )
    if turnover_11m_ratio > 0.1:
        recommendations.append(
            f"11~12개월차 퇴사 비율({turnover_11m_ratio:.0%})이 비정상적으로 높습니다. "
            f"퇴직금 회피 목적의 계약 쪼개기가 의심됩니다."
        )
    if avg_tenure < 24:
        recommendations.append(
            f"평균 근속 기간({avg_tenure:.0f}개월)이 업계 평균 이하입니다. "
            f"고용유지지원금을 활용한 인력 안정화를 권고합니다."
        )
    if training_ratio < 0.5:
        recommendations.append(
            f"직무 전환 교육 참여율({training_ratio:.0%})이 낮습니다. "
            f"K-디지털 트레이닝 등 정부 지원 교육 프로그램 도입을 권장합니다."
        )

    return {
        "score": round(score, 1),
        "grade": grade,
        "details": {
            "total_employees": total,
            "short_term_contract_count": short_contract,
            "short_term_contract_ratio": round(short_ratio, 3),
            "avg_tenure_months": round(avg_tenure, 1),
            "turnover_11m_ratio": round(turnover_11m_ratio, 3),
            "training_participation_ratio": round(training_ratio, 3),
        },
        "recommendations": recommendations,
    }


def get_turnover_analysis():
    """퇴사 패턴 분석 데이터 반환"""
    turnover = generate_turnover_data()
    total_turnover = sum(d["turnover_count"] for d in turnover)

    # 11~12개월 집중도 분석
    period_11_12 = sum(d["turnover_count"] for d in turnover if d["tenure_month"] in [11, 12])
    concentration = period_11_12 / total_turnover if total_turnover > 0 else 0

    return {
        "monthly_data": turnover,
        "total_turnover": total_turnover,
        "period_11_12_count": period_11_12,
        "concentration_ratio": round(concentration, 3),
        "is_abnormal": concentration > 0.3,
        "alert": "11~12개월차 퇴사 집중 현상 감지 - 쪼개기 계약 의심" if concentration > 0.3 else None,
    }


def get_applicable_incentives(stability_result: dict) -> list[dict]:
    """기업 상황에 맞는 인센티브 추천"""
    applicable = []
    details = stability_result.get("details", {})

    if details.get("short_term_contract_ratio", 0) > 0.1:
        applicable.append(next(i for i in INCENTIVES if "정규직 전환" in i["name"]))
        applicable.append(next(i for i in INCENTIVES if "고용유지" in i["name"]))

    if details.get("training_participation_ratio", 0) < 0.5:
        applicable.append(next(i for i in INCENTIVES if "전환 배치" in i["name"]))

    # 기본적으로 ESG 혜택과 탄소중립 보조금은 항상 추천
    applicable.append(next(i for i in INCENTIVES if "탄소중립" in i["name"]))
    applicable.append(next(i for i in INCENTIVES if "ESG" in i["name"]))

    return applicable
