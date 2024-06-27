from io import BytesIO

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
    return FileResponse('../../ui/build/index.html')


@router.get('/styles', response_class=JSONResponse)
async def list_styles():
    checkpoints = models.StableDiffusionModel.all()
    return JSONResponse(content=checkpoints)


@router.get('/prompts', response_class=JSONResponse)
async def list_prompts():
    prompts = list(await models.Prompt.all().values())
    return JSONResponse(content=prompts)


@router.get('/image')
async def get_image(request):
    style_id = request.query_params.get('style_id')
    prompt_id = request.query_params.get('prompt_id')
    if not style_id or not prompt_id:
        raise HTTPException(status_code=400, detail="style_id and prompt_id are required")
    image_blob = models.StylePromptImage.filter(style_id=style_id, prompt_id=prompt_id).first().image
    return StreamingResponse(BytesIO(image_blob), media_type='image/jpeg')
