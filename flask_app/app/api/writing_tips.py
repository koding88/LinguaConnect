from flask import Blueprint, request, jsonify
from app.services.user_service import UserService
from app.services.conversation_service import ConversationService
from app.services.writing_tips_service import WritingTipsService
import logging

logger = logging.getLogger(__name__)

writing_tips_bp = Blueprint('writing_tips', __name__)

@writing_tips_bp.route('/writing_tips', methods=['POST'])
def ai_writing_tips():
    """
    AI Writing Tips API:
    - Validate user existence in MongoDB.
    - Fetch conversation between sender and recipient.
    - Create a writing tips prompt using LangChain.
    - Return writing tips.
    """
    logger.info("Received writing tips request")
    data = request.get_json()
    sender_id = data.get('sender_id')
    recipient_id = data.get('recipient_id')
    content = data.get('content')

    print(f"sender_id: {sender_id}, recipient_id: {recipient_id}, content: {content}")

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

        # Generate writing tips
        logger.info("Generating writing tips")
        writing_tips = WritingTipsService.generate_writing_tips(conversation, content)

        logger.info("Writing tips generated successfully")
        return jsonify({"message": writing_tips}), 200

    except Exception as e:
        logger.error(f"An error occurred during writing tips generation: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
