# Individual prompt lists
realistic_prompts = [
    "Photography of a dragon",
    "Hyper-realistic food photography",
    "High fashion editorial photo",
    "Realistic animal portrait",
    "Street photography of a busy market",
    "Realistic landscape photograph",
    "Wildlife in their natural habitat",
    "Photorealistic ocean waves",
    "Realistic portrait of a celebrity",
    "Hyper-realistic macro photography of an insect",
    "Realistic medieval castle",
    "Realistic dinosaur scene",
    "Realistic photograph of a city park"
]

portraits_characters_prompts = [
    "Portrait of a woman in Renaissance style",
    "Realistic portrait of an old man",
    "Comic book superhero",
    "Anime character in battle",
    "Noir detective scene",
    "Sci-fi robot character",
    "Classical sculpture of a mythological figure",
    "Fantasy dwarf warrior",
    "Mythological Greek god",
    "Fantasy sorcerer casting a spell",
    "Cyberpunk hacker in a dark room",
    "Gothic horror scene",
    "Fantasy elf archer",
    "Baroque portrait of royalty",
    "Retro pin-up girl"
]

fantasy_sci_fi_prompts = [
    "Spaceship digital art",
    "Fantasy castle on a hill",
    "Sci-fi alien landscape",
    "Fantasy creature in a forest",
    "Fantasy world map",
    "Surreal underwater scene",
    "Sci-fi space battle",
    "Dystopian future city",
    "Steampunk airship in the sky",
    "Futuristic architecture design",
    "Sci-fi spaceship interior",
    "Fantasy dragon rider",
    "Fantasy underwater kingdom",
    "Retro-futuristic concept art"
]

artistic_styles_prompts = [
    "Landscape painting of a sunset",
    "Watercolor painting of a forest",
    "Impressionist painting of a garden",
    "Abstract geometric patterns",
    "Surreal dreamscape",
    "Pop art style cat",
    "Graffiti art on a wall",
    "Minimalist black and white abstract",
    "Art nouveau floral pattern",
    "Surreal floating islands",
    "Abstract expressionist painting",
    "Colorful mandala pattern",
    "Impressionist seascape",
    "Abstract psychedelic art",
    "Traditional Japanese ink painting",
    "Surreal melting clock",
    "Digital collage art",
    "Modern digital glitch art"
]

historical_classical_prompts = [
    "Victorian era street",
    "Gothic cathedral interior",
    "Historical battle scene",
    "Medieval knight in armor",
    "Baroque style still life",
    "Romantic Victorian couple",
    "Mythological Greek god",
    "Art nouveau portrait",
    "Classical sculpture of a mythological figure"
]

digital_modern_art_prompts = [
    "Cyberpunk cityscape at night",
    "3D render of a futuristic car",
    "Pixel art video game character",
    "Retro 80s neon cityscape",
    "Concept art for a video game",
    "3D render of a futuristic car",
    "High detail fractal art",
    "Pop art comic panel",
    "Modern digital glitch art",
    "Minimalist poster design"
]

environment_landscapes_prompts = [
    "Landscape painting of a sunset",
    "Watercolor painting of a forest",
    "Realistic landscape photograph",
    "Rustic countryside scenery",
    "Urban graffiti on a brick wall",
    "Urban skyline at sunset",
    "Fantasy world map",
    "Fantasy castle on a hill",
    "Dystopian future city",
    "Surreal underwater scene",
    "Impressionist painting of a garden"
]

miscellaneous_creative_prompts = [
    "Horror movie poster",
    "Vintage travel poster",
    "Vintage advertisement poster",
    "Cartoon style animal",
    "Art deco poster",
    "Botanical illustration",
    "Architectural blueprint",
    "High contrast black and white portrait",
    "Horror creature in the dark",
    "Sci-fi alien character"
]


class PromptCategory:
    def __init__(self, name: str, prompts: list):
        self.name = name
        self.prompts = prompts


prompt_categories: list[PromptCategory] = [
    PromptCategory("Realistic", realistic_prompts),
    PromptCategory("Portraits & Characters", portraits_characters_prompts),
    PromptCategory("Fantasy & Sci-Fi", fantasy_sci_fi_prompts),
    PromptCategory("Artistic Styles", artistic_styles_prompts),
    PromptCategory("Historical & Classical", historical_classical_prompts),
    PromptCategory("Digital & Modern Art", digital_modern_art_prompts),
    PromptCategory("Environment & Landscapes", environment_landscapes_prompts),
    PromptCategory("Miscellaneous Creative", miscellaneous_creative_prompts)

]
