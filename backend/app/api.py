from io import BytesIO

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from tortoise import Tortoise
from tortoise.contrib.pydantic import pydantic_model_creator

import app.models as models

Style_Pydantic = pydantic_model_creator(models.Style)

router = APIRouter()


async def get_db(request: Request) -> Tortoise:
    return request.state.db


@router.get('/')
async def index():
    # Update this line according to how FastAPI serves static files in your project
    return FileResponse('../../ui/build/index.html')


@router.get('/categories', response_class=JSONResponse)
async def list_styles():
    checkpoints = list(await models.Category.all().values())
    return JSONResponse(content=checkpoints)


@router.get('/styles', response_class=JSONResponse)
async def list_styles(category_id: int | None = None):
    if category_id:
        styles_categories = await models.StyleCategory.filter(category_id=category_id).prefetch_related(
            'style').all()
        styles = [(await Style_Pydantic.from_tortoise_orm(style_category.style)).dict() for style_category in
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
