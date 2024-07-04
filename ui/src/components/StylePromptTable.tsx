import React, {useState} from 'react';
import {
    Box,
    Button,
    Center,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    Textarea,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import ImageById from './ImageById';
import {Prompt, Style} from './SimpleTypes';

interface CheckpointPromptTableProps {
    prompts: Prompt[];
    styles: Style[];
    handleClick: (prompt_id: number, style_id: number) => void;
}

interface Image {
    style: Style;
    prompt: Prompt;
}

const StylePromptTable: React.FC<CheckpointPromptTableProps> = ({
                                                                    prompts,
                                                                    styles,
                                                                    handleClick,
                                                                }) => {
    const boxSize = useBreakpointValue({base: '90vw', md: 'auto'});
    const {isOpen, onOpen, onClose} = useDisclosure();
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


    let images: Image[] = []
    for (let prompt in prompts) {
        for (let style in styles) {
            const img = {style: styles[style], prompt: prompts[prompt]}
            images.push(img)
        }
    }

    return (
        <>
            <Flex wrap="wrap" justifyContent="space-around">
                {images.map((image) => (
                    <Box float={"left"} key={image.style.id + image.prompt.id}>
                        <Box margin="5px">
                            <Text fontSize="lg" fontWeight="bold" width="500px" textOverflow="ellipsis"
                                  overflow="hidden"
                                  whiteSpace="nowrap" onClick={() => {
                                handleStyleClick(image.style.id)
                            }}>{image.style.name}</Text>
                            <Text fontSize="md" width="500px" textOverflow="ellipsis" overflow="hidden"
                                  whiteSpace="nowrap">{image.prompt.text}</Text>
                            <ImageById
                                prompt_id={image.prompt.id}
                                style_id={image.style.id}
                                onClick={handleClick}
                            />
                        </Box>
                    </Box>
                ))}
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Style Details</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {loading ? (
                            <Center>
                                <Spinner size="xl"/>
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