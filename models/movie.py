from factory.validation import Validator
from factory.database import Database


class Movie(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()
        self.collection_name = "movies"
        self.fields = {
            "name": "string",
            "duration": "int",
            "genre": "string",
            "language": "string",
            "rating": "string",
            "created": "datetime",
            "updated": "datetime",
        }

        self.create_required_fields = [
            "name",
            "duration",
            "genre",
            "language",
            "rating",
        ]
        self.create_optional_fields = []

        self.update_required_fields = [
            "name",
            "duration",
            "genre",
            "language",
            "rating",
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
