from pydantic import BaseModel


class Employee(BaseModel):
    id: str
    name: str
    department: str
    current_role: str
    tenure_months: int
    skills: list[str]
    training_progress: float = 0.0  # 0~100
    risk_level: str = "low"  # low, medium, high


class Company(BaseModel):
    id: str
    name: str
    industry: str
    employee_count: int
    green_transition_stage: str  # planning, early, mid, advanced
    stability_score: float = 0.0
    esg_grade: str = "C"


class SkillGap(BaseModel):
    current_skill: str
    required_skill: str
    gap_score: float  # 0~1, 1이 가장 큰 격차
    recommended_training: str
    training_duration_weeks: int


class StabilityReport(BaseModel):
    company_id: str
    total_employees: int
    short_term_contract_ratio: float
    avg_tenure_months: float
    turnover_rate_11m: float  # 11개월 퇴사 비율
    stability_score: float  # 0~100
    grade: str
    recommendations: list[str]


class SafetyAlert(BaseModel):
    id: str
    process_name: str
    hazard_type: str
    risk_level: str
    regulation: str
    guideline: str
    timestamp: str


class ESGScore(BaseModel):
    environmental: float
    social: float
    governance: float
    total: float
    grade: str


class SimulationRequest(BaseModel):
    company_id: str
    department: str
    target_process: str
    headcount: int


class SimulationResult(BaseModel):
    retraining_cost: int
    layoff_cost: int
    cost_savings: int
    transition_period_months: int
    success_probability: float
    recommended_trainings: list[str]
