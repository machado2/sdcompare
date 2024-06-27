import React from 'react';
import ImageById from "./ImageById";
import './StylePromptSingleTable.css'
import {Prompt, Style} from "./SimpleTypes";

interface CheckpointPromptSingleTableProps {
    prompts: Prompt[];
    checkpoints: Style[];
    selectedPrompt: number;
}

const StylePromptSingleTable: React.FC<CheckpointPromptSingleTableProps> = ({prompts, checkpoints, selectedPrompt}) => {
    return (
        <div className="container">
            <div className="header">
                <h3>Prompt: {prompts.find(p => p.id === selectedPrompt)?.text}</h3>
            </div>
            <div className="checkpoints">
                {checkpoints.map(checkpoint => (
                    <div className="checkpoint" key={checkpoint.id}>
                        <h4>{checkpoint.name}</h4>
                        <ImageById prompt_id={selectedPrompt} style_id={checkpoint.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StylePromptSingleTable;