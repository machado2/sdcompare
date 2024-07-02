import os
import ssl

from dotenv import load_dotenv

load_dotenv()

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

DATABASE_USER = os.getenv('DATABASE_USER')
DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_HOST = os.getenv('DATABASE_HOST')
DATABASE_PORT = os.getenv('DATABASE_PORT')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')

TORTOISE_ORM = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.asyncpg",
            "credentials": {
                "database": DATABASE_NAME,
                "host": DATABASE_HOST,
                "password": DATABASE_PASSWORD,
                "port": DATABASE_PORT,
                "user": DATABASE_USER,
                "ssl": ctx
            }
        }
    },
    "apps": {
        "models": {
            "models": ["app.models", "aerich.models"],
            "default_connection": "default",
        }
    }
}

AI_HORDE_API_KEY = os.getenv('AI_HORDE_API_KEY')
