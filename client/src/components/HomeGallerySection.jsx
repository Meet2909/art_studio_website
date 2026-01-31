    import React, { useEffect, useState } from 'react';
    import CircularGallery from './CircularGallery';

    const HomeGallerySection = ({ navigateTo }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedImages = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/gallery`);
            if (!res.ok) throw new Error('Failed to fetch gallery items');

            const data = await res.json();

            // 1. FILTER (Take top 6)
            const featuredData = data.slice(0, 6);

            // 2. TRANSFORM
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
        
        {/* HEADER for Mobile Visibility */}
        <h2 className="md:hidden text-4xl font-bold text-center mb-8 mt-10" style={{ fontFamily: "'Rubik Doodle Shadow', system-ui" }}>
            Student Art
        </h2>

        {/* --- VIEW 1: DESKTOP (Circular Gallery) --- */}
        {/* hidden on mobile, block on md+ screens */}
        <div className="hidden md:block w-full h-[800px] relative mb-8 -mt-32">
            <CircularGallery 
            key={items.length} 
            items={items} 
            bend={2} 
            textColor="#ffffff" 
            borderRadius={0.05}
            scrollSpeed={2}
            />
        </div>

        {/* --- VIEW 2: MOBILE (Clean Vertical Stack) --- */}
        {/* block on mobile, hidden on md+ screens */}
        <div className="md:hidden w-full px-6 flex flex-col gap-8 mb-12">
            {items.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded-2xl shadow-lg transform rotate-2 even:-rotate-2 hover:rotate-0 transition-transform duration-300">
                    <img 
                        src={item.image} 
                        alt={item.text} 
                        className="w-full h-64 object-cover rounded-xl"
                    />
                    <p className="text-center font-bold mt-2 font-rubik">{item.text}</p>
                </div>
            ))}
        </div>

        {/* SHARED BUTTON */}
        <button
            onClick={() => navigateTo("gallery")}
            className="group relative w-auto max-w-full px-8 py-4 md:px-16 md:py-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-black/20 text-black transition-all duration-300 ease-out hover:scale-105 shadow-xl"
        >
            <span className="relative z-10 flex items-center justify-center gap-3 font-medium text-lg md:text-2xl tracking-wide">
            View More In Gallery
            </span>
        </button>

        </div>
    );
    };

    export default HomeGallerySection;