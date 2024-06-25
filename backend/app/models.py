from tortoise import fields, models


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
    download_all = fields.BooleanField()
    config = fields.JSONField()  # Assuming this stores a JSON configuration
    available = fields.BooleanField()
    size_on_disk_bytes = fields.BigIntField()


class Lora(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)
    is_version = fields.BooleanField()


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
    loras = fields.ManyToManyField('models.Lora', related_name='styles')


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
