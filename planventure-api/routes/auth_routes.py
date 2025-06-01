from flask import Blueprint, jsonify, request
from models import User, db
from utils.email_service import generate_reset_token, verify_reset_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("password")

    # Verify token and get email
    email, is_valid = verify_reset_token(token)

    if not is_valid:
        return (
            jsonify(
                {
                    "error": "Password reset link has expired or is invalid. Please request a new one."
                }
            ),
            400,
        )

    try:
        user = User.query.filter_by(email=email).first()
        if user:
            user.set_password(new_password)
            db.session.commit()
            return jsonify({"message": "Password successfully reset"})
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    token = generate_reset_token(email)
    reset_link = f"{current_app.config['FRONTEND_URL']}/reset-password?token={token}"

    send_reset_email(email, reset_link)

    return jsonify({"message": "Password reset email sent"})
