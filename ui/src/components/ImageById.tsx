import React, { useRef, useState, useEffect } from 'react';

interface Props {
    prompt_id: number;
    checkpoint_id: number;
}

const ImageById: React.FC<Props> = ({ prompt_id, checkpoint_id }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const imageUrl = `/image?prompt_id=${prompt_id}&checkpoint_id=${checkpoint_id}`;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
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

    return <img ref={imgRef} src={isVisible ? imageUrl : undefined} alt="Generated" data-src={imageUrl} />;
};

export default ImageById;
