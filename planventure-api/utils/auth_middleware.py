from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User


def auth_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
                current_user_id = get_jwt_identity()
                current_user = User.query.get(current_user_id)

                if not current_user:
                    return jsonify({"message": "User not found"}), 401

                return fn(current_user, *args, **kwargs)
            except Exception as e:
                return jsonify({"message": "Authentication failed"}), 401

        return decorator

    return wrapper
