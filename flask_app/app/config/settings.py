import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """
    Application configuration class.
    """
    MONGO_URI = os.getenv("MONGO_URI")
    TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
    TOGETHER_MODEL = os.getenv("TOGETHER_MODEL")
    FLASK_APP = os.environ.get('FLASK_APP')
    FLASK_ENV = os.environ.get('FLASK_ENV')
    SQLITE_CACHE_PATH = os.getenv("SQLITE_CACHE_PATH")
