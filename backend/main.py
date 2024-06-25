# src/main.py
import asyncio
import threading
from asyncio import Semaphore

from app.aihorde_image_generator import AiHordeImageGenerator
from app.api import app as api
from app.db_operations import insert_image, exists_image, upsert_checkpoint, upsert_prompt, get_insert_category, \
    get_checkpoints, Checkpoint, Prompt, get_prompts, get_missing_images
from app.db_setup import create_db
from app.exceptions import ImageGenerationException
from app.prompts import prompt_categories

image_generator = AiHordeImageGenerator()


class QueueItem:
    def __init__(self, checkpoint: Checkpoint, prompt: Prompt):
        self.checkpoint = checkpoint
        self.prompt = prompt


async def create_insert_image(item: QueueItem, semaphore: Semaphore):
    if exists_image(item.checkpoint.id, item.prompt.id):
        print("-", end="", flush=True)
        return
    async with semaphore:
        print(".", end="", flush=True)
        prompt = item.prompt
        chk = item.checkpoint
        try:
            image = await image_generator.create_image(prompt.prompt, chk.name)
            insert_image(chk.id, prompt.id, image)
            print(f"Created image for {chk.name}, prompt: {prompt.prompt}")
        except ImageGenerationException as e:
            print(f"Failed to create image for {chk.name}, prompt: {prompt.prompt}, {str(e)}")


async def process_queue(queue: list[QueueItem]):
    semaphore = Semaphore(10)
    tasks = []
    for item in queue:
        task = asyncio.create_task(create_insert_image(item, semaphore))
        tasks.append(task)
        # if len(tasks) >= 10:
        #    await asyncio.gather(*tasks)
        #    tasks = []
    await asyncio.gather(*tasks)


def create_things():
    print("create_db")
    create_db()

    print("upsert_checkpoint")
    checkpoints = image_generator.list_models()
    [upsert_checkpoint(chk.name, chk.worker_count) for chk in checkpoints]

    print("upsert_prompt")
    for category in prompt_categories:
        category_id = get_insert_category(category.name)
        [upsert_prompt(prompt, category_id) for prompt in category.prompts]


def create_images():
    print("loading checkpoints and prompts")

    missing = get_missing_images()
    queue = []
    for chk_id, prompt_id, chk_name, prompt, worker_count, prompt_id in missing:
        queue.append(QueueItem(Checkpoint(chk_id, chk_name, worker_count), Prompt(prompt_id, prompt, 0)))
    print("processing queue")
    asyncio.run(process_queue(queue))


def create_images_old():
    checkpoints = get_checkpoints()
    prompts = get_prompts()

    print("creating queue")
    queue = []
    # Generate and insert sample images into the database
    for checkpoint in checkpoints:
        if checkpoint.worker_count > 2:
            for prompt in prompts:
                queue.append(QueueItem(checkpoint, prompt))

    print("processing queue")
    asyncio.run(process_queue(queue))


def serve_api():
    threading.Thread(target=api.run).start()


def main():
    print("Starting")
    # create_things()
    serve_api()
    create_images()


if __name__ == "__main__":
    main()
