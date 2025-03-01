import { create } from 'ethereum-blockies';
import { FunctionComponent, useEffect, useRef } from 'react';

interface BlockiesIdenticonProps {
    value: string;
    size?: number;
    scale?: number;
}

const Identicon: FunctionComponent<BlockiesIdenticonProps> = ({ value, size = 32 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current && value) {
            const icon = create({
                seed: value.toLowerCase(),
                size: 8,
                scale: Math.floor(size / 8),
            });

            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(icon, 0, 0, size, size);
            }
        }
    }, [value, size]);

    return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: '50%' }} />;
};

export default Identicon;
