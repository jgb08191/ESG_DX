from pydantic import BaseModel


class Settings(BaseModel):
    APP_NAME: str = "ESG-DX 통합 솔루션"
    APP_DESCRIPTION: str = "데이터 기반 기업 친환경 전환 및 고용 안정화(ESG) 통합 솔루션"
    VERSION: str = "1.0.0"
    DEBUG: bool = True


settings = Settings()
