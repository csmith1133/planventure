from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os
from dotenv import load_dotenv
from database import db
from models import User
from datetime import timedelta
from utils.jwt import generate_tokens
from utils.validation import validate_email, validate_password
from utils.auth_middleware import auth_required

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", "sqlite:///planventure.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize SQLAlchemy with app
db.init_app(app)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
)  # Remove default value for security
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)


@app.route("/")
def home():
    return jsonify({"message": "Welcome to PlanVenture API"})


@app.route("/health")
def health_check():
    return jsonify({"status": "healthy"})


# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    return jsonify({"message": "Token has expired"}), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"message": "Invalid token"}), 401


@jwt.unauthorized_loader
def unauthorized_callback(error):
    return jsonify({"message": "Missing Authorization Header"}), 401


@jwt.needs_fresh_token_loader
def token_not_fresh_callback(jwt_header, jwt_data):
    return jsonify({"message": "Fresh token required"}), 401


@app.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No input data provided"}), 400

        email = data.get("email", "").lower().strip()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "Invalid credentials"}), 401

        if not user.check_password(password):
            return jsonify({"message": "Invalid credentials"}), 401

        tokens = generate_tokens(user.id)
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "user": {"id": user.id, "email": user.email},
                    **tokens,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"message": "Login failed"}), 500


@app.route("/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    tokens = generate_tokens(identity)
    return jsonify(tokens), 200


@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")

    # Validate email format
    if not validate_email(email):
        return jsonify({"message": "Invalid email format"}), 400

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    # Validate password
    is_valid, message = validate_password(password)
    if not is_valid:
        return jsonify({"message": message}), 400

    # Create new user
    try:
        new_user = User(email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        # Generate tokens for automatic login
        tokens = generate_tokens(new_user.id)
        return jsonify({"message": "User registered successfully", **tokens}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Registration failed"}), 500


# Protected route example
@app.route("/api/me")
@auth_required()
def get_current_user(current_user):
    return jsonify({"id": current_user.id, "email": current_user.email}), 200


if __name__ == "__main__":
    app.run(debug=True)
