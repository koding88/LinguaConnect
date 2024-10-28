from flask import Blueprint, request, jsonify
from app.services.user_service import UserService
from app.services.conversation_service import ConversationService
from app.services.translate_service import TranslateService
import logging
from app.logger import setup_logger

logger = setup_logger(__name__)

translate_bp = Blueprint('translate', __name__)

@translate_bp.route('/translate', methods=['POST'])
def ai_translate():
    """
    AI Translate API:
    - Validate user existence in MongoDB.
    - Fetch conversation between sender and recipient.
    - Create translation prompt using context and LangChain.
    - Return translated sentence.
    """
    logger.info("Received translation request")
    data = request.get_json()
    sender_id = data.get('sender_id')
    recipient_id = data.get('recipient_id')
    content = data.get('content')
    language = data.get('language')

    user_service = UserService()
    conversation_service = ConversationService()

    try:
        # Validate both sender and recipient existence
        if not user_service.validate_user_existence(sender_id) or not user_service.validate_user_existence(recipient_id):
            logger.warning(f"One or both users not found: sender_id={sender_id}, recipient_id={recipient_id}")
            return jsonify({"error": "One or both users not found"}), 404

        # Fetch conversation context
        logger.info(f"Fetching conversation between sender_id={sender_id} and recipient_id={recipient_id}")
        conversation = conversation_service.fetch_conversation(sender_id, recipient_id)

        # Translate sentence
        logger.info("Translating sentence")
        translated_content = TranslateService.translate_sentence(conversation, content, language)

        logger.info("Translation completed successfully")
        return jsonify({"message": translated_content}), 200

    except Exception as e:
        logger.error(f"An error occurred during translation: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
