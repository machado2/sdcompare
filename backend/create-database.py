from app.db_operations import upsert_checkpoint, upsert_prompt, get_insert_category
from app.db_setup import create_db
from app.image_generator import image_generator
from app.prompts import prompt_categories


def main():
    print("create_db")
    create_db()

    print("upsert_checkpoint")
    checkpoints = image_generator.list_models()
    [upsert_checkpoint(chk.name, chk.worker_count) for chk in checkpoints]

    print("upsert_prompt")
    for category in prompt_categories:
        category_id = get_insert_category(category.name)
        [upsert_prompt(prompt, category_id) for prompt in category.prompts]


if __name__ == "__main__":
    main()
