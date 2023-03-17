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


@distribution_house_handler.route("/distribution_house/delete_dkdm", methods=["POST"])
def delete_dkdm():
    if "logged_in_owner_id" in session:
        data = request.get_json()
        movie_name = data.get("movie_name")
        print(movie_name)
        dkdm = dkdm_entity.find({"movie_name": movie_name})
        if dkdm:
            dkdm_entity.delete(dkdm[0].get("_id"))
            print("Deleted DKDM")
            return jsonify({"message": "Deleted DKDM"}), 200
        return jsonify({"message": "No DKDM found"}), 400
    return jsonify({"message": "Not logged in"}), 401


@distribution_house_handler.route("/distribution_house/get_dkdm", methods=["GET"])
def get_dkdm():
    if "logged_in_owner_id" in session:
        dkdms = dkdm_entity.find({"distribution_house_id": session.get("logged_in_owner_id")})
        if dkdms:
            res = []
            for dkdm in dkdms:
                res.append(dkdm.get("movie_name"))
            return jsonify({"dkdms": res}), 200
        return jsonify({"message": "No DKDM found"}), 400
    return jsonify({"message": "Not logged in"}), 401


@distribution_house_handler.route("/distribution_house/add_dkdm", methods=["POST"])
def add_dkdm():
    if "logged_in_owner_id" in session:
        decrypted_file = request.files.get("file")
        print(decrypted_file)
        filename = decrypted_file.filename
        print(filename)
        movie_name = request.form.get("movie_name")
        print(movie_name)
        values = dkdm_entity.find({"movie_name": movie_name})
        print(values)
        if values:
            return jsonify({"message": "Movie already exists"}), 400
        decrypted_file.save(filename)
        print("File saved")
        key = Fernet.generate_key()
        print(key)
        fernet_instance = Fernet(key)
        with open(filename, "rb") as f:
            video_data = f.read()
        print("Video Data read")
        encrypted_data = fernet_instance.encrypt(video_data)
        print("Video Data encrypted")
        encrypted_key = key
        with open("video_encrypted.mp4", "wb") as f:
            f.write(encrypted_data)
        print("Encrypted video saved")
        res = ipfs.add("video_encrypted.mp4")
        print("Video added to IPFS")
        ipfs_hash = res["Hash"]
        print(ipfs_hash)
        os.remove(filename)
        data = {
            "movie_name": movie_name,
            "file_hash": ipfs_hash,
            "distribution_house_id": session["logged_in_owner_id"],
            "decryption_key": encrypted_key,
        }
        dkdm_entity.create(data)
        print("DKDM created")
        return jsonify({"message": "DKDM generated successfully"}), 200
    return jsonify({"message": "Not logged in"}), 401
