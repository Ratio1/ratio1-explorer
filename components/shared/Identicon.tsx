import { create } from 'ethereum-blockies';
import { FunctionComponent, useEffect, useRef } from 'react';

interface BlockiesIdenticonProps {
    value: string;
    size?: number;
}

const Identicon: FunctionComponent<BlockiesIdenticonProps> = ({ value, size = 32 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !value) return;

        const icon = create({
            seed: value.toLowerCase(),
            size: 8,
            scale: Math.floor(size / 8),
        });

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Ensure the image is loaded before drawing
        const img = new Image();
        img.src = icon.toDataURL();
        img.onload = () => {
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
        };
    }, [value, size]);

    return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: '50%' }} />;
};

export default Identicon;
