from factory.validation import Validator
from factory.database import Database


class Device(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()
        self.collection_name = "devices"
        self.fields = {
            "device_id": "string",
            "device_type": "string",
            "device_name": "string",
            "device_model": "string",
            "device_manufacturer_id": "string",
            "device_class": "string",
            "created": "datetime",
            "updated": "datetime",
        }

        self.create_required_fields = [
            "device_id",
            "device_type",
            "device_name",
            "device_model",
            "device_manufacturer_id",
            "device_class",
        ]
        self.create_optional_fields = []

        self.update_required_fields = [
            "device_id",
            "device_type",
            "device_name",
            "device_model",
            "device_manufacturer_id",
            "device_class",
        ]
        self.update_optional_fields = []

    def create(self, device):
        self.validator.validate(
            device,
            self.fields,
            self.create_required_fields,
            self.create_optional_fields,
        )
        res = self.db.insert(device, self.collection_name)
        return "Inserted Id " + res

    def find(self, device):
        return self.db.find(device, self.collection_name)

    def find_by_id(self, device_id):
        return self.db.find_by_id(device_id, self.collection_name)

    def update(self, device_id, device):
        self.validator.validate(
            device,
            self.fields,
            self.update_required_fields,
            self.update_optional_fields,
        )
        return self.db.update(device_id, device, self.collection_name)

    def delete(self, device_id):
        return self.db.delete(device_id, self.collection_name)
