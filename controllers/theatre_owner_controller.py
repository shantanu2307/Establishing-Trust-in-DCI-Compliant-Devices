from flask import request, jsonify, session, Blueprint
from models.main import *

theatre_owner_handler = Blueprint("theatre_owner_handler", __name__)

certificate = Certificate()
theatre_owner = TheatreOwner()


@theatre_owner_handler.route("/owner/signup", methods=["POST"])
def signup():
    data = request.get_json()
    return jsonify(theatre_owner.create(data)), 200


@theatre_owner_handler.route("/owner/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if email and password:
        owner = theatre_owner.find({"email": email})
        if owner and owner[0].get("password") == password:
            return jsonify({"message": "Successful Login"}), 200
        elif owner:
            return jsonify({"message": "Wrong Password"}), 401
        else:
            return jsonify({"message": "Owner not found"}), 401
    else:
        return jsonify({"message": "Invalid Credentials"}), 400


@theatre_owner_handler.route("/owner/add_certificate", methods=["POST"])
def add_certificate():
    if not "logged_in_owner_id" in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    owner = theatre_owner.find_by_id(session["logged_in_owner_id"])

    if owner.get("theatre_id") != data.get("theatre_id"):
        return jsonify({"error": "Not authorized"}), 401
    return jsonify(certificate.create(data)), 200
