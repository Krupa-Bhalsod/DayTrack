from fastapi import status

class DayTrackException(Exception):
    """
    Base exception for the DayTrack application.
    """
    def __init__(self, status_code: int, public_message: str, internal_detail: str = None):
        self.status_code = status_code
        self.public_message = public_message
        self.internal_detail = internal_detail or public_message
        super().__init__(self.internal_detail)

class NotFoundException(DayTrackException):
    def __init__(self, message: str = "The requested resource was not found"):
        super().__init__(status.HTTP_404_NOT_FOUND, message)

class BadRequestException(DayTrackException):
    def __init__(self, message: str = "Invalid request parameters"):
        super().__init__(status.HTTP_400_BAD_REQUEST, message)

class DatabaseException(DayTrackException):
    def __init__(self, message: str = "A database error occurred"):
        super().__init__(status.HTTP_500_INTERNAL_SERVER_ERROR, message)
