from flask import Flask
from flask_cors import CORS
from flask_session import Session
from controllers.theatre_owner_controller import theatre_owner_handler
from controllers.device_manufacturer_controller import device_manufacturer_handler
from controllers.distribution_house_controller import distribution_house_handler
import logging


app = Flask(__name__)
app.register_blueprint(theatre_owner_handler)
app.register_blueprint(device_manufacturer_handler)
app.register_blueprint(distribution_house_handler)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
Session(app)


logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%m/%d/%Y %I:%M:%S %p",
)


@app.route("/", methods=["GET", "POST"])
def index():
    app.logger.debug("Shantanu")
    return "Hello World!", 200
