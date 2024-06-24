import psycopg2
from flask import Flask, request, jsonify, send_file
from psycopg2 import sql
from io import BytesIO
from PIL import Image

app = Flask(__name__)



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
    CREATE TABLE IF NOT EXISTS checkpoints (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        count INTEGER NOT NULL default 0
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS prompts (
        id SERIAL PRIMARY KEY,
        prompt TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        checkpoint_id INTEGER REFERENCES checkpoints(id),
        prompt_id INTEGER REFERENCES prompts(id),
        image BYTEA
    )
    ''')

    conn.commit()
    cursor.close()
    conn.close()


@app.route('/checkpoints', methods=['GET'])
def list_checkpoints():
    conn = psycopg2.connect(**DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT id, name FROM checkpoints')
    checkpoints = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(checkpoints)


@app.route('/prompts/categories', methods=['GET'])
def list_prompt_categories():
    conn = psycopg2.connect(**DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT DISTINCT category FROM prompts')
    categories = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify([category[0] for category in categories])


@app.route('/prompts', methods=['GET'])
def list_prompts():
    category = request.args.get('category')
    conn = psycopg2.connect(**DATABASE)
    cursor = conn.cursor()

    if category:
        cursor.execute('SELECT id, prompt FROM prompts WHERE category = %s', (category,))
    else:
        cursor.execute('SELECT id, prompt FROM prompts')
    prompts = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(prompts)


@app.route('/image', methods=['GET'])
def get_image():
    checkpoint_id = request.args.get('checkpoint_id')
    prompt_id = request.args.get('prompt_id')

    if not checkpoint_id or not prompt_id:
        return "checkpoint_id and prompt_id are required", 400

    conn = psycopg2.connect(**DATABASE)
    cursor = conn.cursor()

    cursor.execute('''
    SELECT image FROM images
    WHERE checkpoint_id = %s AND prompt_id = %s
    ''', (checkpoint_id, prompt_id))

    image_data = cursor.fetchone()

    cursor.close()
    conn.close()

    if image_data:
        image = Image.open(BytesIO(image_data[0]))
        img_io = BytesIO()
        image.save(img_io, 'JPEG')
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg')
    else:
        return "Image not found", 404


if __name__ == "__main__":
    create_db()
    app.run(debug=True)