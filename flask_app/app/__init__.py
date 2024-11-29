from flask import Flask
from flask_cors import CORS
from app.logger import setup_logger

logger = setup_logger('flask_app')

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    from app.api.translate import translate_bp
    from app.api.check_grammar import check_grammar_bp
    from app.api.writing_tips import writing_tips_bp
    from app.api.check_content import check_content_bp

    app.register_blueprint(translate_bp, url_prefix='/api/v1')
    app.register_blueprint(check_grammar_bp, url_prefix='/api/v1')
    app.register_blueprint(writing_tips_bp, url_prefix='/api/v1')
    app.register_blueprint(check_content_bp, url_prefix='/api/v1')

    logger.info('Flask application initialized successfully')

    return app
