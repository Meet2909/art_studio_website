    // src/components/HomeGallerySection.jsx

    import React, { useEffect, useState } from 'react';
    import CircularGallery from './CircularGallery';

    const HomeGallerySection = ({ navigateTo }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedImages = async () => {
        try {
            console.log("1. Fetching from API..."); // DEBUG
            const res = await fetch('/api/admin/gallery');
            
            if (!res.ok) {
            throw new Error('Failed to fetch gallery items');
            }

            const data = await res.json();
            console.log("2. Raw Data received:", data); // DEBUG - Is this empty?

            // 2. FILTER
            const featuredData = data
                .filter(item => item.isFeatured === true || item.isFeatured === "true")
                .slice(0, 6); // <--- Add this slice
            console.log("3. Featured Data length:", featuredData.length); // DEBUG - Is this 0?

            // 3. TRANSFORM
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

    // --- TEMPORARY DEBUG UI ---
    // Instead of returning null, return a message so you can see where it is on screen
    if (loading) return <div className="text-black text-center pt-20">Loading Gallery...</div>;
    
    if (items.length === 0) {
        return (
            <div className="w-full h-40 flex items-center justify-center bg-red-100 z-50 relative">
                <p className="text-red-600 font-bold">
                    No Featured Items Found. Check Console Logs "3. Featured Data length".
                </p>
            </div>
        );
    }

    return (
        <div className="w-full relative -mt-20 md:-mt-32 pb-20 bg-transparent overflow-hidden flex flex-col items-center z-20">
        
        <div className="w-full h-[600px] md:h-[800px] relative mb-8">
            <CircularGallery 
            key={items.length} 
            items={items} 
            bend={2} 
            textColor="#ffffff" 
            borderRadius={0.05}
            scrollSpeed={2}
            />
        </div>

        <button
                onClick={() => navigateTo("courses")}
                className="group relative w-auto max-w-full px-6 py-3 md:px-16 md:py-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-black/20 text-black transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                <span className="relative z-10 flex items-center justify-center gap-3 font-medium text-lg md:text-2xl tracking-wide">
                View More In Gallery
                </span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-10 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

        </div>
    );
    };

    export default HomeGallerySection;