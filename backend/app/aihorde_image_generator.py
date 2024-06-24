import asyncio
import os
import random
from io import BytesIO

import requests
from PIL import Image

from app.db_operations import Checkpoint
from app.exceptions import CensoredException, ImageGenerationException, NotReadyException, \
    TimeoutException
from app.settings import AI_HORDE_API_KEY


class AiHordeModel:
    def __init__(self, model: str, workers: int = 1):
        self.model = model
        self.workers = workers


class AiHordeImageGenerator:
    BASE_URL = "https://aihorde.net/api/v2"
    TIMEOUT = 120

    def __init__(self):
        self.headers = {
            "apikey": AI_HORDE_API_KEY,
            "Content-Type": "application/json"
        }
        self.model = os.environ.get("SD_MODEL", "SDXL 1.0")

    def post(self, path, body):
        response = requests.post(f"{self.BASE_URL}{path}", headers=self.headers, json=body)
        response.raise_for_status()
        return response.json()

    def get(self, path: str) -> any:
        response = requests.get(f"{self.BASE_URL}{path}", headers=self.headers)
        response.raise_for_status()
        return response.json()

    def ai_horde_generate(self, prompt, model=None):
        if model is None:
            model = self.model
        parameters = {
            "sampler_name": "k_euler_a",
            "width": 512,
            "height": 512,
            "hires_fix": False,
        }
        if "XL" in model:
            parameters.update({
                "width": 1024,
                "height": 576,
                "seed": str(random.randint(0, 1000000)),
            })

        body = {
            "prompt": prompt,
            "params": parameters,
            "models": [self.model],
            "nsfw": True,
            "censor_nsfw": False,
            "slow_workers": False,
        }

        res = self.post("/generate/async", body)
        return res["id"]

    def get_status(self, id_image: str) -> any:
        j = self.get(f"/generate/status/{id_image}")
        if j.get("faulted"):
            raise ImageGenerationException
        if j.get("done"):
            generations: list = j["generations"]
            if not generations or len(generations) == 0:
                raise ImageGenerationException
            gen = generations[0]
            if gen.get("censored"):
                raise CensoredException
            return gen["img"]
        else:
            raise NotReadyException

    async def generate_image(self, prompt, model=None):
        id_image = self.ai_horde_generate(prompt, model)
        await asyncio.sleep(10)
        for _ in range(self.TIMEOUT):
            try:
                return self.get_status(id_image)
            except NotReadyException as e:
                await asyncio.sleep(10)

        raise TimeoutException

    async def create_image(self, prompt: str, model: str = None) -> bytes:
        url = await self.generate_image(prompt, model)
        response = requests.get(url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        output = BytesIO()
        img.save(output, format='JPEG')
        return output.getvalue()

    def list_models(self) -> list[Checkpoint]:
        response = self.get("/status/models?type=image&model_state=all")
        return [Checkpoint(0, model["name"], model["count"]) for model in response]
