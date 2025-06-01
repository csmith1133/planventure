import base64
import json
import logging
import os
import time
from datetime import datetime
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
            logger.error("Gmail service initialization failed")
            return False

        # Complete HelloFresh logo SVG
        logo_svg = """
        <svg width="180" height="60" viewBox="0 0 1600 522" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path d="M602.5408,86.1364049 C608.10727,95.7149667 608.230029,107.517369 602.864,117.209816 C583.728916,146.965487 575.125619,182.286918 578.432,217.51708 L578.432,217.449828 C585.0144,316.101423 530.0064,419.649571 429.8912,477.94384 C329.776,536.234908 212.6432,532.808282 130.2624,478.276896 L130.2624,478.34735 C101.316151,458.033914 66.397179,448.026056 31.0944,449.925571 C20.0149295,449.789938 9.82210969,443.836493 4.25481707,434.249048 C-1.31247555,424.661603 -1.43476739,412.851374 3.9328,403.150528 C23.0618887,373.392888 31.6574056,338.071015 28.3424,302.843264 L28.3424,302.913718 C21.7952,204.262123 76.8032,100.723583 176.9184,42.4677423 C277.0336,-15.7913006 394.1664,-12.3999018 476.5472,42.1314847 C505.500072,62.4374804 540.420886,72.4403878 575.7248,70.540454 C586.779768,70.6662458 596.958609,76.5861707 602.5408,86.1364049" fill="#96DC14"/>
                <path d="M1055.8688,471.945644 L1055.8688,273.079656 L1196.4512,273.079656 L1196.4512,317.443252 L1111.2128,317.443252 L1111.2128,351.597423 L1185.1616,351.597423 L1185.1616,389.757865 L1111.2128,389.757865 L1111.2128,427.290626 L1199.264,427.290626 L1199.264,471.945644 L1055.8688,471.945644 L1055.8688,471.945644 Z" fill="#232323"/>
                <!-- Rest of the text paths from your SVG -->
            </g>
        </svg>"""

        # Create message with proper Content-Type
        message = MIMEText(
            f"""
        <!DOCTYPE html>
        <html style="background-color: purple; margin: 0; padding: 0;">
        <head>
            <meta charset="utf-8">
            <style>
                * {{
                    box-sizing: border-box;
                }}
                html, body {{
                    margin: 0;
                    padding: 0;
                    min-height: 100%;
                    background: transparent !important;
                    background-color: transparent !important;
                }}
                .email-container {{
                    margin: 0 auto;
                }}
                .header {{
                    padding: 30px 20px 20px;
                    border-bottom: 1px solid #eee;
                }}
                .header img {{
                    display: block;
                    height: 60px;
                    margin: 0 auto;
                }}
                .content {{
                    padding: 40px 20px;
                    background: white;
                    color: #232323;
                }}
                .content h1, .content p {{
                    text-align: left;
                }}
                .button-container {{
                    text-align: center;
                    margin: 30px 0;
                }}
                .button {{
                    display: inline-block;
                    width: 80%;
                    max-width: 300px;
                    padding: 16px 32px;
                    background-color: #009646;
                    color: white !important;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 16px;
                    text-align: center;
                    box-sizing: border-box;
                }}
                .footer {{
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                    margin-top: 20px;
                    padding: 30px 20px;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="https://cdn.freebiesupply.com/logos/large/2x/hellofresh-logo.svg" alt="HelloFresh Logo"/>
                </div>
                <div class="content">
                    <h1>Reset Your Password</h1>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <div class="button-container">
                        <a href="{reset_link}" class="button">Reset Password</a>
                    </div>
                    <p>If you didn't request this change, you can safely ignore this email.</p>
                    <p>This link will expire in 1 hour for security reasons.</p>
                </div>
                <div class="footer">
                    <p>© {datetime.now().year} HelloFresh. All rights reserved.</p>
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """,
            "html",
            "utf-8",
        )

        message["to"] = to_email
        message["from"] = "me"
        message["subject"] = "Password Reset Request - Fin FresHQ"
        message["Content-Type"] = "text/html; charset=utf-8"

        try:
            raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
            service.users().messages().send(userId="me", body={"raw": raw}).execute()
            logger.info(f"Reset email sent successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send message: {str(e)}")
            return False

    except Exception as e:
        logger.error(f"Failed in email preparation: {str(e)}")
        return False


def generate_reset_token(email: str) -> str:
    # Include timestamp in the token
    timestamp = int(time.time())
    token_data = f"{email}:{timestamp}"
    return base64.urlsafe_b64encode(token_data.encode()).decode()


def verify_reset_token(token: str) -> tuple[str, bool]:
    try:
        token_data = base64.urlsafe_b64decode(token.encode()).decode()
        email, timestamp = token_data.split(":")
        timestamp = int(timestamp)

        # Check if token is older than 1 hour
        current_time = int(time.time())
        if current_time - timestamp > 3600:  # 3600 seconds = 1 hour
            return email, False

        return email, True

    except Exception as e:
        logger.error(f"Invalid reset token: {str(e)}")
        return "", False
