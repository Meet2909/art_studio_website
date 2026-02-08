    import React, { useState, useEffect, useRef } from "react";
    import { Users, Coffee, Zap, ArrowRight, CheckCircle, Volume2, VolumeX } from "lucide-react";

    const Corporate = ({ navigateTo }) => {
    const [content, setContent] = useState(null);
    const [isMuted, setIsMuted] = useState(true); 
    const videoRef = useRef(null);

    // Fallback placeholder
    const LOADING_IMG = "https://via.placeholder.com/800x600?text=Loading...";

    useEffect(() => {
        const fetchContent = async () => {
        console.log("Corporate Page: Fetching from /api/user/corporate-content...");
        try {
            const res = await fetch("/api/user/corporate-content");
            const data = await res.json();
            console.log("Corporate Page: Data Received:", data);
            setContent(data);
        } catch (err) {
            console.error("Corporate Page: Failed to load content", err);
        }
        };
        fetchContent();
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
        }
    };

    // Safe getters
    const getImg = (key) => (content && content[key] ? content[key] : LOADING_IMG);
    const getVideo = () => (content && content.heroVideo ? content.heroVideo : null);

    return (
        <div className="relative pt-32 pb-20 px-4 min-h-screen">
        {/* 1. HERO SECTION */}
        <div className="max-w-[90rem] mx-auto text-center mb-20">
            <h2
            className="text-4xl sm:text-3xl md:text-5xl font-bold text-blue-800 mb-8 leading-tight drop-shadow-2xl"
            style={{fontFamily: "'Limelight', sans-serif",fontweight: "400",fontstyle: "normal"}}
            >
            Corporate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0066] to-[#00a6ff]" style={{fontFamily: "'Limelight', sans-serif",fontweight: "400",fontstyle: "normal"}}>
                Art Workshop
            </span>
            </h2>
            
            <div className="max-w-4xl mx-auto mb-12">
                <div className="relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-3xl p-8 md:p-12 transition-transform duration-300 hover:scale-[1.01]">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-50 pointer-events-none" />
                    <p className="relative z-10 text-xl md:text-2xl text-black font-bold leading-relaxed">
                        Unlock creativity, boost team dynamics, and enhance employee well-being with
                        a Corporate Art Workshop by Chetna’s Creative Den.
                    </p>
                </div>
            </div>

                {/* --- VIDEO SECTION FIXED (No Cropping) --- */}
            <div className="w-full h-[40vh] md:h-[65vh] glass-card rounded-[2.5rem] overflow-hidden relative group border border-white/10 shadow-2xl bg-black">
                {getVideo() ? (
                    <>
                        <video
                            ref={videoRef}
                            src={getVideo()}
                            autoPlay
                            loop
                            muted={isMuted} 
                            playsInline
                            /* FIX: object-contain preserves ratio. bg-black handles empty space. */
                            className="w-full h-full object-contain bg-black"
                        />
                        
                        <button 
                            onClick={toggleMute}
                            className="absolute bottom-6 right-6 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 z-20"
                        >
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <p className="text-white/50 animate-pulse">Loading Video...</p>
                    </div>
                )}
            </div>
        </div>

        {/* 2. BENEFITS SECTION */}
        <div className="max-w-[90rem] mx-auto mb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                { icon: Users, title: "Team Bonding", desc: "Break down silos and build genuine connections outside the office." },
                { icon: Zap, title: "Boost Innovation", desc: "Stepping out of the routine sparks new neural pathways and ideas." },
                { icon: Coffee, title: "Stress Relief", desc: "Art is a proven therapeutic tool to lower cortisol and improve mood." },
                ].map((item, idx) => (
                <div key={idx} className="glass-card p-10 rounded-[2rem] text-center hover:-translate-y-2 transition-transform duration-300 border border-white/10">
                    <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6 text-[#D984B5]">
                    <item.icon size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-4">{item.title}</h3>
                    <p className="text-black text-lg">{item.desc}</p>
                </div>
                ))}
            </div>
        </div>

        {/* 3. WORKSHOP FORMATS */}
        <div className="max-w-[90rem] mx-auto mb-32">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">Our Workshop Formats</h2>
            <div className="space-y-12">
                {/* Format 1: Paint & Sip */}
                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row gap-12 items-center border border-white/10">
                <div className="w-full md:w-1/2 h-80 rounded-3xl overflow-hidden border border-white/5">
                    <img src={getImg('paintingPartyImage')} alt="Painting Party" className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 text-left">
                    <h3 className="text-3xl font-bold text-[#D984B5] mb-6">The "Paint & Sip" Experience</h3>
                    {/* Short list: Can stay centered vertically */}
                    <ul className="space-y-4 mb-8">
                    {[
                        "Team Building Through Art", 
                        "Stress Relief & Mindfulness", 
                        "Innovation & Creativity Boost",
                        "Tailored Workshops to Meet Your Goals",
                        "Flexible Formats & Group Sizes",
                        "Interactive & Engaging"
                    ].map((feat) => (
                        <li key={feat} className="flex items-center gap-4 text-black font-medium text-xl">
                            {/* Increased Size to 32 */}
                            <CheckCircle size={32} className="text-[#006398] flex-shrink-0" /> 
                            {feat}
                        </li>
                    ))}
                    </ul>
                </div>
                </div>

                {/* Format 2: Offering Includes */}
                <div className="glass-card p-8 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row-reverse gap-12 items-center border border-white/10">
                <div className="w-full md:w-1/2 h-80 rounded-3xl overflow-hidden border border-white/5">
                    <img src={getImg('muralImage')} alt="Mural" className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 text-left">
                    <h3 className="text-3xl font-bold text-[#D984B5] mb-6">Our Offering Includes:</h3>
                    
                    {/* Long Paragraphs: Changed to items-start for better alignment */}
                    <ul className="space-y-6 mb-auto">
                    {[
                        "Strengthen communication, cooperation, and creativity through collaborative art projects. Our workshops foster teamwork and boost morale.",
                        "In today’s fast-paced work environment, stress relief is essential. Our Sip & Paint and Mindful Art sessions provide a relaxing break from the daily grind.", 
                        "Art stimulates the creative process and encourages fresh perspectives. Employees will learn to approach challenges with a new mindset, helping them think outside the box and contribute innovative ideas to the workplace.",
                        "Whether you want to focus on leadership development, conflict resolution, or creative brainstorming, we customize our workshops to align with your company’s specific needs and objectives.",
                        "Our workshops can be conducted in a variety of formats—half-day, full-day, or customized sessions—to fit your team’s schedule. We also accommodate any group size, from small teams to large corporate gatherings.",
                        "Led by experienced artists and instructors, our sessions are hands-on and interactive. Employees will not only create artwork but also learn valuable skills in collaboration, creative expression, and mindfulness."
                    ].map((feat) => (
                        <li key={feat} className="flex items-start gap-4 text-black font-medium text-lg md:text-xl leading-relaxed">
                            {/* Increased Size to 32 and added mt-1 for top alignment */}
                            <CheckCircle size={32} className="text-[#006ca5] flex-shrink-0 mt-1" /> 
                            <span>{feat}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
        </div>

        {/* 4. CTA */}
        <div className="max-w-5xl mx-auto text-center glass-card p-12 md:p-20 rounded-[3rem] border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Ready to Inspire Your Team?</h2>
            <button
                onClick={() => navigateTo("contact")}
                className="px-12 py-5 bg-[#D984B5] hover:bg-[#AEE2FF] hover:text-[#3D2C4D] text-black rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 mx-auto"
            >
                Request a Proposal <ArrowRight size={24} />
            </button>
        </div>
        </div>
    );
    };

    export default Corporate;