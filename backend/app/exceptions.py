class ImageGenerationException(Exception):
    pass


class CensoredException(ImageGenerationException):
    pass


class NotReadyException(ImageGenerationException):
    pass


class TimeoutException(ImageGenerationException):
    pass


class RateLimitedException(ImageGenerationException):
    pass
