import asyncio

from app.db import init as init_db
from app.populate_db_models import populate_db_models


async def init():
    await init_db()
    await populate_db_models()


def main():
    asyncio.run(init())


if __name__ == "__main__":
    main()
