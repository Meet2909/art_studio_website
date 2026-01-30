    import React, { useState, useEffect } from "react";
    

    const About = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutContent = async () => {
        try {
            // Update URL to match your backend port
            const res = await fetch("/api/user/about");
            const data = await res.json();
            setContent(data);
        } catch (error) {
            console.error("Failed to load about content:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchAboutContent();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!content) return null;

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto relative">
            
            {/* --- HERO SECTION --- */}
            <div className="flex flex-col md:flex-row items-start gap-8 mb-32 relative z-10">
            {/* Left: Title */}
            <div className="w-full md:w-1/2 pt-10 z-20">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fe6dc2] to-[#3bbaff] drop-shadow-lg" style={{ fontFamily: "'Fascinate Inline', system-ui" }}>
                Behind <br/> the <br/> Canvas
                </h1>
                <div className="w-32 h-2 bg-[#f4507e] mb-8 ml-2 rounded-full"></div>
            </div>

            {/* Right: Main Portrait (IMAGE 1) */}
            <div className="w-full md:w-1/2 relative md:mt-12 flex justify-center md:justify-end">
                <div className="relative z-10 w-full max-w-sm transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                <img 
                    src={content.heroImage} 
                    alt="Chetna - Founder" 
                    className="w-full h-auto border-[10px] border-white/90 shadow-2xl" 
                />
                <div className="absolute -bottom-8 -left-8 bg-[#240046] p-6 text-white font-bold text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform -rotate-3 border border-white/20">
                    Chetna Aeron
                    <span className="block text-sm text-[#D984B5] font-normal mt-1">Founder & Artist</span>
                </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[#D984B5]/20 rounded-full blur-[80px] -z-10"></div>
            </div>
            </div>

            {/* --- STORY SECTION --- */}
            <div className="relative mb-40">
            
            {/* IMAGE 2: Floating Top Left */}
            <div className="hidden lg:block absolute -left-24 top-0 w-72 h-[450px] z-0 transform -rotate-6 hover:scale-105 transition-transform duration-500">
                <img 
                src={content.storyImageLeft} 
                className="w-full h-full object-cover border-4 border-white/80 shadow-xl transition-opacity"
                alt="Story Left"
                />
            </div>

            {/* CENTRAL TEXT BLOCK */}
            <div className="relative z-10 max-w-4xl mx-auto glass-card p-10 md:p-20 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-10 text-black border-b border-white/10 pb-6">
                A Sanctuary for <span className="text-[#2a6e9383]">Imagination</span>
                </h2>
                
                <div className="space-y-8 text-lg md:text-xl leading-relaxed text-black font-semibold">
                {content.storyParagraphs?.map((paragraph, index) => (
                    <div key={index}>{paragraph}</div>
                ))}
                </div>
            </div>

            {/* IMAGE 3: Floating Bottom Right */}
            <div className="hidden lg:block absolute -right-36 -bottom-20 w-96 h-64 z-0 transform rotate-3 hover:rotate-6 hover:scale-105 transition-transform duration-500">
                <img 
                src={content.storyImageRight} 
                className="w-full h-full object-cover border-4 border-white/80 shadow-xl"
                alt="Story Right"
                />
            </div>
            </div>

            {/* --- MISSION SECTION --- */}
            <div className="relative mb-40">
            
            {/* IMAGE 4: Floating Top Left (Distinct from Story Image) */}
            <div className="hidden lg:block absolute -left-20 top-0 w-72 h-[450px] z-0 transform -rotate-6 hover:scale-105 transition-transform duration-500">
                <img 
                    src={content.missionImageLeft} 
                    className="w-full h-full object-cover border-4 border-white/80 shadow-xl transition-opacity"
                    alt="Mission Left"
                />
            </div>

            {/* CENTRAL TEXT BLOCK (Mission) */}
            <div className="relative z-10 max-w-4xl mx-auto glass-card p-10 md:p-20 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                {/* Header: Mission */}
                <h2 className="text-3xl md:text-4xl font-bold mb-10 text-black border-b border-white/10 pb-6">
                Our <span className="text-[#0069b9]"> Mission</span>
                </h2>
                <div className="space-y-8 text-lg md:text-xl leading-relaxed text-black font-semibold">
                <p>{content.missionDescription}</p>
                
                {/* Header: Vision */}
                <div className="mt-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black border-b border-white/10 pb-4">
                    Our <span className="text-[#0069b9]"> Vision</span>
                    </h2>
                    <p>{content.visionDescription}</p>
                </div>

                {/* Header: Core Values */}
                <div className="mt-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black border-b border-white/10 pb-4">
                    Our <span className="text-[#0069b9]"> Core Values</span>
                    </h2>
                    <ul className="space-y-4">
                    {content.coreValues?.map((val, index) => (
                        <li key={index}>● {val}</li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
            
            {/* IMAGE 5: Floating Bottom Right (Distinct) */}
            <div className="hidden lg:block absolute -right-36 -bottom-20 w-96 h-64 z-0 transform rotate-3 hover:rotate-6 hover:scale-105 transition-transform duration-500">
                <img 
                    src={content.missionImageRight} 
                    className="w-full h-full object-cover border-4 border-white/80 shadow-xl"
                    alt="Mission Right"
                />
            </div>
            </div>

            {/* --- STATS SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20 items-center">
            
            {/* 1. Large Stat Box */}
            <div className="md:col-span-5 glass-card p-12 rounded-[2.5rem] border border-white/10 text-center transform hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-br from-white/10 to-transparent">
                <h3 className="text-8xl font-bold text-[#D984B5] mb-2 drop-shadow-lg">{content.yearsExperience}</h3>
                <p className="text-xl uppercase tracking-widest text-black font-bold">Years Experience</p>
            </div>

            {/* 2. Square Image (IMAGE 6) */}
            <div className="hidden md:block md:col-span-3 aspect-square rounded-[2rem] overflow-hidden border-4 border-white/20 transform rotate-2 hover:-rotate-2 transition-transform duration-500">
                <img 
                    src={content.statsImage} 
                    className="w-full h-full object-cover" 
                    alt="Gallery Piece" 
                />
            </div>

            {/* 3. Stacked Stats */}
            <div className="md:col-span-4 flex flex-col gap-6">
                <div className="glass-card p-8 rounded-3xl border border-white/10 flex items-center gap-6 hover:bg-white/5 transition-colors">
                <div className="p-4 bg-[#52c2ff]/20 rounded-full text-[#00a6ff]">
                    <div className="w-4 h-4 bg-current rounded-full"></div>
                </div>
                <div>
                    <h3 className="text-4xl font-bold text-black">{content.studentsMentored}</h3>
                    <p className="text-sm text-black font-medium uppercase tracking-wider">Students Mentored</p>
                </div>
                </div>
                
                <div className="glass-card p-8 rounded-3xl border border-white/10 flex items-center gap-6 md:ml-8 hover:bg-white/5 transition-colors">
                <div className="p-4 bg-[#D984B5]/20 rounded-full text-[#D984B5]">
                    <div className="w-4 h-4 bg-current rounded-full"></div>
                </div>
                <div>
                    <h3 className="text-4xl font-bold text-black">{content.exhibitionsHosted}</h3>
                    <p className="text-sm text-black font-medium uppercase tracking-wider">Exhibitions Hosted</p>
                </div>
                </div>
            </div>
            </div>

        </div>
        </div>
    );
    };

    export default About;