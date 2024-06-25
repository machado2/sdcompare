from dataclasses import dataclass


@dataclass
class Checkpoint:
    id: int
    name: str
    worker_count: int


@dataclass
class Prompt:
    id: int
    prompt: str
    category_id: int


@dataclass
class Category:
    id: int
    name: str

