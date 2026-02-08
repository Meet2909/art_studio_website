import React, { useState, useEffect } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";

const Courses = ({ addToCart }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/user/courses`);
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
    // FIX 1: ROOT CONTAINER SAFETY
    <div className="pt-32 pb-20 px-4 min-h-screen w-full overflow-x-hidden">
      
      {/* FIX 2: CONSTRAINED WIDTH WRAPPER */}
      <div className="max-w-[95%] mx-auto w-full">
        
        {/* FIX 3: THE TITLE CONTAINER (ARMORED) 
            - 'w-full max-w-full': Forces it to respect parent width.
            - 'overflow-hidden': Cuts off anything that tries to overflow.
            - 'px-2': Adds a tiny breathing room so text doesn't touch edges.
        */}
        <div className="text-center mb-12 w-full max-w-full overflow-hidden px-2">
          
          {/* TITLE ITSELF (Clean Standard Font) */}
          <h2 className="font-bold text-blue-800 mb-6 drop-shadow-sm text-4xl md:text-5xl tracking-tight break-words leading-tight" style={{fontFamily: "'Limelight', sans-serif",fontweight: "400",fontstyle: "normal"}}>
            Our Workshops
          </h2>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {["All", "Kids", "Adults", "Fine Arts", "Sculpting"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 md:px-8 md:py-3 text-sm md:text-xl rounded-full border transition-all duration-300 font-bold ${
                  filter === f
                    ? "bg-[#D984B5] border-[#D984B5] text-white font-bold shadow-lg transform scale-105"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group relative h-[550px] w-full overflow-hidden rounded-2xl bg-black shadow-xl"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
                  onError={(e) => {e.target.src = "https://via.placeholder.com/400x600?text=No+Image"}}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 z-20">
                  {course.category}
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                  <div className="flex flex-col gap-2 mb-3">
                    <h3 className="text-2xl font-bold leading-tight w-full text-balance">
                      {course.title}
                    </h3>
                    <span className="text-xl font-bold text-[#D984B5]">
                      ₹{course.price} per month
                    </span>
                  </div>

                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <ul className="text-white text-sm mb-6 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100 space-y-1 max-h-[200px] overflow-y-auto pr-2">
                        {course.description && course.description.map((line, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#D984B5] mt-1">•</span>
                            {line}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => addToCart(course)}
                        className="w-full py-3 bg-[#D984B5] hover:bg-[#c46fa2] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
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
