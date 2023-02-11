from flask import Flask
from flask_cors import CORS
from models.main import *
from controllers.theatre_owner_controller import theatre_owner_handler
import logging

app = Flask(__name__)
app.register_blueprint(theatre_owner_handler)
CORS(app)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%m/%d/%Y %I:%M:%S %p",
)


@app.route("/", methods=["GET", "POST"])
def index():
    app.logger.debug("Shantanu")
    return "Hello World!", 200
