import React, { useEffect, useState } from "react";
    import TiltedCard from "../components/TiltedCard";
    import { RefreshCw } from "lucide-react"; // Import a spinner icon

    const Gallery = () => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch items from the backend
        const fetchGallery = async () => {
        try {
            const response = await fetch("/api/admin/gallery");
            const data = await response.json();
            setGalleryItems(data);
        } catch (error) {
            console.error("Failed to load gallery:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchGallery();
    }, []);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-black/30">
        <div className="max-w-[90rem] mx-auto mb-16 px-4">
            <h2 className="lg:text-8xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff83cb] via-[#AEE2FF] to-[#f4507e] text-center pb-2">
            Student Gallery
            </h2>
            <br />
            <p className="text-gray-0 text-center text-3xl max-w-2xl mx-auto">
            Explore the creative perspectives of our students.
            </p>
        </div>

        {loading ? (
            <div className="flex justify-center text-white">
            <RefreshCw className="animate-spin w-10 h-10 text-[#D984B5]" />
            </div>
        ) : (
            <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-24 place-items-center">
                {galleryItems.map((item) => {
                // 1. Calculate the aspect ratio (e.g., "550 / 350")
                const widthNum = parseFloat(item.width || "400");
                const heightNum = parseFloat(item.height || "400");
                const aspectRatio = `${widthNum} / ${heightNum}`;

                return (
                    <div key={item._id} className="w-full flex justify-center">
                    <div
                        className="relative"
                        style={{
                        // 2. Set width to fill the grid column
                        width: "100%",

                        // 3. Apply the ratio (This is the Magic Fix)
                        // The height will now calculate itself automatically!
                        aspectRatio: aspectRatio,

                        // 4. Cap the size so huge images don't explode
                        maxWidth: `min(100%, ${item.width || "450px"})`,
                        }}
                    >
                        <TiltedCard
                        imageSrc={item.imageUrl}
                        containerHeight="100%"
                        containerWidth="100%"
                        imageHeight="100%"
                        imageWidth="100%"
                        rotateAmplitude={10}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip={true}
                        displayOverlayContent={true}
                        rounded={item.rounded || "rounded-[15px]"}
                        overlayContent={
                            <div className="w-full h-full bg-gradient-to-t from-black/0 to-transparent pointer-events-none" />
                        }
                        />
                    </div>
                    </div>
                );
                })}
            </div>

            {galleryItems.length === 0 && (
                <p className="text-center text-gray-400 text-xl mt-12">
                No masterpieces uploaded yet. Check back soon!
                </p>
            )}
            </div>
        )}
        </div>
    );
    };

    export default Gallery;
