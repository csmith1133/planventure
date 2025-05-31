import base64
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]


def get_gmail_service():
    creds = None
    token_path = os.path.join(os.path.dirname(__file__), "..", "gmail_token.json")
    oauth_path = os.path.join(os.path.dirname(__file__), "..", "gmail_oauth.json")

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(oauth_path, SCOPES)
            creds = flow.run_local_server(port=0)
            with open(token_path, "w") as token:
                token.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def send_reset_email(to_email: str, reset_link: str) -> bool:
    try:
        service = get_gmail_service()
        sender_email = os.getenv("GMAIL_SENDER")
        sender_name = "PlanVenture"

        message = MIMEMultipart()
        message["to"] = to_email
        message["from"] = formataddr((sender_name, sender_email))
        message["subject"] = "Password Reset Request"

        body = f"""
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
        """

        message.attach(MIMEText(body, "html"))
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")

        service.users().messages().send(
            userId="me", body={"raw": raw_message}
        ).execute()

        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
