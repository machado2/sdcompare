from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "category" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS "lora" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "is_version" BOOL NOT NULL
);
CREATE TABLE IF NOT EXISTS "prompt" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "stablediffusionmodel" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "baseline" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "inpainting" BOOL NOT NULL,
    "description" TEXT NOT NULL,
    "version" VARCHAR(10) NOT NULL,
    "style" VARCHAR(50) NOT NULL,
    "nsfw" BOOL NOT NULL,
    "trigger" JSONB
);
CREATE TABLE IF NOT EXISTS "style" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "prompt" TEXT NOT NULL,
    "steps" INT,
    "width" INT,
    "height" INT,
    "cfg_scale" INT,
    "sampler_name" VARCHAR(50),
    "model_id" INT NOT NULL REFERENCES "stablediffusionmodel" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "stylecategory" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "category_id" INT NOT NULL REFERENCES "category" ("id") ON DELETE CASCADE,
    "style_id" INT NOT NULL REFERENCES "style" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "stylepromptimage" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "image" BYTEA NOT NULL,
    "prompt_id" INT NOT NULL REFERENCES "prompt" ("id") ON DELETE CASCADE,
    "style_id" INT NOT NULL REFERENCES "style" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);
CREATE TABLE IF NOT EXISTS "style_lora" (
    "style_id" INT NOT NULL REFERENCES "style" ("id") ON DELETE CASCADE,
    "lora_id" INT NOT NULL REFERENCES "lora" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "uidx_style_lora_style_i_8cbae4" ON "style_lora" ("style_id", "lora_id");"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
