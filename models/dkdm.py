from factory.validation import Validator
from factory.database import Database


class DKDM(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()
        self.collection_name = "dkdms"
        # movie_name field is unique
        self.fields = {
            "file_hash": "string",
            "decryption_key": "string",
            "distribution_house_id": "string",
            "movie_name": "string",
            "created": "datetime",
            "updated": "datetime",
        }
        self.create_required_fields = [
            "file_hash",
            "decryption_key",
            "distribution_house_id",
            "movie_name",
        ]
        self.create_optional_fields = []

        self.update_required_fields = [
            "file_hash",
            "decryption_key",
            "distribution_house_id",
            "movie_name",
        ]
        self.update_optional_fields = []

    def create(self, movie):
        self.validator.validate(
            movie, self.fields, self.create_required_fields, self.create_optional_fields
        )
        res = self.db.insert(movie, self.collection_name)
        return "Inserted Id " + res

    def find(self, movie):
        return self.db.find(movie, self.collection_name)

    def find_by_id(self, movie_id):
        return self.db.find_by_id(movie_id, self.collection_name)

    def update(self, movie_id, movie):
        self.validator.validate(
            movie, self.fields, self.update_required_fields, self.update_optional_fields
        )
        return self.db.update(movie_id, movie, self.collection_name)

    def delete(self, movie_id):
        return self.db.delete(movie_id, self.collection_name)
