import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageById from "./ImageById";
import './ImageComparison.css';
import CheckpointPromptTable from "./CheckpointPromptTable";
import CheckpointPromptSingleTable from "./CheckpointPromptSingleTable";
import CategoryPromptTable from "./CategoryPromptTable";

interface Prompt {
    id: number;
    prompt: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
}

interface Checkpoint {
    id: number;
    name: string;
    worker_count: number;
}

interface Props {
    prompts: Prompt[];
    selectedCheckpoint: number | null;
    selectedPrompt: number | null;
    setSelectedPrompt: (id: number | null) => void;
    selectedCategory: number | null;
    categories: Category[];
}

const ImageComparison: React.FC<Props> = ({
                                              prompts, selectedCheckpoint, selectedPrompt, setSelectedPrompt, selectedCategory, categories
                                          }) => {
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);

    useEffect(() => {
        if (!selectedCheckpoint) {
            axios.get('/checkpoints')
                .then(response => setCheckpoints(response.data))
                .catch(error => console.error("There was an error fetching checkpoints!", error));
        } else {
            setCheckpoints([]);
        }
    }, [selectedCheckpoint]);

    return (
        <div>
            <h2>Select Prompt</h2>
            <select onChange={(e) => setSelectedPrompt(Number(e.target.value))} value={selectedPrompt || ''}>
                <option value=''>Select Prompt</option>
                {prompts.map(prompt => (
                    <option key={prompt.id} value={prompt.id}>{prompt.prompt}</option>
                ))}
            </select>

            {selectedCheckpoint && selectedPrompt && (
                <div>
                    <h3>Generated Image</h3>
                    <ImageById prompt_id={selectedPrompt} checkpoint_id={selectedCheckpoint} />
                </div>
            )}

            {!selectedPrompt && !selectedCheckpoint && (
                <CheckpointPromptTable
                    prompts={prompts}
                    checkpoints={checkpoints}
                />
            )}

            {selectedPrompt && !selectedCheckpoint && (
                <CheckpointPromptSingleTable
                    prompts={prompts}
                    checkpoints={checkpoints}
                    selectedPrompt={selectedPrompt}
                />
            )}

            {!selectedPrompt && selectedCheckpoint && (
                <CategoryPromptTable
                    prompts={prompts}
                    categories={categories}
                    selectedCheckpoint={selectedCheckpoint}
                />
            )}
        </div>
    );
};

export default ImageComparison;
