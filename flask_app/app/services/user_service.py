import logging
from app.database import get_user_collection
from bson.objectid import ObjectId
from typing import Optional

logger = logging.getLogger(__name__)

class UserService:
    @staticmethod
    def validate_user_existence(user_id: str) -> bool:
        """
        Validate if the user exists in MongoDB.

        Args:
            user_id (str): The ID of the user to validate.

        Returns:
            bool: True if the user exists, False otherwise.

        Raises:
            ValueError: If the user_id is invalid.
            Exception: If there's an error during database operation.
        """
        if not isinstance(user_id, str) or not user_id:
            logger.error(f"Invalid user_id: {user_id}")
            raise ValueError("Invalid user_id")

        try:
            user_collection = get_user_collection()
            logger.info(f"Searching for user with id: {user_id}")
            user = user_collection.find_one({"_id": ObjectId(user_id)})

            if user:
                logger.info(f"User found with id: {user_id}")
            else:
                logger.info(f"No user found with id: {user_id}")

            return user is not None
        except Exception as e:
            logger.exception(f"An error occurred while validating user existence: {e}")
            raise

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[dict]:
        """
        Retrieve a user by their ID.

        Args:
            user_id (str): The ID of the user to retrieve.

        Returns:
            Optional[dict]: The user document if found, None otherwise.

        Raises:
            ValueError: If the user_id is invalid.
            Exception: If there's an error during database operation.
        """
        if not isinstance(user_id, str) or not user_id:
            logger.error(f"Invalid user_id: {user_id}")
            raise ValueError("Invalid user_id")

        try:
            user_collection = get_user_collection()
            return user_collection.find_one({"_id": ObjectId(user_id)})
        except Exception as e:
            logger.exception(f"An error occurred while retrieving user: {e}")
            raise
