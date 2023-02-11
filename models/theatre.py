from factory.validation import Validator
from factory.database import Database

class Theatre(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()
        self.collection_name = "theatres"
        self.fields = {
            "name": "string",
            "location": "string",
            "showtimes": ["string"],
            "theatre_capacity": "int",
            "created": "datetime",
            "updated": "datetime"
        }

        self.create_required_fields = ["name", "location", "showtimes", "theatre_capacity"]
        self.create_optional_fields = []

        self.update_required_fields = ["name", "location", "showtimes", "theatre_capacity"]
        self.update_optional_fields = []

    def create(self, theatre):
        self.validator.validate(
            theatre, self.fields, self.create_required_fields, self.create_optional_fields)
        res = self.db.insert(theatre, self.collection_name)
        return "Inserted Id " + res

    def find(self, theatre):
        return self.db.find(theatre, self.collection_name)

    def find_by_id(self, theatre_id):
        return self.db.find_by_id(theatre_id, self.collection_name)

    def update(self, theatre_id, theatre):
        self.validator.validate(
            theatre, self.fields, self.update_required_fields, self.update_optional_fields)
        return self.db.update(theatre_id, theatre, self.collection_name)

    def delete(self, theatre_id):
        return self.db.delete(theatre_id, self.collection_name)