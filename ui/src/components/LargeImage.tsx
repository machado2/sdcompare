import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Image,
} from '@chakra-ui/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    prompt_id: number;
    style_id: number;
    handleMouseEnter?: (prompt_id: number, style_id: number) => void;
    handleMouseLeave?: (prompt_id: number, style_id: number) => void;
    handleClick?: () => void;
}

const LargeImage: React.FC<Props> = ({
                                         isOpen,
                                         onClose,
                                         prompt_id,
                                         style_id,
                                     }) => {
    const imageUrl = `/image?prompt_id=${prompt_id}&style_id=${style_id}`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent onClick={onClose}>
                <ModalHeader>Image Preview</ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" justifyContent="center" alignItems="center" p={0}>
                    <Image
                        src={imageUrl}
                        alt=""
                        maxW="80vw"
                        maxH="80vh"
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default LargeImage;