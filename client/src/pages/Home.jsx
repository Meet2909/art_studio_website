    import React from "react";
    import { ArrowRight, Brush, Shapes, Palette } from "lucide-react";
    import HomeGallerySection from "../components/HomeGallerySection"; 

    const Home = ({ navigateTo }) => (
    <div className="relative pt-20">
        {/* HERO SECTION */}
        <div className="relative min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-[90rem] mx-auto w-full">
            
            {/* --- BANNER IMAGE UPDATE --- */}
            <div className="flex justify-center mb-8 md:mb-12">
                <img 
                    src="/Banner2.png" 
                    alt="A Courtyard of Endless Creativity" 
                    className="w-full max-w-6xl h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-700"
                />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8">
            <button
                onClick={() => navigateTo("courses")}
                className="group relative w-auto max-w-full px-6 py-3 md:px-16 md:py-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border border-black/10 text-black transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
            >
                <span className="relative z-10 flex items-center justify-center gap-3 font-medium text-lg md:text-2xl tracking-wide">
                Start Creating <ArrowRight className="w-3 h-5 md:w-8 md:h-8" />
                </span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300/40 to-blue-300/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            </div>
        </div>
        </div>

        <HomeGallerySection navigateTo={navigateTo} />

        {/* FEATURES SECTION */}
        <div className="py-20 md:py-32 px-4">
            <div className="flex justify-center mb-12">
                <span className="px-8 py-2 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff70c4] to-[#7ad1ff]" style={{ fontFamily: "'Rubik Doodle Shadow', system-ui" }}>
                    What we teach
                </span>
            </div>
            
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {[
            {
                icon: Brush,
                title: "Fine Arts & Modern Art",
                desc: "Oil, Acrylic & Watercolors",
            },
            { icon: Shapes, title: "Sculpting", desc: "Clay modeling & Pottery" },
            ].map((cat, idx) => (
            <div
                key={idx}
                className="glass-card p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] text-center group hover:-translate-y-4 transition-transform duration-300 bg-white/40 border border-white/40 shadow-lg"
            >
                <div className="w-20 h-20 md:w-28 md:h-28 mx-auto bg-white/60 rounded-full flex items-center justify-center mb-6 md:mb-8 group-hover:bg-[#AEE2FF] transition-colors shadow-inner">
                <cat.icon className="text-gray-800 group-hover:text-[#3D2C4D] h-10 w-10 md:h-14 md:w-14" />
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-black mb-2 md:mb-4">
                {cat.title}
                </h3>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                {cat.desc}
                </p>
            </div>
            ))}
        </div>
        </div>
    </div>
    );

    export default Home;