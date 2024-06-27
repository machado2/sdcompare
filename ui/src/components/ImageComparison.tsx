import React from 'react';
import ImageById from "./ImageById";
import './ImageComparison.css';
import StylePromptTable from "./StylePromptTable";
import StylePromptSingleTable from "./StylePromptSingleTable";
import {Category, Prompt, Style} from "./SimpleTypes";

interface Props {
    categories: Category[];
    prompts: Prompt[];
    styles: Style[];
    selectedStyle: number | null;
    selectedPrompt: number | null;
    setSelectedPrompt: (id: number | null) => void;
    selectedCategory: number | null;
    handleMouseEnter: (prompt_id: number, style_id: number) => void;
    handleMouseLeave: (prompt_id: number, style_id: number) => void;

}

const ImageComparison: React.FC<Props> = ({
                                              categories,
                                              prompts,
                                              styles,
                                              selectedStyle,
                                              selectedPrompt,
                                              setSelectedPrompt,
                                              handleMouseLeave,
                                              handleMouseEnter
                                          }) => {
    const styleSelected = styles.find(style => style.id === selectedStyle);

    return (
        <div>
            <h2>Select Prompt</h2> <select onChange={(e) => setSelectedPrompt(Number(e.target.value))}
                                           value={selectedPrompt || ''}>
            <option value=''>Select Prompt</option>
            {prompts.map(prompt => (
                <option key={prompt.id} value={prompt.text}>{prompt.text}</option>
            ))}
        </select>

            {selectedStyle && selectedPrompt ? (
                <div>
                    <h3>Generated Image</h3>
                    <ImageById prompt_id={selectedPrompt} style_id={selectedStyle}/>
                </div>
            ) : null}

            {!selectedPrompt && !selectedStyle ? (
                <StylePromptTable
                    prompts={prompts}
                    styles={styles}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                />
            ) : null}

            {selectedPrompt && !selectedStyle ? (
                <StylePromptSingleTable
                    prompts={prompts}
                    checkpoints={styles}
                    selectedPrompt={selectedPrompt}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}

                />
            ) : null}

            {!selectedPrompt && selectedStyle ? (
                <StylePromptTable
                    prompts={prompts}
                    styles={[styleSelected as Style]}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                />
            ) : null}
        </div>
    );
};

export default ImageComparison;
