import React from 'react';
import ImageById from "./ImageById";
import {Prompt, Style} from "./SimpleTypes";


interface CheckpointPromptTableProps {
    prompts: Prompt[];
    styles: Style[];
}

const StylePromptTable: React.FC<CheckpointPromptTableProps> = ({prompts, styles}) => {
    return (
        <table className="scroll-table">
            <thead>
            <tr>
                <th>Style</th>
                {prompts.map(prompt => (
                    <th key={prompt.id}>{prompt.text}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {styles.map(style => (
                <tr key={style.id}>
                    <td>{style.name}</td>
                    {prompts.map(prompt => (
                        <td key={prompt.id}>
                            <ImageById prompt_id={prompt.id} style_id={style.id}/>
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default StylePromptTable;