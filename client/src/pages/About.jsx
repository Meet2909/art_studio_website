    import React, { useState, useEffect } from "react";
    import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";

    const About = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutContent = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/user/about`);
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
        <>
        {/* =========================================
            DESKTOP VIEW (UNCHANGED)
            Hidden on mobile (md:hidden)
            ========================================= */}
        <div className="hidden md:block pt-32 pb-20 px-4 min-h-screen overflow-x-hidden">
            <div className="max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row items-start gap-8 mb-32 relative z-10">
                <div className="w-full md:w-1/2 pt-10 z-20">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f8467e] to-[#06a8ff] drop-shadow-lg" style={{fontFamily: "'Limelight', sans-serif"}}>
                    Heart <br /> of the <br /> Den
                    </h1>
                    <div className="w-32 h-2 bg-[#f4507e] mb-8 ml-2 rounded-full"></div>
                </div>
                <div className="w-full md:w-1/2 relative md:mt-12 flex justify-center md:justify-end">
                    <div className="relative z-10 w-full max-w-sm transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                    <img src={content.heroImage} alt="Chetna" className="w-full h-auto border-[10px] border-white/90 shadow-2xl" />
                    </div>
                </div>
                </div>

                <div className="relative mb-40">
                <div className="hidden lg:block absolute -left-24 top-0 w-72 h-[450px] z-20 -rotate-6">
                    <img src={content.storyImageLeft} className="w-full h-full object-cover border-4 border-white/80 shadow-xl" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto glass-card p-20 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                    <h2 className="text-4xl font-bold mb-10 text-black">A Sanctuary for <span className="text-[#2a6e9383]">Imagination</span></h2>
                    <div className="space-y-8 text-xl text-black font-semibold">
                    {content.storyParagraphs?.map((p, i) => <div key={i}>{p}</div>)}
                    </div>
                </div>
                <div className="hidden lg:block absolute -right-36 -bottom-20 w-96 h-64 z-20 rotate-3">
                    <img src={content.storyImageRight} className="w-full h-full object-cover border-4 border-white/80 shadow-xl" />
                </div>
                </div>

                <div className="relative mb-40">
                <div className="hidden lg:block absolute -left-20 top-0 w-72 h-[450px] z-20 -rotate-6">
                    <img src={content.missionImageLeft} className="w-full h-full object-cover border-4 border-white/80 shadow-xl" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto glass-card p-20 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                    <h2 className="text-4xl font-bold mb-10 text-black">Our <span className="text-[#0069b9]"> Mission</span></h2>
                    <p className="text-xl text-black font-semibold mb-8">{content.missionDescription}</p>
                    <h2 className="text-4xl font-bold mb-6 text-black">Our <span className="text-[#0069b9]"> Vision</span></h2>
                    <p className="text-xl text-black font-semibold mb-8">{content.visionDescription}</p>
                    <h2 className="text-4xl font-bold mb-6 text-black">Core <span className="text-[#0069b9]"> Values</span></h2>
                    <ul className="text-xl text-black font-semibold space-y-2">
                        {content.coreValues?.map((val, i) => <li key={i}>● {val}</li>)}
                    </ul>
                </div>
                <div className="hidden lg:block absolute -right-36 -bottom-20 w-96 h-64 z-20 rotate-3">
                    <img src={content.missionImageRight} className="w-full h-full object-cover border-4 border-white/80 shadow-xl" />
                </div>
                </div>

                <div className="grid grid-cols-12 gap-6 mb-20 items-center">
                    <div className="col-span-5 glass-card p-12 rounded-[2.5rem] border border-white/10 text-center">
                        <h3 className="text-8xl font-bold text-[#D984B5] mb-2">{content.yearsExperience}</h3>
                        <p className="text-xl font-bold text-black">Years Experience</p>
                    </div>
                    <div className="col-span-3 aspect-square rounded-[2rem] overflow-hidden border-4 border-white/20 rotate-2">
                        <img src={content.statsImage} className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-4 flex flex-col gap-6">
                        <div className="glass-card p-8 rounded-3xl border border-white/10">
                            <h3 className="text-4xl font-bold text-black">{content.studentsMentored}</h3>
                            <p className="text-sm font-bold text-black">Students Mentored</p>
                        </div>
                        <div className="glass-card p-8 rounded-3xl border border-white/10 ml-8">
                            <h3 className="text-4xl font-bold text-black">{content.exhibitionsHosted}</h3>
                            <p className="text-sm font-bold text-black">Exhibitions Hosted</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            {/* =========================================
            MOBILE VIEW (Fresh Start - Wide & Clean)
            ========================================= */}
        <div className="md:hidden bg-[#fff0f5] min-h-screen">
            
            {/* HEADER */}
            <div className="pt-28 pb-10 px-6 text-center">
                <h1 className="text-5xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f8467e] to-[#06a8ff]" style={{fontFamily: "'Limelight', sans-serif"}}>
                    Heart of the Den
                </h1>
                <p className="mt-6 text-gray-400 font-medium text-sm uppercase tracking-widest">
                    Scroll to Explore
                </p>
            </div>

            <ScrollStack itemScale={0.05} baseScale={0.75} itemStackDistance={40}>

                {/* 1. Intro */}
                <ScrollStackItem 
                    itemClassName="bg-[#c7e9ff80] backdrop-blur-xl border border-white/40"
                    style={{ minHeight: '40vh' }}
                >
                    <h2 className="text-3xl font-bold text-center text-[#2a6e93] mb-4">Welcome</h2>
                    <div className="w-16 h-1 bg-[#2a6e93] mx-auto rounded-full"></div>
                    <p className="text-center mt-6 text-gray-600 font-medium leading-relaxed">
                        Swipe up to uncover our story, our mission, and the artist behind the canvas.
                    </p>
                </ScrollStackItem>

                {/* 2. Hero Image */}
                <ScrollStackItem itemClassName="bg-[#e7e2ff]] p-0 overflow-hidden" style={{ minHeight: '50vh' }}>
                    <img src={content.heroImage} className="w-full h-full object-cover" alt="Chetna" />
                    <div className="absolute bottom-0 left-0 w-full bg-white/95 p-6 backdrop-blur-md border-t border-gray-100">
                        <p className="font-bold text-2xl text-black">Chetna Aeron</p>
                        <p className="text-xs text-[#D984B5] font-bold uppercase tracking-wider mt-1">Founder & Artist</p>
                    </div>
                </ScrollStackItem>

                {/* 3. The Sanctuary */}
                <ScrollStackItem itemClassName="bg-[#dafded7e]">
                    <h2 className="text-2xl font-bold mb-4 text-[#2a6e93]">The Sanctuary</h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        {content.storyParagraphs?.[0] || "Welcome to our creative space."}
                    </p>
                    <img src={content.storyImageLeft} className="w-full h-48 object-cover rounded-[20px] shadow-sm" alt="Studio" />
                </ScrollStackItem>

                {/* 4. Mission */}
                <ScrollStackItem itemClassName="bg-[#fff7ed]">
                    <h2 className="text-2xl font-bold mb-4 text-[#047857]">Our Mission</h2>
                    <p className="text-[#065f46] text-lg font-medium leading-relaxed">
                        {content.missionDescription}
                    </p>
                    <div className="mt-8 border-l-4 border-[#047857] pl-4">
                        <h3 className="text-xl font-bold text-[#047857] mb-2">Vision</h3>
                        <p className="text-sm text-gray-600">{content.visionDescription}</p>
                    </div>
                </ScrollStackItem>

                {/* 5. Core Values */}
                <ScrollStackItem itemClassName="bg-[#dcebff]" style={{ minHeight: '80vh' }}>
                    <div className="flex flex-col h-full">
                        <h2 className="text-2xl font-bold mb-6 text-[#1d4ed8]">Core Values</h2>
                        <ul className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            {content.coreValues?.map((val, i) => {
                                const parts = val.split(':');
                                return (
                                    <li key={i} className="flex items-start gap-3 bg-white/60 p-4 rounded-2xl border border-blue-50">
                                        <span className="text-[#1d4ed8] font-bold text-lg">•</span>
                                        <div className="text-sm text-slate-700">
                                            <span className="font-bold text-[#1d4ed8] block mb-1">{parts[0]}</span>
                                            {parts.slice(1).join(':')}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </ScrollStackItem>

                {/* 6. FINAL STATS CARD (Last Card - No Blur) */}
                <ScrollStackItem 
                    itemClassName="bg-[#fff1f2]" 
                    style={{ minHeight: '60vh' }}
                >
                    {/* Header */}
                    <div className="text-center border-b border-gray-100 pb-4 mb-6">
                        <h2 className="text-2xl font-bold text-[#be123c]">Impact</h2>
                    </div>

                    {/* Big Stat */}
                    <div className="text-center mb-8">
                        <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D984B5] to-[#be123c]" style={{fontFamily: "'Fascinate Inline', sans-serif"}}>
                            {content.yearsExperience}
                        </span>
                        <p className="text-[#be123c] font-bold text-xs uppercase tracking-widest mt-2">Years Experience</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full mb-4">
                        <div className="bg-blue-50 p-4 rounded-2xl border border-slate-100 text-center">
                            <div className="text-2xl mb-2">🎓</div>
                            <h4 className="text-xl font-bold text-slate-800">{content.studentsMentored}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Students</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl border border-slate-100 text-center">
                            <div className="text-2xl mb-2">🎨</div>
                            <h4 className="text-xl font-bold text-slate-800">{content.exhibitionsHosted}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Exhibitions</p>
                        </div>
                    </div>
                </ScrollStackItem>

            </ScrollStack>
        </div>
        </>
    );
    };

    export default About;