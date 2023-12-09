from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_PORT: int
    POSTGRES_PASSWORD: str
    POSTGRES_USER: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_HOSTNAME: str

    JWT_PUBLIC_KEY: str
    JWT_PRIVATE_KEY: str

    REFRESH_TOKEN_EXPIRES_IN: int
    ACCESS_TOKEN_EXPIRES_IN: int
    JWT_ALGORITHM: str
    CLIENT_ORIGIN: str

    CLOUD_NAME: str
    API_KEY: str
    API_SECRET: str
    
    SECRET_KEY: str
    ALGORITHM: str

    LINKEDIN_CLIENT_ID : str
    LINKEDIN_CLIENT_SECRET: str
    LINKEDIN_REDIRECT: str

    RECAPTCHA_CODE_KEY: str

    YAGMAIL_USER: str
    YAGMAIL_PASS: str

    RESET_FORM_LINK: str



    class Config:
        env_file = './.env'


settings = Settings()