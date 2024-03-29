from factory.validation import Validator
from factory.database import Database


class Certificate(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()
        self.collection_name = "certificates"
        self.fields = {
            "device_name": "string",
            "created_by": "string",
            "hashed_key": "string",
            "public_key": "string",
            "created": "datetime",
            "updated": "datetime",
        }

        self.create_required_fields = [
            "device_name",
            "created_by",
            "hashed_key",
            "public_key",
        ]

        self.create_optional_fields = []

        self.update_required_fields = ["created_by" "hashed_key", "public_key", "device_name"]

        self.update_optional_fields = []

    def create(self, certificate):
        self.validator.validate(
            certificate,
            self.fields,
            self.create_required_fields,
            self.create_optional_fields,
        )
        res = self.db.insert(certificate, self.collection_name)
        return "Inserted Id " + res

    def find(self, certificate):
        return self.db.find(certificate, self.collection_name)

    def find_by_id(self, certificate_id):
        return self.db.find_by_id(certificate_id, self.collection_name)

    def update(self, certificate_id, certificate):
        self.validator.validate(
            certificate,
            self.fields,
            self.update_required_fields,
            self.update_optional_fields,
        )
        return self.db.update(certificate_id, certificate, self.collection_name)

    def delete(self, certificate_id):
        return self.db.delete(certificate_id, self.collection_name)
