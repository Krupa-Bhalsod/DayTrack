from bson import ObjectId
from app.core.exceptions import BadRequestException

def parse_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception:
        raise BadRequestException(f"Invalid ID format: {id_str}")

def document_to_dict(doc: dict) -> dict:
    if not doc:
        return None
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    if "user_id" in doc:
        doc["user_id"] = str(doc["user_id"])
    return doc
