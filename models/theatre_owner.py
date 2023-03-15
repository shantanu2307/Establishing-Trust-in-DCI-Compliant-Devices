from factory.validation import Validator
from factory.database import Database


class TheatreOwner(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()
        self.collection_name = "theatre_owners"
        self.fields = {
            "name": "string",
            "email": "string",
            "password": "string",
            "account": "string",
            "created": "datetime",
            "updated": "datetime",
        }

        self.create_required_fields = ["name", "email", "password", "account"]
        self.create_optional_fields = []

        self.update_required_fields = ["name", "email", "password", "account"]
        self.update_optional_fields = []

    def create(self, theatre_owner):
        self.validator.validate(
            theatre_owner,
            self.fields,
            self.create_required_fields,
            self.create_optional_fields,
        )
        res = self.db.insert(theatre_owner, self.collection_name)
        return "Inserted Id " + res

    def find(self, theatre_owner):
        return self.db.find(theatre_owner, self.collection_name)

    def find_by_id(self, theatre_owner_id):
        return self.db.find_by_id(theatre_owner_id, self.collection_name)

    def update(self, theatre_owner_id, theatre_owner):
        self.validator.validate(
            theatre_owner,
            self.fields,
            self.update_required_fields,
            self.update_optional_fields,
        )
        return self.db.update(theatre_owner_id, theatre_owner, self.collection_name)

    def delete(self, theatre_owner_id):
        return self.db.delete(theatre_owner_id, self.collection_name)
