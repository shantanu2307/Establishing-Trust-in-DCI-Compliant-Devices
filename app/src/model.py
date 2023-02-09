from dataclasses import dataclass
from typing import List

from pydantic import BaseModel

@dataclass
class TheatreOwner:
    email: str
    password: str
    theatreId: str
    location: str
    showtimes: List[str]
    theatreCapacity: int

@dataclass
class Certificate:
    theatreId: str
    deviceId: str
    serverId: str
    hashedKey: str
