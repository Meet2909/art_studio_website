    import React, { useState, useEffect } from "react";
    import { ArrowRight, RefreshCw } from "lucide-react";

    const Courses = ({ addToCart }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchCourses = async () => {
        try {
            const res = await fetch("/api/user/courses");
            const data = await res.json();
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchCourses();
    }, []);

    // Filter Logic
    const filteredCourses =
        filter === "All"
        ? courses
        : courses.filter((c) => c.category === filter || c.type === filter);

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
        <div className="max-w-[95%] mx-auto">
            <div className="text-center mb-12">
            <h2 className="text-7xl font-bold text-[#000000] mb-4" style={{ fontFamily: "'Rubik Doodle Shadow', system-ui" }}>
                Our Workshops
            </h2>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
                {["All", "Kids", "Adults", "Fine Arts", "Sculpting"].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-8 py-3 text-xl rounded-full border transition-all duration-300 font-bold ${
                    filter === f
                        ? "bg-[#D984B5] border-[#D984B5] text-white font-bold shadow-[0_0_15px_rgba(217,132,181,0.4)]"
                        : "border-[#A9B5D9] text-[#000000] hover:border-[#D984B5] hover:text-[#D984B5] backdrop-blur-sm"
                    }`}
                >
                    {f}
                </button>
                ))}
            </div>
            </div>

            {/* Loading State */}
            {loading ? (
            <div className="flex justify-center items-center h-64">
                <RefreshCw className="animate-spin text-[#D984B5] w-12 h-12" />
            </div>
            ) : (
            /* --- GRID LAYOUT --- */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                <div
                    key={course._id}
                    className="group relative h-[550px] w-full overflow-hidden rounded-2xl bg-black shadow-xl"
                >
                    {/* BACKGROUND IMAGE */}
                    <img
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
                    onError={(e) => {e.target.src = "https://via.placeholder.com/400x600?text=No+Image"}} // Fallback
                    />

                    {/* GRADIENT OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90 group-hover:from-black/90 group-hover:via-black/50" />

                    {/* FLOATING BADGE */}
                    <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 z-20">
                    {course.category}
                    </span>

                    {/* ANIMATED CONTENT */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    
                    {/* Title & Price */}
                    <div className="flex flex-col gap-2 mb-3">
                        <h3 className="text-2xl font-bold leading-tight w-full text-balance">
                        {course.title}
                        </h3>
                        <span className="text-xl font-bold text-[#D984B5]">
                        ₹{course.price} per month
                        </span>
                    </div>

                    {/* Hidden Description Reveal */}
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
                        <div className="overflow-hidden">
                        <ul className="text-white text-sm mb-6 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100 space-y-1 
                            max-h-[200px] overflow-y-auto pr-2 pretty-scroll">
                            {course.description && course.description.map((line, index) => (
                                <li key={index} className="flex items-start gap-2">
                                <span className="text-[#D984B5] mt-1">•</span>
                                {line}
                                </li>
                            ))}
                        </ul>
                        
                        <button
                            onClick={() => addToCart(course)}
                            className="w-full py-3 bg-[#D984B5] hover:bg-[#c46fa2] text-white rounded-xl font-bold text-sm transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500 delay-200 flex items-center justify-center gap-2"
                        >
                            Enroll Now <ArrowRight size={16} />
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
    };

    export default Courses;