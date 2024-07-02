from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class StableDiffusionModel(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)
    baseline = fields.CharField(max_length=50)
    type = fields.CharField(max_length=50)
    inpainting = fields.BooleanField()
    description = fields.TextField()
    version = fields.CharField(max_length=10)
    style = fields.CharField(max_length=50)
    nsfw = fields.BooleanField()
    trigger = fields.JSONField(null=True)


class Style(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)
    prompt = fields.TextField()
    model = fields.ForeignKeyField('models.StableDiffusionModel', on_delete=fields.CASCADE)
    steps = fields.IntField(null=True)
    width = fields.IntField(null=True)
    height = fields.IntField(null=True)
    cfg_scale = fields.IntField(null=True)
    sampler_name = fields.CharField(max_length=50, null=True)
    original_json = fields.JSONField(null=True)
    kind = fields.IntField(default=1.0)


class Category(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)


class StyleCategory(models.Model):
    id = fields.IntField(pk=True)
    style = fields.ForeignKeyField('models.Style', on_delete=fields.CASCADE)
    category = fields.ForeignKeyField('models.Category', on_delete=fields.CASCADE)


class Prompt(models.Model):
    id = fields.IntField(pk=True)
    text = fields.TextField()  # Renamed prompt field to text for clarity


class StylePromptImage(models.Model):
    id = fields.IntField(pk=True)
    style = fields.ForeignKeyField('models.Style', on_delete=fields.CASCADE)
    prompt = fields.ForeignKeyField('models.Prompt', on_delete=fields.CASCADE)
    image = fields.BinaryField()
    thumb = fields.BinaryField(null=True)


class StyleLora(models.Model):
    id = fields.IntField(pk=True)
    style = fields.ForeignKeyField('models.Style', on_delete=fields.CASCADE)
    lora = fields.IntField()
    is_version = fields.BooleanField()


Style_Pydantic = pydantic_model_creator(Style)


async def style_to_dict(style: Style):
    return (await Style_Pydantic.from_tortoise_orm(style)).dict()
