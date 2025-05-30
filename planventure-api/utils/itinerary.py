from datetime import datetime, timedelta


def generate_itinerary_template(start_date: str, end_date: str) -> dict:
    """Generate a default itinerary template based on trip dates."""
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        days = (end - start).days + 1

        itinerary = {"days": {}, "notes": "", "estimated_budget": 0}

        for day in range(days):
            current_date = start + timedelta(days=day)
            date_str = current_date.strftime("%Y-%m-%d")

            itinerary["days"][date_str] = {
                "activities": [],
                "meals": {"breakfast": "", "lunch": "", "dinner": ""},
                "accommodation": "",
                "transportation": "",
                "notes": "",
            }

        return itinerary
    except ValueError:
        return None
