import React from 'react';
import './LargeImage.css';


interface Props {
    prompt_id: number;
    style_id: number;
    handleMouseEnter?: (prompt_id: number, style_id: number) => void;
    handleMouseLeave?: (prompt_id: number, style_id: number) => void;
    handleClick?: () => void;
}

const LargeImage: React.FC<Props> = ({prompt_id, style_id, handleMouseLeave, handleMouseEnter, handleClick}) => {
    const imageUrl = `/thumb?prompt_id=${prompt_id}&style_id=${style_id}`;

    return <img src={imageUrl} alt="" data-src={imageUrl} className="largeimage"
                onMouseEnter={() => {
                    handleMouseEnter && handleMouseEnter(prompt_id, style_id)
                }}
                onMouseLeave={() => {
                    handleMouseLeave && handleMouseLeave(prompt_id, style_id)
                }}
                onMouseMove={(e) => {
                    handleMouseEnter && handleMouseEnter(prompt_id, style_id)
                }}
                onClick={() => {
                    handleClick && handleClick()
                }}

    />;
};

export default LargeImage;
