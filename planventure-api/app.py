import logging
import os
from datetime import datetime, timedelta
from secrets import token_urlsafe

from blueprints.forms import forms
from database import db
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt_identity, jwt_required
from flask_migrate import Migrate
from models import User
from oauthlib.oauth2 import WebApplicationClient
from utils.auth_middleware import auth_required
from utils.email_service import send_reset_email
from utils.jwt import generate_tokens
from utils.oauth import get_google_config, get_google_provider_cfg, is_allowed_email
from utils.validation import validate_email, validate_password

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Update CORS Configuration
CORS(
    app,
    resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Authorization"],
            "supports_credentials": True,
        }
    },
)


# Simplify after_request handler
@app.after_request
def after_request(response):
    if request.method == "OPTIONS":
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, DELETE, OPTIONS"
        )
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", "sqlite:///planventure.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize SQLAlchemy with app
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)

# Logging configuration
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize OAuth 2 client with Gmail credentials
google_config = get_google_config()
if google_config:
    client = WebApplicationClient(google_config["client_id"])
else:
    logger.error("Failed to initialize Google OAuth client")
    client = None


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

        logger.debug(f"Login attempt for email: {email}")

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            logger.debug(f"User not found: {email}")
            return jsonify({"message": "Invalid email or password"}), 401

        if not user.check_password(password):
            logger.debug(f"Invalid password for user: {email}")
            return jsonify({"message": "Invalid email or password"}), 401

        tokens = generate_tokens(user.id)
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "user": {"id": user.id, "email": user.email},
                    "access_token": tokens["access_token"],
                    "refresh_token": tokens["refresh_token"],
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
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
    logger.debug(f"Current user request: {current_user.id}")
    return jsonify({"id": current_user.id, "email": current_user.email}), 200


@app.route("/auth/delete", methods=["DELETE"])
@jwt_required()
def delete_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No input data provided"}), 400

        password = data.get("password")
        if not password:
            return (
                jsonify({"message": "Password is required for account deletion"}),
                400,
            )

        # Get current user from JWT token
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"message": "User not found"}), 404

        # Verify password before deletion
        if not user.check_password(password):
            return jsonify({"message": "Invalid password"}), 401

        # Delete user and their data
        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "Account deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete account"}), 500


@app.route("/auth/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email", "").lower().strip()

        logger.debug(f"Password reset request for: {email}")

        if not email:
            return jsonify({"message": "Email is required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            logger.debug(f"User not found for password reset: {email}")
            return (
                jsonify({"message": "If an account exists, a reset link will be sent"}),
                200,
            )

        reset_token = token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)

        reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password?token={reset_token}"

        try:
            email_sent = send_reset_email(email, reset_link)
            if email_sent:
                db.session.commit()
                logger.info(f"Password reset email sent to: {email}")
                return jsonify({"message": "Reset link sent successfully"}), 200
            else:
                logger.error(f"Failed to send reset email to: {email}")
                db.session.rollback()
                return jsonify({"message": "Failed to send reset email"}), 500
        except Exception as email_error:
            logger.error(f"Email error: {str(email_error)}")
            db.session.rollback()
            return jsonify({"message": "Failed to send reset email"}), 500

    except Exception as e:
        logger.error(f"Password reset error: {str(e)}")
        db.session.rollback()
        return jsonify({"message": "Failed to process request"}), 500


@app.route("/auth/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
        token = data.get("token")
        new_password = data.get("password")

        if not token or not new_password:
            return jsonify({"message": "Token and new password are required"}), 400

        user = User.query.filter_by(reset_token=token).first()
        if (
            not user
            or not user.reset_token_expires
            or user.reset_token_expires < datetime.utcnow()
        ):
            return jsonify({"message": "Invalid or expired reset token"}), 400

        # Update password
        user.set_password(new_password)
        user.reset_token = None
        user.reset_token_expires = None
        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to reset password"}), 500


@app.route("/auth/test-email", methods=["POST"])
def test_email():
    if not app.debug:
        return jsonify({"message": "Test endpoint only available in debug mode"}), 403

    try:
        data = request.get_json()
        email = data.get("email", "").lower().strip()

        if not email:
            return jsonify({"message": "Email is required"}), 400

        test_link = f"{os.getenv('FRONTEND_URL')}/reset-password?token=test-token-123"
        email_sent = send_reset_email(email, test_link)

        if email_sent:
            logger.info(f"Test email sent successfully to: {email}")
            return jsonify({"message": "Test email sent successfully"}), 200
        else:
            logger.error("Failed to send test email")
            return jsonify({"message": "Failed to send test email"}), 500

    except Exception as e:
        logger.error(f"Test email error: {str(e)}")
        return jsonify({"message": "Failed to process request"}), 500


@app.route("/auth/google/login")
def google_login():
    try:
        if not client:
            logger.error("Google OAuth client not initialized")
            return jsonify({"message": "OAuth configuration error"}), 500

        google_provider_cfg = get_google_provider_cfg()
        if not google_provider_cfg:
            logger.error("Failed to fetch Google provider config")
            return jsonify({"message": "OAuth configuration error"}), 500

        authorization_endpoint = google_provider_cfg["authorization_endpoint"]
        redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")

        logger.debug(f"Using redirect URI: {redirect_uri}")
        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=redirect_uri,
            scope=["openid", "email", "profile"],
        )
        return jsonify({"auth_url": request_uri})
    except Exception as e:
        logger.error(f"Google login error: {str(e)}")
        return jsonify({"message": "Failed to initialize Google login"}), 500


@app.route("/auth/google/login/callback")
def google_callback():
    try:
        if not client:
            logger.error("Google OAuth client not initialized")
            return jsonify({"message": "OAuth configuration error"}), 500

        code = request.args.get("code")
        if not code:
            logger.error("No authorization code received")
            return jsonify({"message": "Missing authorization code"}), 400

        google_provider_cfg = get_google_provider_cfg()
        if not google_provider_cfg:
            logger.error("Failed to fetch Google provider config")
            return jsonify({"message": "OAuth configuration error"}), 500

        redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
        logger.debug(f"Callback with redirect URI: {redirect_uri}")

        try:
            token_endpoint = google_provider_cfg["token_endpoint"]
            token_url, headers, body = client.prepare_token_request(
                token_endpoint,
                authorization_response=request.url,
                redirect_url=redirect_uri,
                code=code,
            )

            token_response = requests.post(
                token_url,
                headers=headers,
                data=body,
                auth=(os.getenv("GOOGLE_CLIENT_ID"), os.getenv("GOOGLE_CLIENT_SECRET")),
            )
            token_response.raise_for_status()  # Raise exception for non-200 responses

            client.parse_request_body_response(token_response.text)

            userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
            uri, headers, body = client.add_token(userinfo_endpoint)
            userinfo_response = requests.get(uri, headers=headers)
            userinfo_response.raise_for_status()

            if userinfo_response.json().get("email_verified"):
                email = userinfo_response.json()["email"]
                if not is_allowed_email(email):
                    return jsonify({"message": "Domain not allowed"}), 403

                user = User.query.filter_by(email=email).first()
                if not user:
                    user = User(email=email)
                    db.session.add(user)
                    db.session.commit()

                tokens = generate_tokens(user.id)
                success_url = f"{os.getenv('GOOGLE_SUCCESS_REDIRECT')}?token={tokens['access_token']}"
                return redirect(success_url)

            return jsonify({"message": "User email not verified"}), 400
        except requests.exceptions.RequestException as e:
            logger.error(f"OAuth request failed: {str(e)}")
            return jsonify({"message": "Failed to authenticate with Google"}), 500

    except Exception as e:
        logger.error(f"Google callback error: {str(e)}")
        return jsonify({"message": "Authentication failed"}), 500


# Add debug logging for routes
@app.before_request
def log_request_info():
    logger.debug(f"Request Headers: {dict(request.headers)}")
    logger.debug(f"Request Method: {request.method}")
    logger.debug(f"Request URL: {request.url}")
    if request.is_json:
        logger.debug(f"Request Data: {request.get_json()}")


# Register blueprints
app.register_blueprint(forms, url_prefix="/api/forms")  # Changed from "/api"

print("Registered routes:", [str(rule) for rule in app.url_map.iter_rules()])

if __name__ == "__main__":
    # Use 127.0.0.1 explicitly for local development
    app.run(host="127.0.0.1", port=5000, debug=True)
