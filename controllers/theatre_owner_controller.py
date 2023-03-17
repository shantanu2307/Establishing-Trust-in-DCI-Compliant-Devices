from flask import request, jsonify, Blueprint, session
from block import validateOwner, updateOwner, getHash
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend
from models.main import *
import bson
import bcrypt
import ipfshttpclient

ipfs = ipfshttpclient.connect()
theatre_owner_handler = Blueprint("theatre_owner_handler", __name__)

dkdm_entity = DKDM()
certificate_entity = Certificate()
theatre_owner = TheatreOwner()

session = {}


def get_ending_time(starting_time, running_length):
    starting_time = int(starting_time)
    running_length = int(running_length)
    starting_time = starting_time % 100 + (starting_time // 100) * 60
    ending_time = starting_time + running_length
    ending_time %= 2400
    ending_time = ending_time % 60 + (ending_time // 60) * 100
    return ending_time


# Assuming all movies are 1hr long
def generateKDM(ipfs_hash, movie_name, starting_time):
    dkdm = dkdm_entity.find({"movie_name": movie_name})
    if dkdm and dkdm[0]:
        dkdm = dkdm[0]
        decryption_key = dkdm.get("decryption_key")
        # Convert decryption key to string
        decryption_key = decryption_key.decode("utf-8")
        certificate_document = certificate_entity.find({"hashed_key": ipfs_hash})
        if certificate_document and certificate_document[0]:
            document = certificate_document[0]
            public_key_certificate = document.get("public_key")
            public_key = serialization.load_pem_public_key(
                public_key_certificate.encode("utf-8"), backend=default_backend()
            )
            decrypted_kdm = decryption_key + "#" + str(starting_time) + "#" + str(get_ending_time(starting_time, 60))
            decrypted_kdm = decrypted_kdm.encode("utf-8")
            encrypted_kdm = public_key.encrypt(
                decrypted_kdm,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None,
                ),
            )
            return encrypted_kdm
        else:
            return None
    else:
        return None


@theatre_owner_handler.route("/theatre_owner/signup", methods=["POST"])
def signup():
    data = request.get_json()
    password = data.get("password")
    password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    data["password"] = password
    if theatre_owner.find({"email": data.get("email")}):
        return jsonify({"message": "Email already exists"}), 400
    return jsonify(theatre_owner.create(data)), 200


@theatre_owner_handler.route("/theatre_owner/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if email and password:
        owner = theatre_owner.find({"email": email})
        if owner and bcrypt.checkpw(password.encode("utf-8"), owner[0].get("password")):
            owner_id = bson.ObjectId(owner[0].get("_id"))
            session["logged_in_owner_id"] = owner_id
            return jsonify({"message": "Successful Login"}), 200
        elif owner:
            return jsonify({"message": "Wrong Password"}), 401
        else:
            return jsonify({"message": "Owner not found"}), 401
    else:
        return jsonify({"message": "Invalid Credentials"}), 400


@theatre_owner_handler.route("/theatre_owner/logout", methods=["POST"])
def logout():
    if "logged_in_owner_id" in session:
        session.pop("logged_in_owner_id")
        return jsonify({"message": "Logged out"}), 200
    return jsonify({"message": "Not logged in"}), 401


@theatre_owner_handler.route("/theatre_owner/transfer_ownership", methods=["POST"])
def transfer_ownership():
    if "logged_in_owner_id" not in session:
        return jsonify({"message": "Not logged in"}), 401
    data = request.get_json()
    if "new_owner" not in data or "hash" not in data:
        return jsonify({"message": "Missing required field"}), 400
    updateOwner(data["new_owner"], data["hash"])
    return jsonify({"message": "Success"}), 200


@theatre_owner_handler.route("/theatre_owner/generate_kdm", methods=["POST", "GET"])
def generate_kdm():
    if "logged_in_owner_id" not in session:
        return jsonify({"message": "Not logged in"}), 401
    data = request.get_json()
    if "hash" not in data:
        return jsonify({"message": "Missing required field"}), 400
    t_owner = theatre_owner.find_by_id(session["logged_in_owner_id"])
    account = t_owner.get("account")
    if not validateOwner(account, data["hash"]):
        return jsonify({"message": "Unauthorized"}), 401
    kdm = generateKDM(data["hash"], data["movie_name"], data["starting_time"])
    with open("kdm.txt", "wb") as f:
        f.write(kdm)
    if kdm:
        kdm = kdm.hex()
        return jsonify({"kdm": kdm}), 200

    return jsonify({"message": "Error generating KDM"}), 400


@theatre_owner_handler.route("/theatre_owner/get_certificates", methods=["GET", "POST"])
def get_certificate():
    if not "logged_in_owner_id" in session:
        return jsonify({"error": "Not logged in"}), 401
    print(session["logged_in_owner_id"], "ID")
    t_owner = theatre_owner.find_by_id(session["logged_in_owner_id"])
    account = t_owner.get("account")
    account = str(account)
    hashes = getHash(account)
    certificates = []
    for hash in hashes:
        certificate = certificate_entity.find({"hashed_key": hash})
        if certificate and len(certificate) > 0:
            certificates.append(certificate[0])
    return jsonify({"certificates": certificates}), 200
