import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    with app.app_context():
        db_path = app.config["SQLALCHEMY_DATABASE_URI"].replace("sqlite:///", "")
        db.create_all()
        abs_path = os.path.abspath(db_path)
        logger.info(f"Database created at: {abs_path}")
        logger.info("Database tables created successfully!")
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        logger.info(f"Tables created: {tables}")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")
    sys.exit(1)
