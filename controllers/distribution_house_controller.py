from flask import request, jsonify, Blueprint, session
from models.main import *
import bson
import bcrypt
import ipfshttpclient
import os
from cryptography.fernet import Fernet

ipfs = ipfshttpclient.connect()
distribution_house_handler = Blueprint("distribution_house_handler", __name__)

dkdm_entity = DKDM()
distribution_house = DistributionHouse()

session = {}


@distribution_house_handler.route("/distribution_house/signup", methods=["POST"])
def signup():
    data = request.get_json()
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
            owner_id = bson.ObjectId(owner[0].get("_id"))
            session["logged_in_owner_id"] = owner_id
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


@distribution_house_handler.route("/distribution_house/add_dkdm", methods=["POST"])
def add_dkdm():
    if "logged_in_owner_id" in session:
        decrypted_file = request.files.get("file")
        filename = decrypted_file.filename
        decrypted_file.save(filename)
        movie_name = request.form.get("movie_name")
        key = Fernet.generate_key()
        fernet_instance = Fernet(key)
        with open(filename, "rb") as f:
            video_data = f.read()
        encrypted_data = fernet_instance.encrypt(video_data)
        encrypted_key = key
        with open("video_encrypted.mp4", "wb") as f:
            f.write(encrypted_data)
        res = ipfs.add("video_encrypted.mp4")
        ipfs_hash = res["Hash"]
        os.remove("video_encrypted.mp4")
        os.remove(filename)
        data = {
            "movie_name": movie_name,
            "file_hash": ipfs_hash,
            "distribution_house_id": session["logged_in_owner_id"],
            "decryption_key": encrypted_key,
        }
        dkdm_entity.create(data)
        return jsonify({"message": "DKDM generated successfully"}), 200
    return jsonify({"message": "Not logged in"}), 401
