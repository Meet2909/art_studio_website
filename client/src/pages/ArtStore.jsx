    import React, { useEffect, useState } from 'react';
    import { ShoppingBag, Palette } from 'lucide-react'; // Added Palette icon
    import toast from 'react-hot-toast';

    const ArtStore = ({ addToCart }) => {
    const [artPieces, setArtPieces] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dynamic API URL
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        fetchArt();
    }, []);

    const fetchArt = async () => {
        try {
        const res = await fetch(`${API_URL}/api/admin/art`);
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
            <p className="text-white font-bold">Curating Gallery...</p>
            </div>
        </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
            
            {/* --- HEADER: NOW INSIDE A GLASS CONTAINER --- */}
            <div className="flex justify-center mb-16">
                <div className="glass-card p-10 md:p-14 rounded-[3rem] text-center max-w-4xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    
                    {/* Decorative Shine Effect */}
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out pointer-events-none" />
                    
                    <div className="inline-flex items-center justify-center p-4 bg-[#ff3faf]/20 rounded-full mb-6 text-[#ff0040] shadow-inner">
                        <Palette size={40} />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-6 drop-shadow-lg tracking-tight" style={{fontFamily: "'Limelight', sans-serif",fontweight: "400",fontstyle: "normal"}}>
                        Curated Artworks
                    </h1>
                    <p className="text-blue-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                        Original pieces handcrafted with love. Bring a unique piece of the studio's soul into your home.
                    </p>
                </div>
            </div>

            {/* --- ART GRID --- */}
            {artPieces.length === 0 ? (
            <div className="text-center text-white/50 text-xl mt-20">No art pieces available right now. Check back soon!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artPieces.map((art) => (
                    <div key={art._id} className="glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#D984B5]/20 transition-all duration-300 group border border-white/10 bg-white/5">
                    
                    {/* Image Container */}
                    <div className="relative h-80 overflow-hidden">
                        <img 
                        src={art.image} 
                        alt={art.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        
                        {/* Badge */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                            {art.category}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#D984B5] transition-colors">{art.title}</h3>
                        <span className="text-xl font-bold text-[#ff9ed2]">₹{art.price}</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-6 line-clamp-2 h-10">{art.description}</p>

                        <button 
                        onClick={() => {
                            addToCart({ ...art, type: 'art' }); // Important: type='art'
                        }}
                        className="w-full py-3 bg-gradient-to-r from-[#D984B5] to-[#AEE2FF] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#D984B5]/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                        <ShoppingBag size={18} /> Add to Collection
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