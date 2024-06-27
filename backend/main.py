import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from app.api import router as api_router
from app.db import close as close_db
from app.db import init as init_db
from app.settings import TORTOISE_ORM

app = FastAPI()


@app.on_event("startup")
async def startup():
    await init_db()


@app.on_event("shutdown")
async def shutdown():
    await close_db()


def main():
    origins = ["*"]
    # noinspection PyTypeChecker
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_tortoise(
        app,
        config=TORTOISE_ORM,
    )

    app.include_router(api_router)
    # serve it

    uvicorn.run(app)


if __name__ == "__main__":
    main()
