import asyncio
from asyncio import Semaphore

from app.db_operations import insert_image, exists_image, Checkpoint, Prompt, get_missing_images
from app.exceptions import ImageGenerationException
from app.image_generator import image_generator


class QueueItem:
    def __init__(self, checkpoint: Checkpoint, prompt: Prompt):
        self.checkpoint = checkpoint
        self.prompt = prompt


async def create_insert_image(item: QueueItem, semaphore: Semaphore):
    prompt = item.prompt
    chk = item.checkpoint
    if exists_image(item.checkpoint.id, item.prompt.id):
        print(f"Already exists image for {chk.name}, prompt: {prompt.prompt}")
        return
    async with semaphore:
        print(f"Start creating image for {chk.name}, prompt: {prompt.prompt}")
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
        task = create_insert_image(item, semaphore)
        tasks.append(task)
    await asyncio.gather(*tasks)


def main():
    print("loading checkpoints and prompts")

    missing = get_missing_images()
    queue = []
    for chk_id, prompt_id, chk_name, worker_count, prompt in missing:
        queue.append(QueueItem(Checkpoint(chk_id, chk_name, worker_count), Prompt(prompt_id, prompt, 0)))
    print("processing queue")
    asyncio.run(process_queue(queue))


if __name__ == "__main__":
    main()
