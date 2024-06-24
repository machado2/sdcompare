import React from 'react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    selectedCategory: number | null;
    setSelectedCategory: (id: number | null) => void;
}

const PromptCategorySelector: React.FC<Props> = ({
                                                     categories, selectedCategory, setSelectedCategory
                                                 }) => {
    return (
        <div>
            <h2>Select Prompt Category</h2>
            <select onChange={(e) => setSelectedCategory(Number(e.target.value))} value={selectedCategory || ''}>
                <option value=''>Select Category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
    );
};

export default PromptCategorySelector;
