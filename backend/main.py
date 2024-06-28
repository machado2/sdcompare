import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from tortoise.contrib.fastapi import register_tortoise

from app.api import router as api_router, CacheControlMiddleware
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

    # noinspection PyTypeChecker
    app.add_middleware(CacheControlMiddleware)

    register_tortoise(
        app,
        config=TORTOISE_ORM,
    )

    app.include_router(api_router)

    app.mount("/", app=StaticFiles(directory="../ui/build", html=True))

    uvicorn.run(app, port=5000)


if __name__ == "__main__":
    main()
