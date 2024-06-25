import dataclasses
from io import BytesIO

from flask import Flask, request, jsonify, send_file

import app.db_operations as db

app: Flask = Flask(__name__)


@app.route('/checkpoints', methods=['GET'])
def list_checkpoints():
    checkpoints = db.get_checkpoints()
    checkpoints = [dataclasses.asdict(x) for x in checkpoints]
    return jsonify(checkpoints)


@app.route('/prompts/categories', methods=['GET'])
def list_prompt_categories():
    categories = db.get_categories()
    return jsonify(categories)


@app.route('/prompts', methods=['GET'])
def list_prompts():
    # category is optional
    category_id = request.args.get('category_id')
    if category_id:
        category_id = int(category_id)
        prompts = db.get_prompts(category_id)
    else:
        prompts = db.get_prompts()
    return jsonify(prompts)


@app.route('/image', methods=['GET'])
def get_image():
    checkpoint_id = request.args.get('checkpoint_id')
    prompt_id = request.args.get('prompt_id')
    image_blob = db.get_image(checkpoint_id, prompt_id)
    return send_file(BytesIO(image_blob), mimetype='image/jpeg')