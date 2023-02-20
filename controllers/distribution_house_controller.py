from flask import request, jsonify, Blueprint, session
from flask_cors import cross_origin
from block import contract, getOwner, getHash, setHash, updateHash, updateOwner, validateOwner
from models.main import *
import bcrypt
import ipfshttpclient
import os


ipfs = ipfshttpclient.connect()
distribution_house_handler = Blueprint("distribution_house_handler", __name__)


certificate = Certificate()
distribution_house = DistributionHouse()


@distribution_house_handler.route("/distribution_house/signup", methods=["POST"])
def signup():
    data = request.get_json()
    print(data)
    password = data.get("password")
    password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    data["password"] = password
    if distribution_house.find({"email": data.get("email")}):
        return jsonify({"message": "Email already exists"}), 400
    return jsonify(distribution_house.create(data)), 200


@distribution_house_handler.route("/distribution_house/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if email and password:
        owner = distribution_house.find({"email": email})
        if owner and bcrypt.checkpw(password.encode("utf-8"), owner[0].get("password")):
            session["logged_in_owner_id"] = owner[0].get("_id")
            return jsonify({"message": "Successful Login"}), 200
        elif owner:
            return jsonify({"message": "Wrong Password"}), 401
        else:
            return jsonify({"message": "Owner not found"}), 401
    else:
        return jsonify({"message": "Invalid Credentials"}), 400


@distribution_house_handler.route("/distribution_house/logout", methods=["POST"])
def logout():
    if "logged_in_owner_id" in session:
        session.pop("logged_in_owner_id")
        return jsonify({"message": "Logged out"}), 200
    return jsonify({"message": "Not logged in"}), 401


# Getting file from request
@distribution_house_handler.route("/distribution_house/add_certificate", methods=["POST", "GET"])
def add_certificate():
    if not "logged_in_owner_id" in session:
        return jsonify({"error": "Not logged in"}), 401
    filename = ""
    certificate = request.files.get("file")
    d_house = distribution_house.find_by_id(session["logged_in_owner_id"])
    account = d_house.get("account")
    if certificate:
        filename = certificate.filename
        certificate.save(filename)
        res = ipfs.add(filename)
        # If certificate is already present
        if validateOwner(account, res["Hash"]):
            return jsonify({"message": "Certificate already present"}), 400
        hash = res["Hash"]
        setHash(account, hash)
        os.remove(filename)
        return jsonify({"message": "Certificate added"}), 200
    return jsonify({"message": "Certificate not added"}), 400


@distribution_house_handler.route("/distribution_house/get_certificates", methods=["GET", "POST"])
def get_certificate():
    if not "logged_in_owner_id" in session:
        return jsonify({"error": "Not logged in"}), 401

    d_house = distribution_house.find_by_id(session["logged_in_owner_id"])
    account = d_house.get("account")
    hashes = getHash(account)
    certificates = []
    for hash in hashes:
        data = ipfs.cat(hash)
        certificates.append(data.decode("utf-8"))
    print(certificates)
    return jsonify({"certificates": certificates}), 200
