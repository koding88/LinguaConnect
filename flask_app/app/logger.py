import logging
import os
from logging.handlers import RotatingFileHandler
from typing import Optional

# Create logs directory if it doesn't exist
LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Define log file path
LOG_FILE = os.path.join(LOG_DIR, 'app.log')

# Configure base logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def setup_logger(name: str) -> logging.Logger:
    """
    Set up and configure a logger with file and console handlers.

    Args:
        name: The name of the logger to create

    Returns:
        logging.Logger: Configured logger instance
    """
    logger = logging.getLogger(name)

    # Only add handlers if none exist
    if not logger.handlers:
        # Configure log format
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )

        # Add rotating file handler
        file_handler = RotatingFileHandler(
            filename=LOG_FILE,
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5,          # Keep 5 backup files
            encoding='utf-8'
        )
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)

        # Add console stream handler
        stream_handler = logging.StreamHandler()
        stream_handler.setLevel(logging.INFO)
        stream_handler.setFormatter(formatter)

        # Add both handlers to logger
        logger.addHandler(file_handler)
        logger.addHandler(stream_handler)

        # Prevent log propagation to avoid duplicate logs
        logger.propagate = False

    return logger
