import React, {useEffect, useRef, useState} from 'react';

interface Props {
    prompt_id: number;
    style_id: number;
    onMouseEnter?: (prompt_id: number, style_id: number) => void;
    onMouseLeave?: (prompt_id: number, style_id: number) => void;
    onClick: (prompt_id: number, style_id: number) => void;
}

const ImageById: React.FC<Props> = ({prompt_id, style_id, onMouseEnter, onMouseLeave, onClick}) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const imageUrl = `/thumb?prompt_id=${prompt_id}&style_id=${style_id}`;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {threshold: 0.1}
        );

        const currentImgRef = imgRef.current;

        if (currentImgRef) {
            observer.observe(currentImgRef);
        }

        return () => {
            if (currentImgRef) {
                observer.unobserve(currentImgRef);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        onMouseEnter && onMouseEnter(prompt_id, style_id);
    }

    const handleMouseLeave = () => {
        onMouseLeave && onMouseLeave(prompt_id, style_id);
    }

    const handleClick = () => {
        onClick && onClick(prompt_id, style_id);
    }

    return <img ref={imgRef} src={isVisible ? imageUrl : undefined} alt="" data-src={imageUrl}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseEnter}
                onClick={handleClick}
    />;
};

export default ImageById;
