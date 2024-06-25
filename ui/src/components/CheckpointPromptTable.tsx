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

interface CheckpointPromptTableProps {
    prompts: Prompt[];
    checkpoints: Checkpoint[];
}

const CheckpointPromptTable: React.FC<CheckpointPromptTableProps> = ({prompts, checkpoints}) => {
    return (
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
                            <ImageById prompt_id={prompt.id} checkpoint_id={checkpoint.id}/>
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default CheckpointPromptTable;