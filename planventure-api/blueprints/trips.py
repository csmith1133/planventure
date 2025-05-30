from flask import Blueprint, jsonify, request
from models import Trip
from database import db
from utils.auth_middleware import auth_required
from utils.itinerary import generate_itinerary_template

trips = Blueprint("trips", __name__)


@trips.route("/trips", methods=["POST"])
@auth_required()
def create_trip(current_user):
    data = request.get_json()

    # Validate required fields
    required_fields = ["destination", "start_date", "end_date"]
    if not all(field in data for field in required_fields):
        missing_fields = [field for field in required_fields if field not in data]
        return (
            jsonify(
                {"message": "Missing required fields", "missing_fields": missing_fields}
            ),
            400,
        )

    try:
        # Convert string dates to datetime objects
        from datetime import datetime

        try:
            start_date = datetime.strptime(data["start_date"], "%Y-%m-%d")
            end_date = datetime.strptime(data["end_date"], "%Y-%m-%d")
        except ValueError:
            return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400

        # Validate date logic
        if start_date > end_date:
            return jsonify({"message": "Start date must be before end date"}), 400

        # Validate and sanitize optional fields
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        if latitude is not None and not isinstance(latitude, (int, float)):
            return jsonify({"message": "Latitude must be a number"}), 400
        if longitude is not None and not isinstance(longitude, (int, float)):
            return jsonify({"message": "Longitude must be a number"}), 400

        # Generate default itinerary if none provided
        itinerary = data.get("itinerary")
        if not itinerary:
            itinerary = generate_itinerary_template(
                data["start_date"], data["end_date"]
            )
            if not itinerary:
                return jsonify({"message": "Invalid date format"}), 400

        new_trip = Trip(
            user_id=current_user.id,
            destination=data["destination"].strip(),
            start_date=start_date,
            end_date=end_date,
            latitude=latitude,
            longitude=longitude,
            itinerary=itinerary,
        )

        db.session.add(new_trip)
        db.session.commit()

        return jsonify({"message": "Trip created successfully", "id": new_trip.id}), 201

    except Exception as e:
        db.session.rollback()
        # Log the actual error for debugging
        print(f"Error creating trip: {str(e)}")
        return jsonify({"message": "Failed to create trip", "error": str(e)}), 500


@trips.route("/trips", methods=["GET"])
@auth_required()
def get_trips(current_user):
    try:
        user_trips = Trip.query.filter_by(user_id=current_user.id).all()
        return (
            jsonify(
                [
                    {
                        "id": trip.id,
                        "destination": trip.destination,
                        "start_date": trip.start_date,
                        "end_date": trip.end_date,
                        "latitude": trip.latitude,
                        "longitude": trip.longitude,
                        "itinerary": trip.itinerary,
                    }
                    for trip in user_trips
                ]
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": "Failed to fetch trips"}), 500


@trips.route("/trips/<int:trip_id>", methods=["GET"])
@auth_required()
def get_trip(current_user, trip_id):
    try:
        trip = Trip.query.filter_by(id=trip_id, user_id=current_user.id).first()
        if not trip:
            return jsonify({"message": "Trip not found"}), 404
        return (
            jsonify(
                {
                    "id": trip.id,
                    "destination": trip.destination,
                    "start_date": trip.start_date,
                    "end_date": trip.end_date,
                    "latitude": trip.latitude,
                    "longitude": trip.longitude,
                    "itinerary": trip.itinerary,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": "Failed to fetch trip"}), 500


@trips.route("/trips/<int:trip_id>", methods=["PUT"])
@auth_required()
def update_trip(current_user, trip_id):
    data = request.get_json()
    try:
        trip = Trip.query.filter_by(id=trip_id, user_id=current_user.id).first()
        if not trip:
            return jsonify({"message": "Trip not found"}), 404

        trip.destination = data.get("destination", trip.destination)
        trip.start_date = data.get("start_date", trip.start_date)
        trip.end_date = data.get("end_date", trip.end_date)
        trip.latitude = data.get("latitude", trip.latitude)
        trip.longitude = data.get("longitude", trip.longitude)
        trip.itinerary = data.get("itinerary", trip.itinerary)

        db.session.commit()
        return jsonify({"message": "Trip updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update trip"}), 500


@trips.route("/trips/<int:trip_id>", methods=["DELETE"])
@auth_required()
def delete_trip(current_user, trip_id):
    try:
        trip = Trip.query.filter_by(id=trip_id, user_id=current_user.id).first()
        if not trip:
            return jsonify({"message": "Trip not found"}), 404

        db.session.delete(trip)
        db.session.commit()
        return jsonify({"message": "Trip deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete trip"}), 500
