"""ESG 등급 산출 엔진"""

from app.services.stability_analyzer import calculate_stability_score
from app.services.skill_pivot import get_all_department_gaps
from app.services.safety_engine import get_risk_summary


def calculate_esg_score(employees: list[dict], company: dict) -> dict:
    """통합 ESG 점수 산출"""

    # Environmental (E) - 친환경 전환 진행도
    dept_gaps = get_all_department_gaps()
    avg_gap = sum(d["gap_score"] for d in dept_gaps) / len(dept_gaps) if dept_gaps else 1.0

    stage_scores = {"planning": 20, "early": 40, "mid": 65, "advanced": 85}
    transition_base = stage_scores.get(company.get("green_transition_stage", "planning"), 20)

    # 교육 진행률 반영
    training_active = sum(1 for e in employees if e.get("training_progress", 0) > 30)
    training_factor = (training_active / len(employees)) if employees else 0

    e_score = transition_base * 0.6 + (1 - avg_gap) * 100 * 0.2 + training_factor * 100 * 0.2

    # Social (S) - 고용 안정성
    stability = calculate_stability_score(employees)
    s_score = stability["score"]

    # Governance (G) - 안전 관리 수준
    safety = get_risk_summary()
    g_score = max(0, 100 - safety["risk_score"])

    # 총합
    total = e_score * 0.35 + s_score * 0.40 + g_score * 0.25

    if total >= 85:
        grade = "A+"
    elif total >= 75:
        grade = "A"
    elif total >= 65:
        grade = "B+"
    elif total >= 55:
        grade = "B"
    elif total >= 45:
        grade = "C"
    elif total >= 35:
        grade = "D"
    else:
        grade = "F"

    return {
        "environmental": {
            "score": round(e_score, 1),
            "details": {
                "transition_stage": company.get("green_transition_stage", "planning"),
                "avg_skill_gap": round(avg_gap, 2),
                "training_active_ratio": round(training_factor, 2),
            },
        },
        "social": {
            "score": round(s_score, 1),
            "details": stability["details"],
            "recommendations": stability["recommendations"],
        },
        "governance": {
            "score": round(g_score, 1),
            "details": {
                "total_hazards": safety["total_hazards"],
                "critical_risks": safety["critical"],
                "safety_risk_score": safety["risk_score"],
            },
        },
        "total": round(total, 1),
        "grade": grade,
    }
