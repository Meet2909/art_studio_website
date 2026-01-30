    // src/pages/Home.jsx
    import React from "react";
    import { ArrowRight, Brush, Shapes, Palette } from "lucide-react";
    import HomeGallerySection from "../components/HomeGallerySection"; // Import the new component

    const Home = ({ navigateTo }) => (
    <div className="relative pt-20">
        {/* HERO SECTION */}
        <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-[90rem] mx-auto">
            {/* 1. RESPONSIVE TEXT SIZE & COLOR */}
            <h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-black mb-8 md:mb-12 leading-tight md:leading-snug drop-shadow-2xl"
            style={{ fontFamily: "'Rubik Doodle Shadow', system-ui" }}
            >
            A Courtyard of <br className="block md:hidden" />
            <span className="block mt-2 md:mt-4">
                endless
                {/* Gradient Text preserved but brightened */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe6dc2] via-[#89d6ff] to-[#f4507e]">
                {" "}
                Creativity
                </span>
            </span>
            </h1>

            {/* 2. RESPONSIVE BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8">
            <button
                onClick={() => navigateTo("courses")}
                className="group relative w-auto max-w-full px-6 py-3 md:px-16 md:py-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-black/20 text-black transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                <span className="relative z-10 flex items-center justify-center gap-3 font-medium text-lg md:text-2xl tracking-wide">
                Start Creating <ArrowRight className="w-3 h-5 md:w-8 md:h-8" />
                </span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-10 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            </div>
        </div>
        </div>

        {/* --- NEW GALLERY STRIP SECTION --- */}
        {/* Passing navigateTo so the 'View More' button works */}
        <HomeGallerySection navigateTo={navigateTo} />
        {/* --------------------------------- */}

        {/* FEATURES SECTION */}
        <div className="py-20 md:py-32 px-4">
            <span className="flex px-8 py-6 text-5xl sm:text-3xl md:text-6xl lg:text-7xl justify-center font-bold mb-8 md:mb-12 leading-tight md:leading-snug drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff70c4] via-[#7ad1ff] to-[#ff4b7e]" style={{ fontFamily: "'Rubik Doodle Shadow', system-ui" }}>What we teach</span>
            <br /><br />
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {[
            {
                icon: Brush,
                title: "Fine Arts",
                desc: "Oil, Acrylic & Watercolors",
            },
            { icon: Shapes, title: "Sculpting", desc: "Clay modeling & Pottery" },
            { icon: Palette, title: "Digital", desc: "Modern Art & Design" },
            ].map((cat, idx) => (
            /* 3. RESPONSIVE CARDS - Dark Glass */
            <div
                key={idx}
                className="glass-card p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] text-center group hover:-translate-y-4 transition-transform duration-300"
            >
                <div className="w-20 h-20 md:w-28 md:h-28 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6 md:mb-8 group-hover:bg-[#AEE2FF] transition-colors">
                {/* Icons white by default, dark on hover */}
                <cat.icon className="text-black group-hover:text-[#3D2C4D] h-10 w-10 md:h-14 md:w-14" />
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-black mb-2 md:mb-4">
                {cat.title}
                </h3>
                <p className="text-black text-lg md:text-xl leading-relaxed">
                {cat.desc}
                </p>
            </div>
            ))}
        </div>
        </div>
    </div>
    );

    export default Home;
