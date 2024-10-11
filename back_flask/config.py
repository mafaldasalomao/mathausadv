import os
from datetime import timedelta

from dotenv import load_dotenv


load_dotenv()

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


class Config:
    SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-cid-tec-mathausadv")
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", False)
    JWT_BLACKLIST_ENABLED = True
    JWT_COOKIE_SECURE = os.getenv("JWT_COOKIE_SECURE", False)
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_REFRESH_COOKIE_PATH = '/'
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", 'postgresql://postgres:apocalipse1007@104.248.32.80:5432/db_mathausadv')
    DEBUG = True
    # SQLALCHEMY_ECHO=True


class ProdConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "postgresql://postgres:apocalipse1007@104.248.32.80:5432/db_mathausadv")
    DEBUG = os.getenv("DEBUG", False)
    SQLALCHEMY_ECHO = os.getenv("ECHO", False)
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", False)


# class TestConfig(Config):
#     SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
#     SQLALCHEMY_ECHO = False
#     TESTING = True
