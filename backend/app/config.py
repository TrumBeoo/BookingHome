import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY: str = os.getenv('SECRET_KEY', "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database settings
    DB_HOST: str = os.getenv('DB_HOST', '127.0.0.1')
    DB_PORT: int = int(os.getenv('DB_PORT', '3306'))
    DB_USERNAME: str = os.getenv('DB_USERNAME', 'root')
    DB_PASSWORD: str = os.getenv('DB_PASSWORD', '')
    DB_DATABASE: str = os.getenv('DB_DATABASE', 'homestay_booking')
    
    # MOMO Payment settings
    MOMO_PARTNER_CODE: str = os.getenv('MOMO_PARTNER_CODE', 'MOMO')
    MOMO_ACCESS_KEY: str = os.getenv('MOMO_ACCESS_KEY', '')
    MOMO_SECRET_KEY: str = os.getenv('MOMO_SECRET_KEY', '')
    MOMO_ENDPOINT: str = os.getenv('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create')
    MOMO_QUERY_ENDPOINT: str = os.getenv('MOMO_QUERY_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/query')
    MOMO_REDIRECT_URL: str = os.getenv('MOMO_REDIRECT_URL', 'http://localhost:3000/payment/success')
    MOMO_NOTIFY_URL: str = os.getenv('MOMO_NOTIFY_URL', 'http://localhost:8000/api/payments/momo/callback')
    
    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.DB_USERNAME}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}"

settings = Settings()

# Export for backward compatibility
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM