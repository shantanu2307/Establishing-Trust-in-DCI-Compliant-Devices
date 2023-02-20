from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from block import contract, getOwner, getHash, setHash, updateHash, updateOwner, validateOwner
import ipfshttpclient
import os

ipfs = ipfshttpclient.connect()
distribution_house_handler = Blueprint("distribution_house_handler", __name__)


# Getting file from request
@distribution_house_handler.route("/distribution_house/add_certificate", methods=["POST", "GET"])
def add_certificate():
    filename = ""
    certificate = request.files.get("file")
    account = "0xCaB429b3a6493aFa5C7716812438Ebe6343BebEC"
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
    account = "0xCaB429b3a6493aFa5C7716812438Ebe6343BebEC"
    hashes = getHash(account)
    certificates = []
    for hash in hashes:
        data = ipfs.cat(hash)
        certificates.append(data.decode("utf-8"))
    print(certificates)
    return jsonify({"certificates": certificates}), 200
