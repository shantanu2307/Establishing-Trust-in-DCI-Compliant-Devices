from factory.validation import Validator
from factory.database import Database


class DeviceManufacturer(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()
        self.collection_name = "device_manufacturers"
        self.fields = {
            "name": "string",
            "location": "string",
            "email": "string",
            "password": "string",
            "devices": ["string"],
            "created": "datetime",
            "updated": "datetime",
        }

        self.create_required_fields = [
            "name",
            "location",
            "email",
            "password",
            "devices",
        ]
        self.create_optional_fields = []

        self.update_required_fields = [
            "name",
            "location",
            "email",
            "password",
            "devices",
        ]
        self.update_optional_fields = []

    def create(self, device_manufacturer):
        self.validator.validate(
            device_manufacturer,
            self.fields,
            self.create_required_fields,
            self.create_optional_fields,
        )
        res = self.db.insert(device_manufacturer, self.collection_name)
        return "Inserted Id " + res

    def find(self, device_manufacturer):
        return self.db.find(device_manufacturer, self.collection_name)

    def find_by_id(self, device_manufacturer_id):
        return self.db.find_by_id(device_manufacturer_id, self.collection_name)

    def update(self, device_manufacturer_id, device_manufacturer):
        self.validator.validate(
            device_manufacturer,
            self.fields,
            self.update_required_fields,
            self.update_optional_fields,
        )
        return self.db.update(
            device_manufacturer_id, device_manufacturer, self.collection_name
        )

    def delete(self, device_manufacturer_id):
        return self.db.delete(device_manufacturer_id, self.collection_name)
