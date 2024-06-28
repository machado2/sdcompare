import React, {useEffect, useState} from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useBreakpointValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
    useDisclosure,
    Spinner,
    Center,
} from '@chakra-ui/react';
import axios from 'axios';
import ImageById from './ImageById';
import { Prompt, Style } from './SimpleTypes';

interface CheckpointPromptTableProps {
    prompts: Prompt[];
    styles: Style[];
    handleClick: (prompt_id: number, style_id: number) => void;
}

const StylePromptTable: React.FC<CheckpointPromptTableProps> = ({
                                                                    prompts,
                                                                    styles,
                                                                    handleClick,
                                                                }) => {
    const boxSize = useBreakpointValue({ base: '90vw', md: 'auto' });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchStyleDetails = async (style_id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`/style?style_id=${style_id}`);
            setModalContent(JSON.stringify(response.data, null, 2)); // Format JSON content
        } catch (error) {
            console.error('Error fetching style details:', error);
            setModalContent('Error loading content');
        }
        setLoading(false);
    };

    const handleStyleClick = (style_id: number) => {
        fetchStyleDetails(style_id).then();
        onOpen();

    };

    return (
        <>
            <Box overflowX="auto" maxWidth={boxSize}>
                <Table variant="striped" colorScheme="cyan">
                    <Thead>
                        <Tr>
                            <Th>Style</Th>
                            {prompts.map((prompt) => (
                                <Th key={prompt.id}>{prompt.text}</Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {styles.map((style) => (
                            <Tr key={style.id}>
                                <Td
                                    cursor="pointer"
                                    onClick={() => handleStyleClick(style.id)}
                                >
                                    {style.name}
                                </Td>
                                {prompts.map((prompt) => (
                                    <Td key={prompt.id}>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            maxW="128px"
                                            maxH="128px"
                                        >
                                            <ImageById
                                                prompt_id={prompt.id}
                                                style_id={style.id}
                                                onClick={handleClick}
                                            />
                                        </Box>
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Style Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {loading ? (
                            <Center>
                                <Spinner size="xl" />
                            </Center>
                        ) : (
                            <Textarea
                                value={modalContent || ''}
                                readOnly
                                height="200px"
                                whiteSpace="pre-wrap"
                            />
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default StylePromptTable;