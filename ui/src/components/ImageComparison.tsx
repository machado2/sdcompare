import React from 'react';
import axios from 'axios';
import ImageById from "./ImageById";

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
    return (
        <div>
            <h2>Select Prompt</h2>
            <select onChange={(e) => setSelectedPrompt(Number(e.target.value))} value={selectedPrompt || ''}>
                <option value=''>Select Prompt</option>
                {prompts.map(prompt => (
                    <option key={prompt.id} value={prompt.id}>{prompt.prompt}</option>
                ))}
            </select>

            {selectedPrompt && <div>
                <h3>Generated Image</h3>
                <ImageById prompt_id={selectedPrompt} checkpoint_id={selectedCheckpoint} />
            </div>}
        </div>
    );
};

export default ImageComparison;
