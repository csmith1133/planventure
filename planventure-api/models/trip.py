from datetime import datetime
from database import db
from utils.itinerary import generate_itinerary_template


class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    destination = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    itinerary = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationship
    user = db.relationship(
        "User",
        backref=db.backref("trips", lazy=True, cascade="all, delete-orphan"),
    )

    def __repr__(self):
        return f"<Trip {self.destination}>"

    @property
    def full_itinerary(self):
        """Returns itinerary with default template merged with custom data."""
        try:
            default_template = generate_itinerary_template(
                self.start_date.strftime("%Y-%m-%d"),
                self.end_date.strftime("%Y-%m-%d"),
            )

            if not self.itinerary or not isinstance(self.itinerary, dict):
                return default_template

            # Deep merge stored data with template
            result = default_template.copy()

            # Merge days
            for date, stored_day in self.itinerary.get("days", {}).items():
                if date in result["days"]:
                    template_day = result["days"][date]

                    # Merge activities
                    template_day["activities"].extend(stored_day.get("activities", []))

                    # Merge meals
                    for meal, details in stored_day.get("meals", {}).items():
                        if meal in template_day["meals"]:
                            template_day["meals"][meal].update(details)

                    # Merge accommodation
                    template_day["accommodation"].update(
                        stored_day.get("accommodation", {})
                    )

                    # Merge transportation
                    template_day["transportation"].update(
                        stored_day.get("transportation", {})
                    )

                    # Merge notes
                    if stored_day.get("notes"):
                        template_day["notes"] = stored_day["notes"]

            # Merge top-level fields
            result["notes"] = self.itinerary.get("notes", result["notes"])
            result["estimated_budget"] = self.itinerary.get(
                "estimated_budget", result["estimated_budget"]
            )
            result["overview"].update(self.itinerary.get("overview", {}))

            return result
        except Exception as e:
            logging.error(f"Error generating full itinerary: {str(e)}")
            return self.itinerary or {}
