    import React, { useEffect, useState } from 'react';
    import CircularGallery from './CircularGallery';

    const HomeGallerySection = ({ navigateTo }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // 1. Listener to detect Mobile vs Desktop
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchFeaturedImages = async () => {
        try {
            const res = await fetch("/api/admin/gallery");
            
            // Safety Check
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server returned non-JSON response");
            }

            const data = await res.json();

            // Filter for Featured items
            const featuredData = data.filter(item => 
                item.isFeatured === true || 
                item.isFeatured === "true" || 
                item.category === "Featured"
            ).slice(0, 10); 

            const formattedItems = featuredData.map(item => {
            const width = item.width ? parseInt(item.width, 10) : 400;
            const height = item.height ? parseInt(item.height, 10) : 500;
            const roundedNum = item.rounded ? parseInt(item.rounded.replace(/\D/g, ''), 10) : 20;
            const roundedVal = roundedNum / 400; 

            return {
                ...item,
                image: item.imageUrl, 
                text: item.title,
                width: isNaN(width) ? 400 : width,   
                height: isNaN(height) ? 500 : height, 
                rounded: isNaN(roundedVal) ? 0.05 : roundedVal,
            };
            });

            setItems(formattedItems);
        } catch (error) {
            console.error("Gallery Error:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
        };

        fetchFeaturedImages();
    }, []);

    if (loading) return <div className="text-black text-center pt-20">Loading Gallery...</div>;
    if (items.length === 0) return null;

    return (
        <div className="w-full relative pb-20 bg-transparent flex flex-col items-center z-20">
        
        {/* HEADER */}
        <h2 className="md:hidden text-3xl font-bold text-center mb-8 mt-10 text-black">
            Student Art
        </h2>

        {/* --- CONDITIONAL RENDERING --- */}
        
        {!isMobile ? (
            /* DESKTOP VIEW: High Rotation (bend = 3) */
            <div className="hidden md:block w-full h-[800px] relative mb-8 -mt-32">
            <CircularGallery 
                key="desktop-gallery"
                items={items} 
                bend={3} 
                textColor="#ffffff" 
                borderRadius={0.05}
                scrollSpeed={2}
            />
            </div>
        ) : (
            /* MOBILE VIEW: Low Rotation (bend = 1) */
            /* Note: We force a specific height so it doesn't get cut off */
            <div className="md:hidden w-full h-[500px] relative mb-8">
            <CircularGallery 
                key="mobile-gallery"
                items={items} 
                bend={1}  /* <--- LESS ROTATION FOR MOBILE */
                textColor="#000000" /* Dark text often reads better on mobile light bg */
                borderRadius={0.05}
                scrollSpeed={2}
            />
            </div>
        )}

        {/* BUTTON */}
        <button
            onClick={() => navigateTo("gallery")}
            className="group relative w-auto max-w-full px-8 py-3 md:px-16 md:py-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-black/20 text-black transition-all duration-300 ease-out hover:scale-105 shadow-xl"
        >
            <span className="relative z-10 flex items-center justify-center gap-3 font-medium text-lg md:text-2xl tracking-wide">
            View More In Gallery
            </span>
        </button>

        </div>
    );
    };

    export default HomeGallerySection;