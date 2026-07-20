from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "sqlite:///./resumerag.db"
    cors_origins_raw: str = "http://localhost:5173,http://localhost:3000"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    supabase_url: str = ""
    supabase_publishable_key: str = ""
    supabase_service_role_key: str = ""
    max_upload_mb: int = 10

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self):
        return [x.strip() for x in self.cors_origins_raw.split(",") if x.strip()]

settings = Settings()
