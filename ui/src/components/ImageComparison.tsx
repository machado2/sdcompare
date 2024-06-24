import React from 'react';
import axios from 'axios';

interface Prompt {
    id: number;
    prompt: string;
    category_id: number;
}

interface Props {
    prompts: Prompt[];
    selectedCheckpoint: number;
    selectedPrompt: number | null;
    setSelectedPrompt: (id: number | null) => void;
}

const ImageComparison: React.FC<Props> = ({
                                              prompts, selectedCheckpoint, selectedPrompt, setSelectedPrompt
                                          }) => {
    const [image, setImage] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (selectedPrompt !== null) {
            // Fetch image
            axios.get(`/image?checkpoint_id=${selectedCheckpoint}&prompt_id=${selectedPrompt}`, { responseType: 'blob' })
                .then(response => {
                    const url = URL.createObjectURL(response.data);
                    setImage(url);
                })
                .catch(error => console.error("There was an error fetching the image!", error));
        }
    }, [selectedCheckpoint, selectedPrompt]);

    return (
        <div>
            <h2>Select Prompt</h2>
            <select onChange={(e) => setSelectedPrompt(Number(e.target.value))} value={selectedPrompt || ''}>
                <option value=''>Select Prompt</option>
                {prompts.map(prompt => (
                    <option key={prompt.id} value={prompt.id}>{prompt.prompt}</option>
                ))}
            </select>

            {image && <div>
                <h3>Generated Image</h3>
                <img src={image} alt="Generated" />
            </div>}
        </div>
    );
};

export default ImageComparison;
