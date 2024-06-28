from io import BytesIO

import PIL.Image
from PIL import Image
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from tortoise import Tortoise

import app.models as models

router = APIRouter()


async def get_db(request: Request) -> Tortoise:
    return request.state.db


@router.get('/')
async def index():
    # Update this line according to how FastAPI serves static files in your project
    return FileResponse('../ui/build/index.html')


@router.get('/categories', response_class=JSONResponse)
async def list_styles():
    checkpoints = list(await models.Category.all().values())
    return JSONResponse(content=checkpoints)


@router.get('/style', response_class=JSONResponse)
async def get_style(style_id: int):
    style = await models.Style.get(id=style_id)
    return JSONResponse(style.original_json)


@router.get('/styles', response_class=JSONResponse)
async def list_styles(category_id: int | None = None):
    if category_id:
        styles_categories = await models.StyleCategory.filter(category_id=category_id).prefetch_related(
            'style').all()
        styles = [(await models.style_to_dict(style_category.style)) for style_category in
                  styles_categories]
    else:
        styles = list(await models.Style.all().values())
    return JSONResponse(content=styles)


@router.get('/prompts', response_class=JSONResponse)
async def list_prompts():
    prompts = list(await models.Prompt.all().values())
    return JSONResponse(content=prompts)


@router.get('/image')
async def get_image(style_id: int, prompt_id: int):
    if not style_id or not prompt_id:
        raise HTTPException(status_code=400, detail="style_id and prompt_id are required")
    image_blob = await models.StylePromptImage.filter(style_id=style_id, prompt_id=prompt_id).first()
    image_blob = image_blob.image
    return StreamingResponse(BytesIO(image_blob), media_type='image/jpeg')


def resize_image(image_blob, max_dimension=512):
    # Open the image file
    img = Image.open(BytesIO(image_blob))
    # Calculate the new size while preserving aspect ratio
    width, height = img.size
    if width > height:
        new_width = max_dimension
        new_height = int((max_dimension / width) * height)
    else:
        new_height = max_dimension
        new_width = int((max_dimension / height) * width)

    # Resize the image
    img = img.resize((new_width, new_height), PIL.Image.Resampling.LANCZOS)
    # Save the image back to a BytesIO object
    output = BytesIO()
    img.save(output, format='JPEG')
    output.seek(0)
    return output.read()


@router.get('/thumb')
async def get_thumb(style_id: int, prompt_id: int):
    if not style_id or not prompt_id:
        raise HTTPException(status_code=400, detail="style_id and prompt_id are required")
    image_blob = await models.StylePromptImage.filter(style_id=style_id, prompt_id=prompt_id).first()
    if image_blob.thumb:
        image_blob = image_blob.thumb
    else:
        image_blob = resize_image(image_blob.image)
        await models.StylePromptImage.filter(style_id=style_id, prompt_id=prompt_id).update(thumb=image_blob)

    return StreamingResponse(BytesIO(image_blob), media_type='image/jpeg')
