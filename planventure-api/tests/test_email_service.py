import base64
import time
from unittest.mock import patch

import pytest
from utils.email_service import generate_reset_token, verify_reset_token


def test_generate_and_verify_valid_token():
    email = "test@example.com"
    token = generate_reset_token(email)
    retrieved_email, is_valid = verify_reset_token(token)

    assert is_valid
    assert retrieved_email == email


def test_expired_token():
    email = "test@example.com"
    token = generate_reset_token(email)

    # Mock time passing (1 hour and 1 second)
    current_time = int(time.time())
    with patch("time.time", return_value=current_time + 3601):
        retrieved_email, is_valid = verify_reset_token(token)
        assert not is_valid
        assert retrieved_email == email


def test_invalid_token_format():
    token = "invalid_token"
    retrieved_email, is_valid = verify_reset_token(token)

    assert not is_valid
    assert retrieved_email == ""


def test_tampered_token():
    email = "test@example.com"
    token = generate_reset_token(email)
    tampered_token = token + "extra"

    retrieved_email, is_valid = verify_reset_token(tampered_token)
    assert not is_valid


def test_manual_check_expired_token():
    email = "test@example.com"
    # Create a token with timestamp from 1 hour ago
    one_hour_ago = int(time.time()) - 3601
    manual_token = f"{email}:{one_hour_ago}"
    token = base64.urlsafe_b64encode(manual_token.encode()).decode()

    retrieved_email, is_valid = verify_reset_token(token)
    assert not is_valid
    assert retrieved_email == email
