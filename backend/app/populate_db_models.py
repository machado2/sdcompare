import json

import aiohttp
from tortoise import Tortoise

from app.models import Category, Style, StyleCategory  # Ensure correct import paths for your project


async def populate_models():
    models_file: dict = requests.get(
        'https://raw.githubusercontent.com/Haidra-Org/AI-Horde-image-model-reference/main/stable_diffusion.json').json()
    for model in models_file.values():
        m = await models.StableDiffusionModel.filter(name=model['name']).first()
        if m:
            m.baseline = model['baseline']
            m.type = model['type']
            m.inpainting = model['inpainting']
            m.description = model['description']
            m.version = model['version']
            m.style = model['style']
            m.nsfw = model['nsfw']
            await m.save()
        else:
            if 'size_on_disk_bytes' in model:
                szdskbytes = model['size_on_disk_bytes']
            else:
                szdskbytes = None
            await models.StableDiffusionModel.create(
                name=model['name'],
                baseline=model['baseline'],
                type=model['type'],
                inpainting=model['inpainting'],
                description=model['description'],
                version=model['version'],
                style=model['style'],
                nsfw=model['nsfw'],
            )


import requests
import app.models as models


async def populate_styles():
    styles_file: dict = requests.get(
        'https://raw.githubusercontent.com/Haidra-Org/AI-Horde-Styles/main/styles.json').json()
    for item in styles_file.items():
        name = item[0]
        style = item[1]
        s = await models.Style.filter(name=name).first()

        if not s:
            s = await models.Style.create(
                name=name,
                prompt=style.get('prompt'),
                model=await models.StableDiffusionModel.filter(name=style.get('model')).first(),
                steps=style.get('steps'),
                width=style.get('width'),
                height=style.get('height'),
                cfg_scale=style.get('cfg_scale'),
                sampler_name=style.get('sampler_name'),
            )
            existing_loras = []
        else:
            s.prompt = style.get('prompt')
            s.model = await models.StableDiffusionModel.filter(name=style.get('model')).first()
            s.steps = style.get('steps')
            s.width = style.get('width')
            s.height = style.get('height')
            s.cfg_scale = style.get('cfg_scale')
            s.sampler_name = style.get('sampler_name')
            await s.save()

            # Clear existing Lora instances
            existing_loras = await models.StyleLora.filter(style=s).all()

        required_loras = []
        # Add new Lora instances
        for lora_dict in style.get('loras', []):
            lora_name = lora_dict.get('name')
            is_version = lora_dict.get('is_version', False)  # Default to False if not specified
            if lora_name:
                required_loras.append(int(lora_name))

        # Remove Lora instances that are no longer required
        for lora in existing_loras:
            if lora.lora not in required_loras:
                await lora.delete()

        # Add new Lora instances
        for lora_dict in style.get('loras', []):
            lora_name = int(lora_dict.get('name'))
            is_version = bool(lora_dict.get('is_version', False))
            await models.StyleLora.create(
                style=s,
                lora=int(lora_name),
                is_version=is_version
            )

        await s.save()


async def populate_categories():
    url = 'https://raw.githubusercontent.com/Haidra-Org/AI-Horde-Styles/main/categories.json'

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            categories_text = await response.text()
            categories_file = json.loads(categories_text)

    for category_name, styles in categories_file.items():  # Iterate over the dictionary items
        c = await Category.filter(name=category_name).first()
        if c:
            c.name = category_name
            await c.save()
        else:
            c = await Category.create(
                name=category_name
            )
        for style_name in styles:
            s = await Style.filter(name=style_name).first()
            if s:
                sc = await StyleCategory.filter(style=s, category=c).first()
                if not sc:
                    await StyleCategory.create(
                        style=s,
                        category=c
                    )


async def main():
    await Tortoise.init(
        db_url='sqlite://db.sqlite3',  # Update to your actual database URL
        modules={'models': ['myproject.models']}  # Replace with your actual module path
    )
    await Tortoise.generate_schemas()
    await populate_categories()


# Example use with asyncio event loop
if __name__ == "__main__":
    import asyncio

    asyncio.run(main())


async def populate_db_models():
    await populate_models()
    await populate_styles()
    await populate_categories()
