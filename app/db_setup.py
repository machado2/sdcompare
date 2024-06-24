# src/db_setup.py

import psycopg2

from app.settings import DATABASE


def create_db():
    conn = psycopg2.connect(
        dbname=DATABASE['NAME'],
        user=DATABASE['USER'],
        password=DATABASE['PASSWORD'],
        host=DATABASE['HOST'],
        port=DATABASE['PORT']
    )
    cursor = conn.cursor()

    # Create tables

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS category (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS checkpoints (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        worker_count INTEGER NOT NULL default 0
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS prompts (
        id SERIAL PRIMARY KEY,
        prompt TEXT UNIQUE NOT NULL,
        category_id INTEGER NOT NULL REFERENCES category(id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        checkpoint_id INTEGER NOT NULL REFERENCES checkpoints(id),
        prompt_id INTEGER NOT NULL REFERENCES prompts(id),
        image BYTEA not null
    )
    ''')

    conn.commit()
    cursor.close()
    conn.close()


if __name__ == "__main__":
    create_db()
