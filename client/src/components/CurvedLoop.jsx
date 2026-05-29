    import { useRef, useEffect, useState, useMemo, useId } from 'react';

    const CurvedLoop = ({
    marqueeText = '',
    speed = 2,
    className,
    curveAmount = 50,
    direction = 'left',
    interactive = true,
    onClick // ADDED ONCLICK PROP
    }) => {
    const text = useMemo(() => {
        const hasTrailing = /\s|\u00A0$/.test(marqueeText);
        return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
    }, [marqueeText]);

    const measureRef = useRef(null);
    const textPathRef = useRef(null);
    const pathRef = useRef(null);
    const [spacing, setSpacing] = useState(0);
    const [offset, setOffset] = useState(0);
    const uid = useId();
    const pathId = `curve-${uid}`;
    const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

    const dragRef = useRef(false);
    const lastXRef = useRef(0);
    const dirRef = useRef(direction);
    const velRef = useRef(0);

    const textLength = spacing;
    const totalText = textLength
        ? Array(Math.ceil(1800 / textLength) + 2)
            .fill(text)
            .join('')
        : text;
    const ready = spacing > 0;

    useEffect(() => {
        if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
    }, [text, className]);

    useEffect(() => {
        if (!spacing) return;
        if (textPathRef.current) {
        const initial = -spacing;
        textPathRef.current.setAttribute('startOffset', initial + 'px');
        setOffset(initial);
        }
    }, [spacing]);

    useEffect(() => {
        if (!spacing || !ready) return;
        let frame = 0;
        const step = () => {
        if (!dragRef.current && textPathRef.current) {
            const delta = dirRef.current === 'right' ? speed : -speed;
            const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
            let newOffset = currentOffset + delta;
            const wrapPoint = spacing;
            if (newOffset <= -wrapPoint) newOffset += wrapPoint;
            if (newOffset > 0) newOffset -= wrapPoint;
            textPathRef.current.setAttribute('startOffset', newOffset + 'px');
            setOffset(newOffset);
        }
        frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [spacing, speed, ready]);

    const onPointerDown = e => {
        if (!interactive) return;
        dragRef.current = true;
        lastXRef.current = e.clientX;
        velRef.current = 0;
        e.target.setPointerCapture(e.pointerId);
    };

    const onPointerMove = e => {
        if (!interactive || !dragRef.current || !textPathRef.current) return;
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        velRef.current = dx;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + dx;
        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;
        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
        setOffset(newOffset);
    };

    const endDrag = () => {
        if (!interactive) return;
        dragRef.current = false;
        dirRef.current = velRef.current > 0 ? 'right' : 'left';
    };

    // ADDED POINTER LOGIC FOR ONCLICK
    const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : (onClick ? 'pointer' : 'auto');

    return (
        <div
        className={`flex items-center justify-center w-full py-4 overflow-hidden transition-all duration-300 ${onClick ? 'hover:scale-105' : ''}`}
        style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClick={onClick}
        >
            <svg
                className="select-none w-full overflow-visible block aspect-[100/12] text-[3rem] md:text-[6rem] sm:text-[3rem] font-bold uppercase leading-none drop-shadow-lg"
                viewBox="0 0 1440 120"
            >
                <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
                {text}
                </text>
                <defs>
                <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
                
                {/* --- NEW: SVG Gradient Definition --- */}
                <linearGradient id={`text-gradient-${uid}`} x1="10%" y1="5%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff5b5b" />   {/* Pink */}
                    <stop offset="50%" stopColor="#ff9437" />  {/* Light Blue */}
                    <stop offset="100%" stopColor="#ffeb3b" /> {/* Deep Blue */}
                </linearGradient>
                </defs>
                
                {ready && (
                <text 
                    xmlSpace="preserve" 
                    // --- NEW: Apply the gradient using the fill attribute ---
                    fill={`url(#text-gradient-${uid})`} 
                    className={className ?? ''}
                >
                    <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace="preserve">
                    {totalText}
                    </textPath>
                </text>
                )}
            </svg>
        </div>
    );
    };
    export default CurvedLoop;