    import React from "react";
    import DotGrid from "./DotGrid";

    const Background = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-[#ffffff]">
        {/* Configured for Dark Theme:
            - bg-[#0f0f0f]: Very dark grey background (almost black)
            - baseColor="#333": Subtle grey dots
            - activeColor="#D984B5": Your theme's Magenta pop on hover
        */}
        <DotGrid
            dotSize={6}
            gap={35}
            baseColor="#e2b2ef"
            activeColor="#cb9cf2"
            proximity={185}
        />
        </div>
    );
    };

    export default Background;
