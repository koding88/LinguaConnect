from pymongo import MongoClient
from app.config.settings import Config
from langchain_together import ChatTogether

class MongoDB:
    def __init__(self):
        self.client = MongoClient(Config.MONGO_URI)
        self.db = self.client.get_database("test")

    def get_collection(self, collection_name):
        return self.db.get_collection(collection_name)

class LangChain:
    def __init__(self):
        self.chat_together = ChatTogether(
            model=Config.TOGETHER_MODEL,
            temperature=0,
            max_tokens=8000,
            together_api_key=Config.TOGETHER_API_KEY
        )
