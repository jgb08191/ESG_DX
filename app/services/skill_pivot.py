"""직무 전환 분석 엔진 - Skill Pivot"""

from app.data.sample_data import SKILL_MAPPING, TRAINING_PROGRAMS, DEPARTMENTS


def analyze_skill_gap(department: str) -> dict:
    """부서별 현재 역량과 그린 잡 필요 역량 간의 격차 분석"""
    if department not in SKILL_MAPPING:
        return {"error": f"부서 '{department}'를 찾을 수 없습니다."}

    mapping = SKILL_MAPPING[department]
    current = set(mapping["current"])
    green = set(mapping["green"])

    # 겹치는 스킬 (전환 가능)
    overlap = current & green
    # 새로 배워야 하는 스킬
    new_skills = green - current
    # 불필요해지는 스킬
    obsolete = current - green

    # 격차 점수 (0~1, 높을수록 격차 큼)
    gap_score = len(new_skills) / len(green) if green else 0

    # 추천 교육 매칭
    recommended_trainings = []
    for program in TRAINING_PROGRAMS:
        program_skills = set(program["skills"])
        if program_skills & new_skills:
            match_count = len(program_skills & new_skills)
            recommended_trainings.append({
                **program,
                "relevance": match_count / len(new_skills),
                "matching_skills": list(program_skills & new_skills),
            })

    recommended_trainings.sort(key=lambda x: x["relevance"], reverse=True)

    return {
        "department": department,
        "target_process": DEPARTMENTS[department]["green_target"],
        "current_skills": list(current),
        "required_skills": list(green),
        "transferable_skills": list(overlap),
        "skills_to_acquire": list(new_skills),
        "obsolete_skills": list(obsolete),
        "gap_score": round(gap_score, 2),
        "gap_level": "높음" if gap_score > 0.7 else ("보통" if gap_score > 0.4 else "낮음"),
        "recommended_trainings": recommended_trainings,
    }


def simulate_transition(department: str, headcount: int) -> dict:
    """부서 전환 시뮬레이션 - 재교육 비용 vs 해고 비용 비교"""
    gap = analyze_skill_gap(department)
    if "error" in gap:
        return gap

    dept_info = DEPARTMENTS.get(department, {})
    avg_tenure = dept_info.get("avg_tenure", 48)

    # 비용 추정 (만원 단위)
    avg_monthly_salary = 350  # 만원
    training_cost_per_person = 500  # 만원 (평균 교육비)

    # 재교육 경로 비용
    retraining_cost = headcount * training_cost_per_person
    productivity_loss = headcount * avg_monthly_salary * 0.3 * 3  # 3개월간 30% 생산성 저하
    total_retraining = retraining_cost + productivity_loss

    # 해고 경로 비용
    severance_per_person = avg_monthly_salary * (avg_tenure / 12)  # 근속연수 * 월급
    recruitment_cost = headcount * 200  # 신규 채용 비용
    training_new = headcount * 800  # 신규 인력 교육 비용
    social_cost = headcount * 150  # 사회적 비용 (실업급여 등)
    total_layoff = (severance_per_person * headcount) + recruitment_cost + training_new + social_cost

    # 전환 기간 추정
    if gap["gap_score"] > 0.7:
        transition_months = 6
        success_prob = 0.65
    elif gap["gap_score"] > 0.4:
        transition_months = 4
        success_prob = 0.80
    else:
        transition_months = 2
        success_prob = 0.92

    return {
        "department": department,
        "headcount": headcount,
        "target_process": gap["target_process"],
        "gap_score": gap["gap_score"],
        "retraining_path": {
            "education_cost": int(retraining_cost),
            "productivity_loss": int(productivity_loss),
            "total_cost": int(total_retraining),
            "transition_months": transition_months,
            "success_probability": success_prob,
        },
        "layoff_path": {
            "severance_cost": int(severance_per_person * headcount),
            "recruitment_cost": int(recruitment_cost),
            "new_training_cost": int(training_new),
            "social_cost": int(social_cost),
            "total_cost": int(total_layoff),
        },
        "cost_savings": int(total_layoff - total_retraining),
        "recommendation": "재교육" if total_retraining < total_layoff else "신규 채용",
        "recommended_trainings": [t["name"] for t in gap["recommended_trainings"][:3]],
    }


def get_all_department_gaps() -> list[dict]:
    """모든 부서의 직무 격차 요약"""
    results = []
    for dept in SKILL_MAPPING:
        gap = analyze_skill_gap(dept)
        results.append({
            "department": dept,
            "target": gap["target_process"],
            "gap_score": gap["gap_score"],
            "gap_level": gap["gap_level"],
            "skills_to_acquire_count": len(gap["skills_to_acquire"]),
            "top_training": gap["recommended_trainings"][0]["name"] if gap["recommended_trainings"] else None,
        })
    return results
