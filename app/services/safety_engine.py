"""안전 관리 엔진 - Safety RAG"""

from datetime import datetime
from app.data.sample_data import SAFETY_HAZARDS


def get_safety_alerts(process: str | None = None) -> list[dict]:
    """공정별 안전 위험 요소 조회"""
    alerts = []
    for i, hazard in enumerate(SAFETY_HAZARDS):
        if process and process not in hazard["process"]:
            continue
        alerts.append({
            "id": f"SAFE-{i+1:03d}",
            "process_name": hazard["process"],
            "hazard_type": hazard["hazard"],
            "risk_level": hazard["risk_level"],
            "regulation": hazard["regulation"],
            "guideline": hazard["guideline"],
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        })
    return alerts


def get_risk_summary() -> dict:
    """전체 위험 요약"""
    critical = sum(1 for h in SAFETY_HAZARDS if h["risk_level"] == "critical")
    high = sum(1 for h in SAFETY_HAZARDS if h["risk_level"] == "high")
    medium = sum(1 for h in SAFETY_HAZARDS if h["risk_level"] == "medium")

    return {
        "total_hazards": len(SAFETY_HAZARDS),
        "critical": critical,
        "high": high,
        "medium": medium,
        "risk_score": round((critical * 3 + high * 2 + medium * 1) / len(SAFETY_HAZARDS) * 33.3, 1),
        "top_risks": [
            {"process": h["process"], "hazard": h["hazard"], "level": h["risk_level"]}
            for h in SAFETY_HAZARDS if h["risk_level"] == "critical"
        ],
    }


def search_regulation(query: str) -> list[dict]:
    """법령/규제 검색 (RAG 시뮬레이션)"""
    results = []
    query_lower = query.lower()
    for hazard in SAFETY_HAZARDS:
        relevance = 0
        if query_lower in hazard["process"].lower():
            relevance += 3
        if query_lower in hazard["hazard"].lower():
            relevance += 2
        if query_lower in hazard["regulation"].lower():
            relevance += 2
        if query_lower in hazard["guideline"].lower():
            relevance += 1

        if relevance > 0:
            results.append({
                "relevance": relevance,
                "process": hazard["process"],
                "regulation": hazard["regulation"],
                "guideline": hazard["guideline"],
                "risk_level": hazard["risk_level"],
            })

    results.sort(key=lambda x: x["relevance"], reverse=True)
    return results
