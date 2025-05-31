import json
import logging
import os

import requests

logger = logging.getLogger(__name__)


def get_google_provider_cfg():
    """Fetch Google's OpenID Connect configuration."""
    try:
        response = requests.get(
            "https://accounts.google.com/.well-known/openid-configuration"
        )
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch Google provider config: {e}")
        return None


def get_google_config():
    """Get Google OAuth configuration."""
    try:
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")

        if not client_id or not client_secret:
            logger.error("Missing Google OAuth credentials")
            return None

        return {
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
            "application_name": os.getenv("APPLICATION_NAME", "PlanVenture"),
        }
    except Exception as e:
        logger.error(f"Error getting Google config: {e}")
        return None


def is_allowed_email(email):
    """Check if email domain is allowed."""
    try:
        domain = email.split("@")[1]
        allowed_domains = ["hellofresh.com"]  # Update with your domains
        return domain in allowed_domains
    except (IndexError, AttributeError):
        return False
