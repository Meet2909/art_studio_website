    import React, { useEffect, useRef, useCallback, useMemo } from "react";
    import { hexToRgb } from "../lib/utils";

    const DotGrid = ({
    dotSize = 20,
    gap = 40,
    baseColor = "#30243b",
    activeColor = "#ffffff",
    proximity = 200,
    className = "",
    style,
    }) => {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const dotsRef = useRef([]);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
    const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

    // 1. Build the Grid (Same as before)
    const buildGrid = useCallback(() => {
        const wrap = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const { width, height } = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);

        const cols = Math.floor((width + gap) / (dotSize + gap));
        const rows = Math.floor((height + gap) / (dotSize + gap));
        const cell = dotSize + gap;

        const gridW = cell * cols - gap;
        const gridH = cell * rows - gap;

        const extraX = width - gridW;
        const extraY = height - gridH;

        const startX = extraX / 2 + dotSize / 2;
        const startY = extraY / 2 + dotSize / 2;

        const dots = [];
        for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cx = startX + x * cell;
            const cy = startY + y * cell;
            dots.push({
            cx,
            cy,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            });
        }
        }
        dotsRef.current = dots;
    }, [dotSize, gap]);

    // 2. Animation Loop (Same as before)
    useEffect(() => {
        let rafId;
        const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const FRICTION = 0.90;
        const SPRING = 0.009;
        const MOUSE_FORCE = 0.3;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        for (const dot of dotsRef.current) {
            const dx = dot.cx - mx;
            const dy = dot.cy - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < proximity) {
            const angle = Math.atan2(dy, dx);
            const force = (proximity - dist) / proximity;
            dot.vx += Math.cos(angle) * force * MOUSE_FORCE * 5;
            dot.vy += Math.sin(angle) * force * MOUSE_FORCE * 5;
            }

            dot.vx -= dot.x * SPRING;
            dot.vy -= dot.y * SPRING;
            dot.vx *= FRICTION;
            dot.vy *= FRICTION;
            dot.x += dot.vx;
            dot.y += dot.vy;

            const displacement = Math.sqrt(dot.x * dot.x + dot.y * dot.y);
            let r = baseRgb.r,
            g = baseRgb.g,
            b = baseRgb.b;

            if (displacement > 1) {
            const t = Math.min(displacement / 20, 1);
            r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
            g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
            b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
            }

            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.beginPath();
            ctx.arc(dot.cx + dot.x, dot.cy + dot.y, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        rafId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(rafId);
    }, [proximity, baseRgb, activeRgb, dotSize]);

    // 3. Resize Listener
    useEffect(() => {
        buildGrid();
        const handleResize = () => buildGrid();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [buildGrid]);

    // 4. Mouse AND Touch Listeners (Fixed)
    useEffect(() => {
        // Handle Mouse Move
        const handleMouseMove = (e) => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (rect) {
            mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            };
        }
        };

        // Handle Touch Move (New)
        const handleTouchMove = (e) => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        // Check if touch exists and rect is valid
        if (rect && e.touches.length > 0) {
            const touch = e.touches[0];
            mouseRef.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
            };
        }
        };

        // Handle Reset (Mouse Leave / Touch End)
        const handleLeave = () => {
        mouseRef.current = { x: -9999, y: -9999 };
        };

        // Add Event Listeners
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove); // Tracks dragging finger
        window.addEventListener("touchstart", handleTouchMove); // Tracks initial tap
        window.addEventListener("touchend", handleLeave); // Reset on lift

        wrapperRef.current?.addEventListener("mouseleave", handleLeave);

        // Clean up
        return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchstart", handleTouchMove);
        window.removeEventListener("touchend", handleLeave);
        wrapperRef.current?.removeEventListener("mouseleave", handleLeave);
        };
    }, []);

    return (
        <section
        className={`flex items-center justify-center h-full w-full relative ${className}`}
        style={style}
        >
        <div ref={wrapperRef} className="w-full h-full relative">
            <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            />
        </div>
        </section>
    );
    };

    export default DotGrid;






