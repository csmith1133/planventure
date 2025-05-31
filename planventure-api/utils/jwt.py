from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from datetime import timedelta
from typing import Dict


def generate_tokens(user_id: int, remember_me: bool = False) -> Dict[str, str]:
    """Generate access and refresh tokens for a user."""
    access_expires = timedelta(days=7 if remember_me else 1)
    refresh_expires = timedelta(days=30 if remember_me else 1)

    access_token = create_access_token(identity=user_id, expires_delta=access_expires)
    refresh_token = create_refresh_token(
        identity=user_id, expires_delta=refresh_expires
    )

    return {"access_token": access_token, "refresh_token": refresh_token}
