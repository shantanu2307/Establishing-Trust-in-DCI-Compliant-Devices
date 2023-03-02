from flask import request, jsonify, Blueprint, session
from block import getHash, setHash, validateOwner
from models.main import *
import bson
import bcrypt
import ipfshttpclient
import os

ipfs = ipfshttpclient.connect()
device_manufacturer_handler = Blueprint("device_manufacturer_handler", __name__)


certificate_entity = Certificate()
device_manufacturer = DeviceManufacturer()

session = {}


@device_manufacturer_handler.route("/device_manufacturer/signup", methods=["POST"])
def signup():
    data = request.get_json()
    print(data)
    password = data.get("password")
    password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    data["password"] = password
    if device_manufacturer.find({"email": data.get("email")}):
        return jsonify({"message": "Email already exists"}), 400
    return jsonify(device_manufacturer.create(data)), 200


@device_manufacturer_handler.route("/device_manufacturer/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if email and password:
        owner = device_manufacturer.find({"email": email})
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


@device_manufacturer_handler.route("/device_manufacturer/logout", methods=["POST"])
def logout():
    if "logged_in_owner_id" in session:
        session.pop("logged_in_owner_id")
        return jsonify({"message": "Logged out"}), 200
    return jsonify({"message": "Not logged in"}), 401


# Getting file from request
@device_manufacturer_handler.route("/device_manufacturer/add_certificate", methods=["POST", "GET"])
def add_certificate():
    if not "logged_in_owner_id" in session:
        return jsonify({"error": "Not logged in"}), 401
    filename = ""
    certificate = request.files.get("file")
    d_man = device_manufacturer.find_by_id(session["logged_in_owner_id"])
    name = d_man.get("name")
    account = d_man.get("account")
    if certificate:
        filename = certificate.filename
        certificate.save(filename)
        res = ipfs.add(filename)
        if validateOwner(account, res["Hash"]):
            return jsonify({"message": "Certificate already present"}), 400
        hash = res["Hash"]
        setHash(account, hash)
        os.remove(filename)
        certificate_entity.create(
            {
                "created_by": name,
                "hashed_key": hash,
            }
        )
        return jsonify({"message": "Certificate added"}), 200
    return jsonify({"message": "Certificate not added"}), 400


@device_manufacturer_handler.route("/device_manufacturer/get_certificates", methods=["GET", "POST"])
def get_certificate():
    if not "logged_in_owner_id" in session:
        return jsonify({"error": "Not logged in"}), 401
    print(session["logged_in_owner_id"], "ID")
    d_man = device_manufacturer.find_by_id(session["logged_in_owner_id"])
    account = d_man.get("account")
    account = str(account)
    hashes = getHash(account)
    certificates = []
    for hash in hashes:
        certificate = certificate_entity.find({"hashed_key": hash})
        if certificate and len(certificate) > 0:
            certificates.append(certificate[0])
    return jsonify({"certificates": certificates}), 200
