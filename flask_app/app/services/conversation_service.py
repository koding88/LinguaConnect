import requests
import json
import logging
from typing import List, Optional

logger = logging.getLogger(__name__)

class ConversationService:
    @staticmethod
    def fetch_conversation(sender_id: str, recipient_id: str) -> List[str]:
        """
        Fetch conversation between the sender and recipient from MongoDB.

        Args:
            sender_id (str): ID of the message sender
            recipient_id (str): ID of the message recipient

        Returns:
            List[str]: List of formatted conversation messages

        Raises:
            requests.RequestException: If API request fails
            ValueError: If response data is invalid
        """
        try:
            logger.info(f"Fetching conversation between sender {sender_id} and recipient {recipient_id}")

            url = f"http://localhost:3000/api/v1/messages/ai/{recipient_id}"
            payload = {
                "userId": sender_id
            }
            response = requests.post(url, json=payload)
            response.raise_for_status()

            data = response.json()
            messages = data.get("data")

            if not isinstance(messages, list):
                logger.error("Invalid response format - messages is not a list")
                raise ValueError("Invalid response format")

            conversation = []
            for msg in messages:
                try:
                    prefix = f"{msg['senderId']['full_name']}: " if isinstance(msg['senderId'], dict) else f"{msg['receiverId']['full_name']}: "
                    conversation.append(f"{prefix}{msg['message']}")
                except KeyError as e:
                    logger.warning(f"Message missing required field: {e}")
                    continue

            logger.info(f"Successfully fetched {len(conversation)} messages")
            return conversation

        except requests.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error fetching conversation: {str(e)}")
            raise
