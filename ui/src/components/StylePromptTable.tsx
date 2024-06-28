import React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useBreakpointValue
} from '@chakra-ui/react';
import ImageById from "./ImageById";
import { Prompt, Style } from "./SimpleTypes";

interface CheckpointPromptTableProps {
    prompts: Prompt[];
    styles: Style[];
    handleClick: (prompt_id: number, style_id: number) => void;
}

const StylePromptTable: React.FC<CheckpointPromptTableProps> = ({
                                                                    prompts,
                                                                    styles,
                                                                    handleClick
                                                                }) => {
    // Use this hook to make the table horizontally scrollable on small screens
    const boxSize = useBreakpointValue({ base: "90vw", md: "auto" });

    return (
        <Box overflowX="auto" maxWidth={boxSize}>
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>Style</Th>
                        {prompts.map(prompt => (
                            <Th key={prompt.id}>{prompt.text}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {styles.map(style => (
                        <Tr key={style.id}>
                            <Td>{style.name}</Td>
                            {prompts.map(prompt => (
                                <Td key={prompt.id}>
                                    <ImageById
                                        prompt_id={prompt.id}
                                        style_id={style.id}
                                        onClick={handleClick}
                                    />
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default StylePromptTable;