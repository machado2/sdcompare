import React from 'react';
import {Image} from '@chakra-ui/react';

interface Props {
    prompt_id: number;
    style_id: number;
    onClick: (prompt_id: number, style_id: number) => void;
}

const ImageById: React.FC<Props> = ({
                                        prompt_id,
                                        style_id,
                                        onClick
                                    }) => {
    const imageUrl = `/thumb?prompt_id=${prompt_id}&style_id=${style_id}`;


    const handleClick = () => {
        onClick && onClick(prompt_id, style_id);
    };

    return (
        <Image
            src={imageUrl}
            alt=""
            data-src={imageUrl}
            onClick={handleClick}
            objectFit="contain"
            loading="lazy"
        />
    );
};

export default ImageById;