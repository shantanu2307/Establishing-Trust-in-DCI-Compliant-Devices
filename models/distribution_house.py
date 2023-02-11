from factory.validation import Validator
from factory.database import Database

class DistributionHouse(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()
        self.collection_name = "distribution_houses"
        self.fields = {
            "name": "string",
            "location": "string",
            "email": "string",
            "password": "string",
            "created": "datetime",
            "updated": "datetime"
        }

        self.create_required_fields = ["name", "location", "email", "password"]
        self.create_optional_fields = []

        self.update_required_fields = ["name", "location", "email", "password"]
        self.update_optional_fields = []

    def create(self, distribution_house):
        self.validator.validate(
            distribution_house, self.fields, self.create_required_fields, self.create_optional_fields)
        res = self.db.insert(distribution_house, self.collection_name)
        return "Inserted Id " + res

    def find(self, distribution_house):
        return self.db.find(distribution_house, self.collection_name)

    def find_by_id(self, distribution_house_id):
        return self.db.find_by_id(distribution_house_id, self.collection_name)

    def update(self, distribution_house_id, distribution_house):
        self.validator.validate(
            distribution_house, self.fields, self.update_required_fields, self.update_optional_fields)
        return self.db.update(distribution_house_id, distribution_house, self.collection_name)

    def delete(self, distribution_house_id):
        return self.db.delete(distribution_house_id, self.collection_name)
