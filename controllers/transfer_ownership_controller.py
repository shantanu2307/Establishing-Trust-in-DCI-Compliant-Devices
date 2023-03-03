from flask import request, jsonify, Blueprint, session
from block import updateOwner, validateOwner

transfer_ownership_handler = Blueprint("transfer_ownership_handler", __name__)

session = {}


@transfer_ownership_handler.route("/transfer_ownership", methods=["POST"])
def transfer_ownership():
    if "logged_in_owner_id" not in session:
        return jsonify({"message": "Not logged in"}), 401
    data = request.get_json()
    if "new_owner" not in data or "hash" not in data:
        return jsonify({"message": "Missing required field"}), 400
    if not validateOwner(session["logged_in_owner_id"], data["hash"]):
        return jsonify({"message": "Unauthorized"}), 401
    updateOwner(data["new_owner"], data["hash"])
    return jsonify({"message": "Success"}), 200
