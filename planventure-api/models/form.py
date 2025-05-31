from datetime import datetime
from database import db


class Form(db.Model):
    __tablename__ = "forms"

    id = db.Column(db.Integer, primary_key=True)
    form_type = db.Column(
        db.String(50), nullable=False
    )  # Identifies different form types
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    data = db.Column(db.JSON, nullable=False)  # Stores form data flexibly
    files = db.Column(db.JSON)  # Store file URLs/references
    status = db.Column(db.String(20), default="pending")  # For form processing status
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    user = db.relationship("User", backref=db.backref("forms", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "form_type": self.form_type,
            "data": self.data,
            "files": self.files,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
