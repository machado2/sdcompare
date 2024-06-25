import React from 'react';
import ImageById from "./ImageById";
import './CheckpointPromptSingleTable.css'

interface Prompt {
    id: number;
    prompt: string;
    category_id: number;
}

interface Checkpoint {
    id: number;
    name: string;
    worker_count: number;
}

interface CheckpointPromptSingleTableProps {
    prompts: Prompt[];
    checkpoints: Checkpoint[];
    selectedPrompt: number;
}

const CheckpointPromptSingleTable: React.FC<CheckpointPromptSingleTableProps> = ({prompts, checkpoints, selectedPrompt}) => {
    return (
        <div className="container">
            <div className="header">
                <h3>Prompt: {prompts.find(p => p.id === selectedPrompt)?.prompt}</h3>
            </div>
            <div className="checkpoints">
                {checkpoints.map(checkpoint => (
                    <div className="checkpoint" key={checkpoint.id}>
                        <h4>{checkpoint.name}</h4>
                        <ImageById prompt_id={selectedPrompt} checkpoint_id={checkpoint.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckpointPromptSingleTable;