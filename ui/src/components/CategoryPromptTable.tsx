import React from 'react';
import ImageById from "./ImageById";

interface Prompt {
    id: number;
    prompt: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
}
interface CategoryPromptTableProps {
    prompts: Prompt[];
    categories: Category[];
    selectedCheckpoint: number;
}

const CategoryPromptTable: React.FC<CategoryPromptTableProps> = ({prompts, categories, selectedCheckpoint}) => {
    return (
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
    );
};

export default CategoryPromptTable;