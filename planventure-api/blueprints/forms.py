import logging

from database import db
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models.purchase_request import PurchaseRequest

logger = logging.getLogger(__name__)
forms = Blueprint("forms", __name__, url_prefix="/api/forms")  # Keep original prefix


@forms.before_request
def log_forms_request():
    """Log details about incoming requests"""
    logger.info(f"Incoming request: {request.method} {request.path}")
    logger.info(f"Headers: {dict(request.headers)}")
    if request.is_json:
        logger.info(f"JSON Data: {request.get_json()}")


@forms.route("/purchase-request", methods=["POST"])
@jwt_required()
def submit_purchase_request():
    try:
        logger.info("Processing purchase request submission")
        user_id = get_jwt_identity()
        logger.info(f"User ID from token: {user_id}")

        # Validate token
        if not user_id:
            return jsonify({"message": "Invalid or missing token"}), 401

        logger.debug(f"Processing request for user: {user_id}")
        logger.debug(f"Request headers: {request.headers}")

        data = request.get_json()
        logger.debug(f"Received purchase request data: {data}")  # Add logging

        purchase_request = PurchaseRequest(
            user_id=user_id,  # Set from token, not from form data
            email=data["email"],
            title=data["title"],
            description=data["description"],
            amount=data["amount"],
            category=data["category"],
            priority=data["priority"],
            justification=data["justification"],
        )

        db.session.add(purchase_request)
        db.session.commit()

        return jsonify(purchase_request.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error processing purchase request: {str(e)}")
        return jsonify({"message": str(e)}), 400


@forms.route("/purchase-requests", methods=["GET"])
@jwt_required()
def get_purchase_requests():
    """Get all purchase requests for the current user"""
    try:
        user_id = get_jwt_identity()
        requests = (
            PurchaseRequest.query.filter_by(user_id=user_id)
            .order_by(PurchaseRequest.created_at.desc())
            .all()
        )
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        logger.error(f"Error fetching purchase requests: {str(e)}")
        return jsonify({"message": str(e)}), 500


@forms.route(
    "/purchase-request/<int:request_id>", methods=["GET"]
)  # Remove 'forms' from route
@jwt_required()
def get_purchase_request(request_id):
    try:
        user_id = get_jwt_identity()
        request = PurchaseRequest.query.filter_by(
            id=request_id, user_id=user_id
        ).first()

        if not request:
            return jsonify({"message": "Request not found"}), 404

        return jsonify(request.to_dict()), 200
    except Exception as e:
        logger.error(f"Error fetching purchase request {request_id}: {str(e)}")
        return jsonify({"message": str(e)}), 400


@forms.route("/purchase-request/test", methods=["POST"])  # Remove 'forms' from route
@jwt_required()
def test_purchase_request():
    """Test endpoint to create a sample purchase request"""
    try:
        user_id = get_jwt_identity()
        test_request = PurchaseRequest(
            user_id=user_id,
            email="test@example.com",
            title="Test Purchase Request",
            description="This is a test purchase request",
            amount=100.0,
            category="equipment",
            priority="medium",
            justification="Testing the form submission",
        )

        db.session.add(test_request)
        db.session.commit()

        return jsonify(test_request.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error testing purchase request: {str(e)}")
        return jsonify({"message": str(e)}), 500
