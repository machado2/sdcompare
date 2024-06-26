from tortoise import Tortoise, fields
from tortoise.models import Model
from PIL import Image
import io

from app.data import Checkpoint, Category, Prompt


class Images(Model):
    id = fields.IntField(pk=True)
    checkpoint = fields.ForeignKeyField("models.Checkpoints", related_name="images")
    prompt = fields.ForeignKeyField("models.Prompts", related_name="images")
    image = fields.BinaryField()


class Categories(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255, unique=True)


class Prompts(Model):
    id = fields.IntField(pk=True)
    prompt = fields.CharField(max_length=255)
    category = fields.ForeignKeyField("models.Categories", related_name="prompts")


class Checkpoints(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255, unique=True)
    worker_count = fields.IntField()


async def init():
    await Tortoise.init(
        db_url="postgres://user:password@host:port/dbname",
        modules={'models': ['__main__']}
    )
    await Tortoise.generate_schemas()


async def insert_image(checkpoint_id: int, prompt_id: int, img_blob: bytes):
    await Images.create(checkpoint_id=checkpoint_id, prompt_id=prompt_id, image=img_blob)


async def exists_image(checkpoint_id: int, prompt_id: int) -> bool:
    return await Images.exists(checkpoint_id=checkpoint_id, prompt_id=prompt_id)


async def get_insert_category(category: str) -> int:
    category_obj, created = await Categories.get_or_create(name=category)
    return category_obj.id


async def upsert_prompt(prompt: str, category_id: int):
    await Prompts.update_or_create(defaults={"category_id": category_id}, prompt=prompt)


async def upsert_checkpoint(checkpoint_name: str, count: int):
    await Checkpoints.update_or_create(defaults={"worker_count": count}, name=checkpoint_name)


async def retrieve_image(checkpoint_name, prompt):
    image = await Images.get(
        checkpoint__name=checkpoint_name, prompt__prompt=prompt
    ).values("image")
    if image:
        img_blob = image['image']
        img = Image.open(io.BytesIO(img_blob))
        return img
    return None


async def get_checkpoints() -> list[Checkpoint]:
    return await Checkpoints.all().order_by('-worker_count', 'name')


async def get_prompts(category_id: int = None) -> list[Prompt]:
    if category_id:
        return await Prompts.filter(category_id=category_id).all()
    return await Prompts.all()


async def get_one_prompt_per_category() -> list[Prompt]:
    prompts = await Prompts.raw(
        'SELECT * FROM prompts WHERE id IN (SELECT MIN(id) FROM prompts GROUP BY category_id)'
    )
    return prompts


async def get_categories() -> list[Category]:
    return await Categories.all()


async def get_image(checkpoint_id, prompt_id) -> bytes:
    image = await Images.get_or_none(
        checkpoint_id=checkpoint_id, prompt_id=prompt_id
    ).values("image")
    return image['image'] if image else None


async def get_missing_images():
    missing_images = await Checkpoints.raw('''
        select chk.id as checkpoint_id, p.id as prompt_id, chk.name, chk.worker_count, p.prompt
        from checkpoints chk
        cross join prompts p
        left join images i
        on i.checkpoint_id = chk.id
        and i.prompt_id = p.id
        where i.id is null
        order by chk.worker_count desc, chk.name asc;
    ''')
    return missing_images