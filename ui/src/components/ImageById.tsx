import React from 'react';

interface Props {
    prompt_id: number;
    checkpoint_id: number;
}

const ImageById: React.FC<Props> = ({ prompt_id, checkpoint_id }) => {
    const imageUrl = `/image?prompt_id=${prompt_id}&checkpoint_id=${checkpoint_id}`;

    return <img src={imageUrl} alt="Generated" />;
};

export default ImageById;
