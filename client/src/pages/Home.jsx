import React from "react";
import { ArrowRight, Brush, Shapes, Building2 } from "lucide-react";
import HomeGallerySection from "../components/HomeGallerySection"; 

const Home = ({ navigateTo }) => (
<div className="relative pt-20">
    {/* HERO SECTION */}
    <div className="relative min-h-[40vh] md:min-h-[20vh] flex flex-col items-center justify-center overflow-hidden">
    <div className="relative z-5 text-center px-4 max-w-[90rem] mx-auto w-full">
        
        {/* --- BANNER IMAGE UPDATE --- */}
        <div className="flex justify-center mb-8 md:mb-8">
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
            <span className="px-8 py-2 text-5xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff5454] to-[#e9e787]" style={{ fontFamily: "'Kaushan Script', cursive" }}>
                What we Offer
            </span>
        </div>
        
    {/* --- UPDATED: "What we Offer" Cards Grid --- */}
    <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 relative z-10">
            {[
            {
                icon: Brush,
                title: "Fine Arts & Modern Art",
                desc: "Oil, Acrylic & Watercolors",
                route: "art-store",
                colorTheme: "bg-[#ca679094] hover:bg-[#ff8f8f] text-black shadow-[#FF7eb3]/40", // Vibrant Pink
                iconColor: "text-[#FF7eb3]"
            },
            { 
                icon: Shapes, 
                title: "Sculpting", 
                desc: "Clay modeling & Pottery",
                route: "courses",
                colorTheme: "bg-[#ffc7829a] hover:bg-[#ff9959] text-black shadow-[#FFB75E]/40", // Vibrant Orange
                iconColor: "text-[#FFB75E]"
            },
            { 
                icon: Building2, 
                title: "Corporate Workshops", 
                desc: "Team activities & Stress Relief",
                route: "corporate",
                colorTheme: "bg-[#42a1ff8b] hover:bg-[#7c25ff] text-black shadow-[#42a1ff]/40", // Vibrant Blue
                iconColor: "text-[#42a1ff]"
            }
            ].map((cat, idx) => (
            <div
                key={idx}
                onClick={() => navigateTo(cat.route)}
                // Removed glass classes, added dynamic colorTheme
                className={`${cat.colorTheme} p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] text-center group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-4 shadow-xl`}
            >
                <div className="w-20 h-20 md:w-28 md:h-28 mx-auto bg-white rounded-full flex items-center justify-center mb-6 md:mb-8 transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <cat.icon className={`${cat.iconColor} h-10 w-10 md:h-14 md:w-14`} />
                </div>
                <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                {cat.title}
                </h3>
                <p className="font-medium text-lg md:text-xl opacity-90 leading-relaxed">
                {cat.desc}
                </p>
            </div>
            ))}
        </div>
    </div>
</div>
);

export default Home;