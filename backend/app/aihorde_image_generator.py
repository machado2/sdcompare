import asyncio
import os
from io import BytesIO

import requests
from PIL import Image

from app.exceptions import CensoredException, ImageGenerationException, NotReadyException, \
    TimeoutException, RateLimitedException
from app.models import Style, StableDiffusionModel, style_to_dict
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
        if response.status_code < 200 or response.status_code > 299:
            print(response.text)
        if response.status_code == 429:
            raise RateLimitedException
        response.raise_for_status()
        return response.json()

    def get(self, path: str) -> any:
        response = requests.get(f"{self.BASE_URL}{path}", headers=self.headers)
        if response.status_code < 200 or response.status_code > 299:
            print(response.text)
        if response.status_code == 429:
            raise RateLimitedException
        response.raise_for_status()
        return response.json()

    async def ai_horde_generate(self, prompt: str, negative: str, style: Style):
        final_prompt = style.prompt.replace("{p}", prompt).replace("{np}", negative)
        sdmodel: StableDiffusionModel = await style.model
        style_dict = await style_to_dict(style)
        parameters = {k: v for k, v in style_dict.items() if k not in ['model', 'prompt']}
        body = {
            "prompt": final_prompt,
            "params": parameters,
            "models": [sdmodel.name],
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

    async def generate_image(self, prompt: str, style: Style):
        id_image = await self.ai_horde_generate(prompt, "", style)
        await asyncio.sleep(10)
        for _ in range(self.TIMEOUT):
            try:
                return self.get_status(id_image)
            except NotReadyException as e:
                await asyncio.sleep(10)

        raise TimeoutException

    async def create_image(self, prompt: str, style: Style) -> bytes:
        url = await self.generate_image(prompt, style)
        response = requests.get(url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        output = BytesIO()
        img.save(output, format='JPEG')
        return output.getvalue()
