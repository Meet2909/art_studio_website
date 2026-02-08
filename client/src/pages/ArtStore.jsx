    // import React, { useEffect, useState } from 'react';
    // import { ShoppingBag, Palette } from 'lucide-react'; // Added Palette icon
    // import toast from 'react-hot-toast';

    // const ArtStore = ({ addToCart }) => {
    // const [artPieces, setArtPieces] = useState([]);
    // const [loading, setLoading] = useState(true);

    // // Dynamic API URL
    // const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    // const API_URL = isLocal ? "http://localhost:5000" : "";

    // useEffect(() => {
    //     fetchArt();
    // }, []);

    // const fetchArt = async () => {
    //     try {
    //     const res = await fetch(`/api/admin/art`);
    //     const data = await res.json();
    //     setArtPieces(data);
    //     } catch (error) {
    //     console.error("Error fetching art:", error);
    //     toast.error("Could not load gallery");
    //     } finally {
    //     setLoading(false);
    //     }
    // };

    // if (loading) {
    //     return (
    //     <div className="min-h-screen flex items-center justify-center pt-20">
    //         <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
    //         <div className="w-12 h-12 border-4 border-[#D984B5] border-t-transparent rounded-full animate-spin mb-4"></div>
    //         <p className="text-black font-bold">Curating Gallery...</p>
    //         </div>
    //     </div>
    //     );
    // }

    // return (
    //     <div className="pt-32 pb-20 px-4 min-h-screen">
    //     <div className="max-w-7xl mx-auto">
            
    //         {/* --- HEADER: NOW INSIDE A GLASS CONTAINER --- */}
    //         <div className="flex justify-center mb-16">
    //             <div className="glass-card p-10 md:p-14 rounded-[3rem] text-center max-w-4xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    
    //                 {/* Decorative Shine Effect */}
    //                 <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out pointer-events-none" />
                    
    //                 <div className="inline-flex items-center justify-center p-4 bg-[#ff3faf]/20 rounded-full mb-6 text-[#ff0040] shadow-inner">
    //                     <Palette size={40} />
    //                 </div>

    //                 <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-6 drop-shadow-lg tracking-tight" style={{fontFamily: "'Limelight', sans-serif",fontweight: "400",fontstyle: "normal"}}>
    //                     Curated Artworks
    //                 </h1>
    //                 <p className="text-blue-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
    //                     Original pieces handcrafted with love. Bring a unique piece of the studio's soul into your home.
    //                 </p>
    //             </div>
    //         </div>

    //         {/* --- ART GRID --- */}
    //         {artPieces.length === 0 ? (
    //         <div className="text-center text-black text-xl mt-20">No art pieces available right now. Check back soon!</div>
    //         ) : (
    //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //             {artPieces.map((art) => (
    //                 <div key={art._id} className="glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#D984B5]/20 transition-all duration-300 group border border-white/10 bg-white/5">
                    
    //                 {/* Image Container */}
    //                 <div className="relative h-80 overflow-hidden">
    //                     <img 
    //                     src={art.image} 
    //                     alt={art.title} 
    //                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    //                     />
    //                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        
    //                     {/* Badge */}
    //                     <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
    //                         {art.category}
    //                     </div>
    //                 </div>

    //                 {/* Details */}
    //                 <div className="p-6">
    //                     <div className="flex justify-between items-start mb-3">
    //                     <h3 className="text-2xl font-bold text-white group-hover:text-[#D984B5] transition-colors">{art.title}</h3>
    //                     <span className="text-xl font-bold text-[#ff9ed2]">₹{art.price}</span>
    //                     </div>
                        
    //                     <p className="text-gray-300 text-sm mb-6 line-clamp-2 h-10">{art.description}</p>

    //                     <button 
    //                     onClick={() => {
    //                         addToCart({ ...art, type: 'art' }); // Important: type='art'
    //                     }}
    //                     className="w-full py-3 bg-gradient-to-r from-[#fd818b] to-[#9adcff] text-blue-800 rounded-xl font-bold hover:shadow-lg hover:shadow-[#D984B5]/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
    //                     >
    //                     <ShoppingBag size={20} /> Add to Collection
    //                     </button>
    //                 </div>
    //                 </div>
    //             ))}
    //             </div>
    //         )}
    //     </div>
    //     </div>
    // );
    // };

    // export default ArtStore;    





    import React, { useEffect, useState } from 'react';
    import { ShoppingBag, Palette } from 'lucide-react';
    import toast from 'react-hot-toast';

    const ArtStore = ({ addToCart }) => {
    const [artPieces, setArtPieces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArt();
    }, []);

    const fetchArt = async () => {
        try {
        const res = await fetch(`/api/admin/art`);
        const data = await res.json();
        setArtPieces(data);
        } catch (error) {
        console.error("Error fetching art:", error);
        toast.error("Could not load gallery");
        } finally {
        setLoading(false);
        }
    };

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#D984B5] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-black font-bold">Curating Gallery...</p>
            </div>
        </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex justify-center mb-16">
            <div className="glass-card p-10 md:p-14 rounded-[3rem] text-center max-w-4xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">

                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out pointer-events-none" />

                <div className="inline-flex items-center justify-center p-4 bg-[#ff3faf]/20 rounded-full mb-6 text-[#ff0040] shadow-inner">
                <Palette size={40} />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-6 tracking-tight" style={{ fontFamily: "'Limelight', sans-serif" }}>
                Curated Artworks
                </h1>

                <p className="text-blue-600 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                Original pieces handcrafted with love. Bring a unique piece of the studio's soul into your home.
                </p>
            </div>
            </div>

            {/* Masonry Grid */}
            {artPieces.length === 0 ? (
            <div className="text-center text-black text-xl mt-20">
                No art pieces available right now.
            </div>
            ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">

                {artPieces.map((art) => (
                <div
                    key={art._id}
                    className={`break-inside-avoid glass-card overflow-hidden group border border-white/10 bg-white/5 shadow-lg hover:shadow-2xl hover:shadow-[#D984B5]/30 transition-all duration-500 ${art.rounded || "rounded-3xl"}`}
                >

                    {/* Image Wrapper with true ratio */}
                    <div
                    className="relative overflow-hidden"
                    style={{
                        aspectRatio: `${art.width || 400} / ${art.height || 400}`
                    }}
                    >
                    <img
                        src={art.image}
                        alt={art.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110 blur-[2px] group-hover:blur-0"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70 group-hover:opacity-40 transition" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                        {art.category}
                    </div>

                    {/* Price glass badge */}
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white font-bold px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                        ₹{art.price}
                    </div>

                    {/* Sold out ribbon */}
                    {!art.inStock && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-4 py-1 rotate-45 translate-x-6 translate-y-4 shadow-lg">
                        SOLD
                        </div>
                    )}
                    </div>

                    {/* Details */}
                    <div className="p-6">

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff9ed2] transition">
                        {art.title}
                    </h3>

                    <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                        {art.description}
                    </p>

                    <button
                        disabled={!art.inStock}
                        onClick={() => addToCart({ ...art, type: 'art' })}
                        className={`w-full py-3 rounded-xl font-bold transition-all transform flex items-center justify-center gap-2
                        ${art.inStock
                            ? "bg-gradient-to-r from-[#fd818b] to-[#9adcff] text-blue-800 hover:shadow-lg hover:shadow-[#D984B5]/40 hover:-translate-y-1"
                            : "bg-gray-500 text-white cursor-not-allowed"
                        }`}
                    >
                        <ShoppingBag size={18} />
                        {art.inStock ? "Add to Collection" : "Out of Stock"}
                    </button>

                    </div>
                </div>
                ))}

            </div>
            )}
        </div>
        </div>
    );
    };

    export default ArtStore;
