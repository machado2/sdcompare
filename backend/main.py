import uvicorn
from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

from app.api import router as api_router
from app.db import DatabaseMiddleware
from app.settings import TORTOISE_ORM

app = FastAPI()


def main():
    app.add_middleware(DatabaseMiddleware)

    register_tortoise(
        app,
        config=TORTOISE_ORM,
    )

    app.include_router(api_router)
    # serve it

    uvicorn.run(app)


if __name__ == "__main__":
    main()
