import React from 'react';
import ImageById from "./ImageById";

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
    );
};

export default CheckpointPromptSingleTable;