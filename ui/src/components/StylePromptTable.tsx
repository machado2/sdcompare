import React from 'react';
import ImageById from "./ImageById";
import {Prompt, Style} from "./SimpleTypes";


interface CheckpointPromptTableProps {
    prompts: Prompt[];
    styles: Style[];
    handleMouseEnter: (prompt_id: number, style_id: number) => void;
    handleMouseLeave: (prompt_id: number, style_id: number) => void;
    handleClick: (prompt_id: number, style_id: number) => void;
}

const StylePromptTable: React.FC<CheckpointPromptTableProps> = ({prompts, styles, handleMouseLeave, handleMouseEnter, handleClick}) => {
    return (<>
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
                                <ImageById prompt_id={prompt.id} style_id={style.id} onMouseEnter={handleMouseEnter}
                                           onMouseLeave={handleMouseLeave} onClick={handleClick}/>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default StylePromptTable;