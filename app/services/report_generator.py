"""PDF 리포트 생성 엔진"""

import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from app.data.sample_data import generate_employees, generate_company
from app.services.esg_scorer import calculate_esg_score
from app.services.stability_analyzer import (
    calculate_stability_score, get_applicable_incentives,
)
from app.services.skill_pivot import get_all_department_gaps, simulate_transition
from app.services.safety_engine import get_risk_summary


def _register_fonts():
    """시스템 폰트 등록 시도"""
    font_paths = [
        ("C:/Windows/Fonts/malgun.ttf", "Malgun"),
        ("C:/Windows/Fonts/NanumGothic.ttf", "NanumGothic"),
    ]
    for path, name in font_paths:
        try:
            pdfmetrics.registerFont(TTFont(name, path))
            return name
        except Exception:
            continue
    return "Helvetica"


def generate_pdf_report() -> bytes:
    """ESG 전략 보고서 PDF 생성"""
    font_name = _register_fonts()
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=20*mm, bottomMargin=20*mm,
        leftMargin=15*mm, rightMargin=15*mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle', parent=styles['Title'],
        fontName=font_name, fontSize=20, spaceAfter=6*mm,
        textColor=colors.HexColor('#1a73e8'),
    )
    h2_style = ParagraphStyle(
        'CustomH2', parent=styles['Heading2'],
        fontName=font_name, fontSize=14, spaceBefore=8*mm, spaceAfter=4*mm,
        textColor=colors.HexColor('#1e293b'),
        borderPadding=(0, 0, 2*mm, 0),
    )
    body_style = ParagraphStyle(
        'CustomBody', parent=styles['Normal'],
        fontName=font_name, fontSize=10, leading=16,
        textColor=colors.HexColor('#334155'),
    )
    small_style = ParagraphStyle(
        'Small', parent=body_style, fontSize=8, leading=12,
        textColor=colors.HexColor('#64748b'),
    )

    # 데이터 수집
    employees = generate_employees(count_per_dept=8)
    company = generate_company()
    esg = calculate_esg_score(employees, company)
    stability = calculate_stability_score(employees)
    incentives = get_applicable_incentives(stability)
    dept_gaps = get_all_department_gaps()
    safety = get_risk_summary()

    elements = []

    # === 표지 ===
    elements.append(Spacer(1, 30*mm))
    elements.append(Paragraph("ESG-DX", title_style))
    elements.append(Paragraph(
        "GX Strategy Report<br/>"
        "Data-driven Green Transition &amp; Employment Stabilization",
        ParagraphStyle('Sub', parent=body_style, fontSize=12, textColor=colors.HexColor('#64748b'))
    ))
    elements.append(Spacer(1, 10*mm))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#1a73e8')))
    elements.append(Spacer(1, 5*mm))

    company_info = [
        [Paragraph(f"<b>Company:</b> {company['name']}", body_style),
         Paragraph(f"<b>Industry:</b> {company['industry']}", body_style)],
        [Paragraph(f"<b>Employees:</b> {company['employee_count']}명", body_style),
         Paragraph(f"<b>Revenue:</b> {company['revenue']}", body_style)],
        [Paragraph(f"<b>Location:</b> {company['location']}", body_style),
         Paragraph(f"<b>Transition Stage:</b> {company['green_transition_stage']}", body_style)],
    ]
    t = Table(company_info, colWidths=[90*mm, 90*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0f4f8')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(t)

    # === 1. GX Maturity Score ===
    elements.append(Paragraph("1. GX Maturity Score - ESG Score", h2_style))

    score_data = [
        ['Category', 'Score', 'Grade'],
        ['Environmental (E)', f"{esg['environmental']['score']}", '-'],
        ['Social (S)', f"{esg['social']['score']}", '-'],
        ['Governance (G)', f"{esg['governance']['score']}", '-'],
        ['TOTAL', f"{esg['total']}", esg['grade']],
    ]
    t = Table(score_data, colWidths=[70*mm, 50*mm, 50*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a73e8')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#e8f0fe')),
        ('FONTSIZE', (0, -1), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(t)

    # === 2. Workforce Transition Simulation ===
    elements.append(Paragraph("2. Workforce Transition Simulation", h2_style))

    gap_data = [['Department', 'Target Process', 'Gap Level', 'Gap Score', 'Required Skills']]
    for g in dept_gaps:
        gap_data.append([
            g['department'], g['target'], g['gap_level'],
            f"{g['gap_score']*100:.0f}%", f"{g['skills_to_acquire_count']}",
        ])

    t = Table(gap_data, colWidths=[35*mm, 40*mm, 25*mm, 25*mm, 30*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0d9488')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (2, 0), (-1, -1), 'CENTER'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
    ]))
    elements.append(t)

    # 시뮬레이션 예시
    sim = simulate_transition("내연기관 조립", 20)
    elements.append(Spacer(1, 5*mm))
    elements.append(Paragraph(
        f"<b>Simulation Example:</b> {sim['department']} {sim['headcount']}명 → {sim['target_process']}",
        body_style,
    ))

    sim_data = [
        ['', 'Retraining Path', 'Layoff Path'],
        ['Total Cost',
         f"{sim['retraining_path']['total_cost']:,}만원",
         f"{sim['layoff_path']['total_cost']:,}만원"],
        ['Duration', f"{sim['retraining_path']['transition_months']}개월", '-'],
        ['Success Rate', f"{sim['retraining_path']['success_probability']*100:.0f}%", '-'],
    ]
    t = Table(sim_data, colWidths=[40*mm, 60*mm, 60*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#334155')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BACKGROUND', (1, 1), (1, -1), colors.HexColor('#d1fae5')),
        ('BACKGROUND', (2, 1), (2, -1), colors.HexColor('#fee2e2')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(t)
    elements.append(Paragraph(
        f"Cost Savings: <b>{sim['cost_savings']:,}만원</b> | Recommendation: <b>{sim['recommendation']}</b>",
        body_style,
    ))

    # === 3. Employment Stabilization Roadmap ===
    elements.append(Paragraph("3. Employment Stabilization Roadmap", h2_style))

    stab_details = stability['details']
    stab_data = [
        ['Metric', 'Value', 'Status'],
        ['Stability Score', f"{stability['score']}", stability['grade']],
        ['Total Employees', f"{stab_details['total_employees']}", '-'],
        ['Short-term Contract Ratio', f"{stab_details['short_term_contract_ratio']*100:.1f}%",
         'Warning' if stab_details['short_term_contract_ratio'] > 0.1 else 'OK'],
        ['Avg Tenure (months)', f"{stab_details['avg_tenure_months']}", '-'],
        ['11-month Turnover Ratio', f"{stab_details['turnover_11m_ratio']*100:.1f}%",
         'Alert' if stab_details['turnover_11m_ratio'] > 0.1 else 'OK'],
        ['Training Participation', f"{stab_details['training_participation_ratio']*100:.1f}%",
         'Low' if stab_details['training_participation_ratio'] < 0.5 else 'OK'],
    ]
    t = Table(stab_data, colWidths=[60*mm, 50*mm, 40*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f59e0b')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(t)

    # 권고사항
    if stability['recommendations']:
        elements.append(Spacer(1, 3*mm))
        elements.append(Paragraph("<b>Recommendations:</b>", body_style))
        for rec in stability['recommendations']:
            elements.append(Paragraph(f"• {rec}", body_style))

    # === 4. Incentives ===
    elements.append(Paragraph("4. Available Incentives", h2_style))

    inc_data = [['Name', 'Condition', 'Amount', 'Duration']]
    for inc in incentives:
        inc_data.append([inc['name'], inc['condition'], inc['amount'], inc['duration']])

    t = Table(inc_data, colWidths=[40*mm, 45*mm, 40*mm, 30*mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7c3aed')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
    ]))
    elements.append(t)

    # 푸터
    elements.append(Spacer(1, 10*mm))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
    elements.append(Paragraph(
        "Generated by ESG-DX | Data-driven Green Transition &amp; Employment Stabilization Solution",
        small_style,
    ))

    doc.build(elements)
    return buffer.getvalue()
