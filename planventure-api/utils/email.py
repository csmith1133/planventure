import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_reset_email(to_email: str, reset_link: str, html_template: str = None):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    msg = MIMEMultipart("alternative")
    msg["From"] = smtp_user
    msg["To"] = to_email
    msg["Subject"] = "Reset Your PlanVenture Password"

    # Replace placeholder in HTML template with actual reset link
    if html_template:
        html_content = html_template.replace("RESET_LINK_PLACEHOLDER", reset_link)
        msg.attach(MIMEText(html_content, "html"))
    else:
        # Fallback to plain text
        text_content = f"""
        You requested to reset your password.
        Click the following link to reset your password: {reset_link}
        This link will expire in 1 hour.
        """
        msg.attach(MIMEText(text_content, "plain"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise
