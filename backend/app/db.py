from starlette.middleware.base import BaseHTTPMiddleware
from tortoise import Tortoise

from app.models import StylePromptImage
from app.settings import TORTOISE_ORM


async def init():
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()


async def close():
    await Tortoise.close_connections()


class DatabaseMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        await init()
        response = await call_next(request)
        await close()
        return response

