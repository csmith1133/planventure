from datetime import datetime
from database import db
from utils.auth import hash_password, verify_password
from utils.jwt import generate_tokens


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<User {self.email}>"

    def set_password(self, password: str):
        """Set the user's password hash."""
        self.password_hash = hash_password(password)

    def check_password(self, password: str) -> bool:
        """Check if the provided password matches the hash."""
        return verify_password(password, self.password_hash)

    def get_tokens(self):
        """Generate access and refresh tokens for the user."""
        return generate_tokens(self.id)

    @staticmethod
    def get_user_from_token(identity):
        """Get user instance from token identity."""
        return User.query.get(identity)
