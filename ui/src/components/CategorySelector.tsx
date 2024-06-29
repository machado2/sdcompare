import React from 'react';
import {
    Box,
    Heading,
    Select
} from '@chakra-ui/react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    selectedCategory: number | null;
    setSelectedCategory: (id: number | null) => void;
}

const CategorySelector: React.FC<Props> = ({
                                               categories,
                                               selectedCategory,
                                               setSelectedCategory
                                           }) => {
    return (
        <Box width="25%" display="inline-block" mr="10px">
            <Select
                onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
                value={selectedCategory || ''}
                placeholder="Select Category"
            >
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </Select>
        </Box>
    );
};

export default CategorySelector;