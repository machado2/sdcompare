import React from 'react';
import {Box, Select} from '@chakra-ui/react';
import {Style} from "./SimpleTypes";

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
        <Box width="25%" display="inline-block">
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