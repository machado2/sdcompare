import asyncio
import random

from app.aihorde_image_generator import AiHordeImageGenerator
from app.db import init as init_db
from app.exceptions import ImageGenerationException
from app.models import Style, Prompt, StylePromptImage

image_generator = AiHordeImageGenerator()


class QueueItem:
    def __init__(self, style: Style, prompt: Prompt):
        self.style = style
        self.prompt = prompt


async def create_insert_image(item: QueueItem):
    prompt = item.prompt
    style = item.style
    image_exists = await StylePromptImage.exists(style_id=style.id, prompt_id=prompt.id)
    if image_exists:
        print(f"Already exists image for {style.name}, prompt: {prompt.text}")
        return
    print(f"Start creating image for {style.name}, prompt: {prompt.text}")
    try:
        image = await image_generator.create_image(prompt.text, style)
        await StylePromptImage.create(style_id=style.id, prompt_id=prompt.id, image=image)
        print(f"Created image for {style.name}, prompt: {prompt.text}")
    except ImageGenerationException as e:
        print(f"Failed to create image for {style.name}, prompt: {prompt.text}, {str(e)}")
        await asyncio.sleep(60)
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Failed to create image for {style.name}, prompt: {prompt.text}, {str(e)}")
        await asyncio.sleep(60)


async def process_queue(queue: list[QueueItem]):
    tasks = []
    for item in queue:
        await asyncio.sleep(1)
        await create_insert_image(item)


# returns parameters for images that are missing from StylePromptImage
async def get_missing_images() -> list[QueueItem]:
    from itertools import product

    styles = await Style.all()
    prompts = await Prompt.all()
    style_prompt_ids = set((spi.style_id, spi.prompt_id) for spi in await StylePromptImage.all())
    missing = [QueueItem(style, prompt) for style, prompt in product(styles, prompts) if
               (style.id, prompt.id) not in style_prompt_ids]

    return missing


async def main():
    await init_db()

    print("loading styles and prompts")

    missing = await get_missing_images()

    random.shuffle(missing)

    print("processing queue")
    await process_queue(missing)


if __name__ == "__main__":
    asyncio.run(main())
