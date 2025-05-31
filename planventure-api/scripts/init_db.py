import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db
from models import User, Form  # Update imports to reflect current models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    with app.app_context():
        db.create_all()
        logger.info("Database created successfully!")
        tables = db.inspect(db.engine).get_table_names()
        logger.info(f"Tables created: {tables}")
except Exception as e:
    logger.error(f"Error creating database: {str(e)}")
    sys.exit(1)
