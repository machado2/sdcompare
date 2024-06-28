import React from 'react';
import {
    Box,
    SimpleGrid,
    Heading,
} from '@chakra-ui/react';
import ImageById from './ImageById';
import { Prompt, Style } from './SimpleTypes';

interface CheckpointPromptSingleTableProps {
    prompts: Prompt[];
    checkpoints: Style[];
    selectedPrompt: number;
    handleClick: (prompt_id: number, style_id: number) => void;
}

const StylePromptSingleTable: React.FC<CheckpointPromptSingleTableProps> = ({
                                                                                prompts,
                                                                                checkpoints,
                                                                                selectedPrompt,
                                                                                handleClick
                                                                            }) => {
    const selectedPromptText = prompts.find(p => p.id === selectedPrompt)?.text;

    return (
        <Box p={4}>
            <Box mb={4}>
                <Heading as="h3" size="md">Prompt: {selectedPromptText}</Heading>
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
                {checkpoints.map(checkpoint => (
                    <Box key={checkpoint.id} p={4} shadow="md" borderWidth="1px">
                        <Heading as="h4" size="sm" mb={2}>{checkpoint.name}</Heading>
                        <ImageById
                            prompt_id={selectedPrompt}
                            style_id={checkpoint.id}
                            onClick={handleClick}
                        />
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default StylePromptSingleTable;