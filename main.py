"""ESG-DX 통합 솔루션 - 메인 애플리케이션"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import io

from app.core.config import settings
from app.api.routes import router as api_router
from app.services.report_generator import generate_pdf_report

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.VERSION,
)

# 정적 파일 및 템플릿
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# API 라우터
app.include_router(api_router)


# === 페이지 라우트 ===
@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse(
        request, "pages/dashboard.html", {"active": "dashboard"}
    )


@app.get("/workforce", response_class=HTMLResponse)
async def workforce(request: Request):
    return templates.TemplateResponse(
        request, "pages/workforce.html", {"active": "workforce"}
    )


@app.get("/stability", response_class=HTMLResponse)
async def stability(request: Request):
    return templates.TemplateResponse(
        request, "pages/stability.html", {"active": "stability"}
    )


@app.get("/safety", response_class=HTMLResponse)
async def safety(request: Request):
    return templates.TemplateResponse(
        request, "pages/safety.html", {"active": "safety"}
    )


@app.get("/simulation", response_class=HTMLResponse)
async def simulation(request: Request):
    return templates.TemplateResponse(
        request, "pages/simulation.html", {"active": "simulation"}
    )


@app.get("/report/pdf")
async def download_report():
    pdf_bytes = generate_pdf_report()
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=ESG-DX_Report.pdf"},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
