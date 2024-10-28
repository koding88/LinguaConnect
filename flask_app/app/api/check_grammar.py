from flask import Blueprint, request, jsonify
from app.services.user_service import UserService
from app.services.check_grammar_service import CheckGrammarService
import logging

logger = logging.getLogger(__name__)

check_grammar_bp = Blueprint('check_grammar', __name__)

@check_grammar_bp.route('/check_grammar', methods=['POST'])
def ai_check_grammar():
    """
    AI Check Grammar API:
    - Validate user existence in MongoDB.
    - Create a grammar check prompt using LangChain.
    - Return grammar check result.
    """
    logger.info("Received grammar check request")
    data = request.get_json()
    user_id = data.get('user_id')
    text = data.get('text')

    if not user_id or not text:
        logger.warning("Missing user_id or text in request")
        return jsonify({"error": "Missing user_id or text"}), 400

    user_service = UserService()
    try:
        if not user_service.validate_user_existence(user_id):
            logger.warning(f"User not found: {user_id}")
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

    try:
        grammar_check_response = CheckGrammarService.grammar_check(text)
        logger.info(f"Grammar check completed successfully for user: {user_id}")
        return jsonify({"message": f"{grammar_check_response}"}), 200

    except Exception as e:
        logger.error(f"Error during grammar check: {str(e)}")
        return jsonify({"error": "Error during grammar check"}), 500
