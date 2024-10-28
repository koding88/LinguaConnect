import logging
from app.models import MongoDB

logger = logging.getLogger(__name__)

mongodb = MongoDB()

def get_user_collection():
    try:
        return mongodb.get_collection("users")
    except Exception as e:
        logger.error(f"Error getting user collection: {str(e)}")
        raise

def get_conversation_collection():
    try:
        return mongodb.get_collection("conversations")
    except Exception as e:
        logger.error(f"Error getting conversation collection: {str(e)}")
        raise

def get_messages_collection():
    try:
        return mongodb.get_collection("messages")
    except Exception as e:
        logger.error(f"Error getting messages collection: {str(e)}")
        raise
