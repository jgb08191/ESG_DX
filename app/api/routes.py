"""API 라우터"""

from fastapi import APIRouter, Query
from app.data.sample_data import (
    generate_employees, generate_company, DEPARTMENTS, TRAINING_PROGRAMS,
)
from app.services.stability_analyzer import (
    calculate_stability_score, get_turnover_analysis, get_applicable_incentives,
)
from app.services.skill_pivot import (
    analyze_skill_gap, simulate_transition, get_all_department_gaps,
)
from app.services.safety_engine import (
    get_safety_alerts, get_risk_summary, search_regulation,
)
from app.services.esg_scorer import calculate_esg_score

router = APIRouter(prefix="/api", tags=["ESG-DX API"])

# 캐시용 데이터
_employees = None
_company = None


def _get_employees():
    global _employees
    if _employees is None:
        _employees = generate_employees(count_per_dept=8)
    return _employees


def _get_company():
    global _company
    if _company is None:
        _company = generate_company()
    return _company


# === 대시보드 요약 ===
@router.get("/dashboard/summary")
def dashboard_summary():
    employees = _get_employees()
    company = _get_company()
    esg = calculate_esg_score(employees, company)
    stability = calculate_stability_score(employees)
    safety = get_risk_summary()
    dept_gaps = get_all_department_gaps()

    return {
        "company": company,
        "esg": esg,
        "stability": stability,
        "safety": safety,
        "skill_gaps": dept_gaps,
        "employee_count": len(employees),
    }


# === 고용 안정성 ===
@router.get("/stability/score")
def stability_score():
    return calculate_stability_score(_get_employees())


@router.get("/stability/turnover")
def turnover_analysis():
    return get_turnover_analysis()


@router.get("/stability/incentives")
def incentives():
    stability = calculate_stability_score(_get_employees())
    return get_applicable_incentives(stability)


# === 직무 전환 ===
@router.get("/skill-pivot/gaps")
def all_skill_gaps():
    return get_all_department_gaps()


@router.get("/skill-pivot/department/{department}")
def department_gap(department: str):
    return analyze_skill_gap(department)


@router.get("/skill-pivot/simulate")
def simulate(
    department: str = Query(...),
    headcount: int = Query(default=10),
):
    return simulate_transition(department, headcount)


@router.get("/skill-pivot/trainings")
def training_programs():
    return TRAINING_PROGRAMS


# === 안전 관리 ===
@router.get("/safety/alerts")
def safety_alerts(process: str | None = None):
    return get_safety_alerts(process)


@router.get("/safety/summary")
def safety_summary():
    return get_risk_summary()


@router.get("/safety/search")
def regulation_search(q: str = Query(...)):
    return search_regulation(q)


# === ESG 점수 ===
@router.get("/esg/score")
def esg_score():
    return calculate_esg_score(_get_employees(), _get_company())


# === 직원 데이터 ===
@router.get("/employees")
def employee_list(department: str | None = None):
    employees = _get_employees()
    if department:
        employees = [e for e in employees if e["department"] == department]
    return employees


@router.get("/departments")
def department_list():
    return DEPARTMENTS
