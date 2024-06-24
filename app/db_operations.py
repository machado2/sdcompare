# src/db_operations.py

import io
from contextlib import closing

import psycopg2
from PIL import Image

from app.settings import DATABASE


def get_db_connection():
    conn = psycopg2.connect(
        dbname=DATABASE['NAME'],
        user=DATABASE['USER'],
        password=DATABASE['PASSWORD'],
        host=DATABASE['HOST'],
        port=DATABASE['PORT']
    )
    return conn


def insert_image(checkpoint_id: int, prompt_id: int, img_blob: bytes):
    with closing(get_db_connection()) as conn:
        cursor = conn.cursor()

        cursor.execute('''
        INSERT INTO images (checkpoint_id, prompt_id, image)
        VALUES (%s, %s, %s)
        ''', (checkpoint_id, prompt_id, img_blob))

        conn.commit()
        cursor.close()


def exists_image(checkpoint_id: int, prompt_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    SELECT EXISTS(
        SELECT 1
        FROM images
        WHERE checkpoint_id = %s AND prompt_id = %s
    )
    ''', (checkpoint_id, prompt_id))

    exists = cursor.fetchone()[0]
    cursor.close()
    conn.close()

    return exists


def get_insert_category(category: str) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT id FROM category WHERE name = %s', (category,))
    category_id = cursor.fetchone()
    if category_id is None:
        cursor.execute('INSERT INTO category (name) VALUES (%s) RETURNING id', (category,))
        category_id = cursor.fetchone()[0]
    else:
        category_id = category_id[0]

    conn.commit()
    cursor.close()
    conn.close()

    return category_id


def upsert_prompt(prompt: str, category_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT id FROM prompts WHERE prompt = %s', (prompt,))
    prompt_id = cursor.fetchone()
    if prompt_id is None:
        cursor.execute('INSERT INTO prompts (prompt, category_id) VALUES (%s, %s) RETURNING id', (prompt, category_id))
        prompt_id = cursor.fetchone()[0]
    else:
        prompt_id = prompt_id[0]

    conn.commit()
    cursor.close()
    conn.close()


def upsert_checkpoint(checkpoint_name: str, count: int):
    with closing(get_db_connection()) as conn:
        cursor = conn.cursor()

        cursor.execute('SELECT id FROM checkpoints WHERE name = %s', (checkpoint_name,))
        checkpoint_id = cursor.fetchone()
        if checkpoint_id is None:
            cursor.execute('INSERT INTO checkpoints (name, worker_count) VALUES (%s, %s) RETURNING id',
                           (checkpoint_name, count))
            checkpoint_id = cursor.fetchone()[0]
        else:
            checkpoint_id = checkpoint_id[0]

        conn.commit()
        cursor.close()


def retrieve_image(checkpoint_name, prompt):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    SELECT image FROM images
    JOIN checkpoints ON images.checkpoint_id = checkpoints.id
    JOIN prompts ON images.prompt_id = prompts.id
    WHERE checkpoints.name = %s AND prompts.prompt = %s
    ''', (checkpoint_name, prompt))

    img_blob = cursor.fetchone()[0]
    cursor.close()
    conn.close()

    # Convert binary data to Image
    img = Image.open(io.BytesIO(img_blob))
    return img


class Checkpoint:
    def __init__(self, id: int, model: str, workers: int = 1):
        self.id = id
        self.name = model
        self.worker_count = workers


def get_checkpoints() -> list[Checkpoint]:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT id, name, worker_count FROM checkpoints')
    checkpoints = [Checkpoint(*row) for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return checkpoints


class Prompt:
    def __init__(self, id: int, prompt: str, category_id: int):
        self.id = id
        self.prompt = prompt
        self.category_id = category_id


def get_prompts() -> list[Prompt]:
    with closing(get_db_connection()) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, prompt, category_id FROM prompts')
        prompts = [Prompt(*row) for row in cursor.fetchall()]
        cursor.close()
        return prompts
