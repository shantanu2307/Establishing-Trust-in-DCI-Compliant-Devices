from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
from models.main import *
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%m/%d/%Y %I:%M:%S %p",
)


certificate = Certificate()


@app.route("/", methods=["GET", "POST"])
def index():
    app.logger.debug("Shantanu")
    return "Hello World!", 200


@app.route("/add", methods=["POST"])
def add_certificate():
    data = request.get_json()
    app.logger.debug(data)
    return jsonify(certificate.create(data)), 200
