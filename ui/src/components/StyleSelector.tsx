import React from 'react';
import {
    Box,
    Heading,
    Select
} from '@chakra-ui/react';
import { Style } from "./SimpleTypes";

interface Props {
    styles: Style[];
    selectedStyle: number | null;
    setSelectedStyle: (id: number | null) => void;
}

const StyleSelector: React.FC<Props> = ({
                                            styles,
                                            selectedStyle,
                                            setSelectedStyle
                                        }) => {
    return (
        <Box>
            <Heading as="h2" size="lg" mb={4}>Select Style</Heading>
            <Select
                onChange={(e) => setSelectedStyle(Number(e.target.value))}
                value={selectedStyle || ''}
                placeholder="Select Style"
            >
                {styles.map(cp => (
                    <option key={cp.id} value={cp.id}>{cp.name}</option>
                ))}
            </Select>
        </Box>
    );
};

export default StyleSelector;