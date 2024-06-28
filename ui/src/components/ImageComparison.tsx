import React from 'react';
import {
    Box,
    Heading,
    Select,
    VStack,
} from '@chakra-ui/react';
import ImageById from "./ImageById";
import StylePromptTable from "./StylePromptTable";
import StylePromptSingleTable from "./StylePromptSingleTable";
import { Prompt, Style } from "./SimpleTypes";

interface Props {
    prompts: Prompt[];
    styles: Style[];
    selectedStyle: number | null;
    selectedPrompt: number | null;
    setSelectedPrompt: (id: number | null) => void;
    selectedCategory: number | null;
    handleClick: (prompt_id: number, style_id: number) => void;
}

const ImageComparison: React.FC<Props> = ({
                                              prompts,
                                              styles,
                                              selectedStyle,
                                              selectedPrompt,
                                              setSelectedPrompt,
                                              handleClick
                                          }) => {
    const styleSelected = styles.find(style => style.id === selectedStyle);

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>Select Prompt</Heading>

            <Select
                placeholder="Select Prompt"
                onChange={(e) => setSelectedPrompt(Number(e.target.value))}
                value={selectedPrompt || ''}
                mb={4}
            >
                {prompts.map(prompt => (
                    <option key={prompt.id} value={prompt.id}>{prompt.text}</option>
                ))}
            </Select>

            <VStack spacing={4}>
                {selectedStyle && selectedPrompt ? (
                    <Box>
                        <Heading as="h3" size="md" mb={2}>Generated Image</Heading>
                        <ImageById
                            prompt_id={selectedPrompt}
                            style_id={selectedStyle}
                            onClick={handleClick}
                        />
                    </Box>
                ) : null}

                {!selectedPrompt && !selectedStyle ? (
                    <StylePromptTable
                        prompts={prompts}
                        styles={styles}
                        handleClick={handleClick}
                    />
                ) : null}

                {selectedPrompt && !selectedStyle ? (
                    <StylePromptSingleTable
                        prompts={prompts}
                        checkpoints={styles}
                        selectedPrompt={selectedPrompt}
                        handleClick={handleClick}
                    />
                ) : null}

                {!selectedPrompt && selectedStyle ? (
                    <StylePromptTable
                        prompts={prompts}
                        styles={[styleSelected as Style]}
                        handleClick={handleClick}
                    />
                ) : null}
            </VStack>
        </Box>
    );
};

export default ImageComparison;