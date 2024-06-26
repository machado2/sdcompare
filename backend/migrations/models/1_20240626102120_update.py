from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "style_lora";
        CREATE TABLE IF NOT EXISTS "stylelora" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "lora" INT NOT NULL,
    "style_id" INT NOT NULL REFERENCES "style" ("id") ON DELETE CASCADE
);
        DROP TABLE IF EXISTS "lora";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "stylelora";
        CREATE TABLE "style_lora" (
    "style_id" INT NOT NULL REFERENCES "style" ("id") ON DELETE CASCADE,
    "lora_id" INT NOT NULL REFERENCES "lora" ("id") ON DELETE CASCADE
);"""
