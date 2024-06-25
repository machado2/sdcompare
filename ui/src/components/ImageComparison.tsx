import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageById from "./ImageById";
import './ImageComparison.css';

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

    // if (!selectedCheckpoint && !selectedCategory) {
    //     return <></>
    // }

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
                <table className="scroll-table">
                    <thead>
                    <tr>
                        <th>Checkpoint</th>
                        {prompts.map(prompt => (
                            <th key={prompt.id}>{prompt.prompt}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {checkpoints.map(checkpoint => (
                        <tr key={checkpoint.id}>
                            <td>{checkpoint.name}</td>
                            {prompts.map(prompt => (
                                <td key={prompt.id}>
                                    <ImageById prompt_id={prompt.id} checkpoint_id={checkpoint.id} />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {selectedPrompt && !selectedCheckpoint && (
                <table className="scroll-table">
                    <thead>
                    <tr>
                        <th>Checkpoint</th>
                        <th>Prompt: {prompts.find(p => p.id === selectedPrompt)?.prompt}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {checkpoints.map(checkpoint => (
                        <tr key={checkpoint.id}>
                            <td>{checkpoint.name}</td>
                            <td>
                                <ImageById prompt_id={selectedPrompt} checkpoint_id={checkpoint.id} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {!selectedPrompt && selectedCheckpoint && (
                <table className="scroll-table">
                    <thead>
                    <tr>
                        <th>Category</th>
                        {prompts.map(prompt => (
                            <th key={prompt.id}>{prompt.prompt}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(category => {
                        const categoryPrompts = prompts.filter(prompt => prompt.category_id === category.id);
                        return (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                {categoryPrompts.map(prompt => (
                                    <td key={prompt.id}>
                                        <ImageById prompt_id={prompt.id} checkpoint_id={selectedCheckpoint} />
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ImageComparison;
