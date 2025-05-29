from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from datetime import timedelta
from typing import Dict


def generate_tokens(user_id: int) -> Dict[str, str]:
    """Generate access and refresh tokens for a user."""
    access_token = create_access_token(
        identity=user_id, expires_delta=timedelta(hours=1)
    )
    refresh_token = create_refresh_token(
        identity=user_id, expires_delta=timedelta(days=30)
    )
    return {"access_token": access_token, "refresh_token": refresh_token}
