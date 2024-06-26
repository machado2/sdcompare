import tortoise
from tortoise import Tortoise

from app.settings import TORTOISE_ORM


async def init():
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()


tortoise.run_async(init())
