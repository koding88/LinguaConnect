from flask import Blueprint, request, jsonify
from app.services.check_content_service import CheckContentService
from app.logger import setup_logger
from http import HTTPStatus

logger = setup_logger(__name__)

check_content_bp = Blueprint("check_content", __name__)


@check_content_bp.route("/check_content", methods=["POST"])
def ai_check_content():
    logger.info("Received check content request")

    # Validate request data
    if not request.is_json:
        logger.error("Request missing JSON data")
        return (
            jsonify({"status": "error", "error": "Request must include JSON data"}),
            HTTPStatus.BAD_REQUEST,
        )

    data = request.get_json()
    content = data.get("content")

    if not content or not isinstance(content, str):
        logger.error("Invalid or missing content in request")
        return (
            jsonify({"status": "error", "error": "Content must be a non-empty string"}),
            HTTPStatus.BAD_REQUEST,
        )

    check_content_service = CheckContentService()

    try:
        # Check content safety
        logger.info(f"Checking content safety for text of length {len(content)}")
        content_safety_result = check_content_service.check_content(content)

        logger.info(
            "Content safety check completed successfully",
            extra={"is_safe": content_safety_result.get("is_safe")},
        )

        return (
            jsonify({"status": "success", "result": content_safety_result}),
            HTTPStatus.OK,
        )

    except Exception as e:
        logger.error(f"Content safety check failed: {str(e)}", exc_info=True)
        return (
            jsonify({"status": "error", "error": "Failed to check content safety"}),
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )
