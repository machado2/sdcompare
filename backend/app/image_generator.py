from app.aihorde_image_generator import AiHordeImageGenerator

image_generator = AiHordeImageGenerator()


class CreatedImage:
    def __init__(self, data: bytes, model: str):
        self.data = data
        self.model = model
