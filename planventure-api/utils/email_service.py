import base64
import json
import logging
import os
from email.mime.text import MIMEText

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

logger = logging.getLogger(__name__)


def get_gmail_service():
    try:
        oauth_config = json.loads(os.getenv("GMAIL_OAUTH_ACCOUNTS_PAYABLE"))
        token_config = json.loads(os.getenv("GMAIL_TOKEN_ACCOUNTS_PAYABLE"))

        credentials = Credentials(
            token=token_config["token"],
            refresh_token=token_config["refresh_token"],
            token_uri=token_config["token_uri"],
            client_id=oauth_config["installed"]["client_id"],
            client_secret=oauth_config["installed"]["client_secret"],
            scopes=token_config["scopes"],
        )

        return build("gmail", "v1", credentials=credentials)
    except Exception as e:
        logger.error(f"Failed to create Gmail service: {str(e)}")
        return None


def send_reset_email(to_email: str, reset_link: str) -> bool:
    try:
        service = get_gmail_service()
        if not service:
            return False

        message = MIMEText(
            f"""
        <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password.</p>
                <p>Click the following link to reset your password:</p>
                <p><a href="{reset_link}">{reset_link}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this reset, please ignore this email.</p>
                <br>
                <p>Best regards,<br>PlanVenture Team</p>
            </body>
        </html>
        """,
            "html",
        )

        message["to"] = to_email
        message["from"] = "me"
        message["subject"] = "Password Reset Request - PlanVenture"

        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
        service.users().messages().send(userId="me", body={"raw": raw}).execute()

        logger.info(f"Reset email sent successfully to {to_email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False
