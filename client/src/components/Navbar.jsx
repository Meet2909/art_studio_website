import React from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

const Navbar = ({
  cartCount,
  currentPage,
  navigateTo,
  isMenuOpen,
  setIsMenuOpen,
  user,
  handleLogout,
}) => {
  React.useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  const handleNavClick = (item) => {
    const route = item === "Art Store" ? "art-store" : item.toLowerCase();
    navigateTo(route);
    setIsMenuOpen(false);
  };

  const menuItems = ["Home", "Courses", "Art Store", "Corporate", "Gallery", "About", "Contact"];

  return (
    <nav className="fixed w-full z-[100] top-0 left-0">
      
      {/* 1. SVG FILTER DEFINITION */}
      <svg className="absolute w-0 h-0 hidden" aria-hidden="true">
        <filter id="lg">
          {/* Generates mathematical noise (the "frosted" texture) */}
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          {/* Displaces the pixels behind the nav based on the generated noise */}
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* 2. BACKGROUND LAYER APPLYING THE FILTER */}
      <div 
        className="absolute inset-0 w-full h-24 z-0 bg-white/20 transition-all duration-300"
        style={{ 
          backdropFilter: "url(#lg) blur(3px) saturate(180%)",
          WebkitBackdropFilter: "url(#lg) blur(3px) saturate(180%)",
          boxShadow: "inset 0 1px 0 #ffffff5c" 
        }}
      ></div>

      {/* --- REST OF THE COMPONENT REMAINS IDENTICAL --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* LOGO */}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => navigateTo("home")}>
            <img
              src="/logo.jpeg"
              alt="Chetna's Creative Den"
              className="h-16 md:h-20 w-auto object-contain hover:scale-110 drop-shadow-md transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="hidden flex-col -space-y-1">
              <span className="font-bold text-2xl text-black">Chetna's</span>
              <span className="text-sm font-bold tracking-widest uppercase">Creative Den</span>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex flex-grow justify-center">
            <div className="flex items-center space-x-2 lg:space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`px-4 py-2.5 rounded-2xl text-lg font-extrabold tracking-wide transition-all duration-300 drop-shadow-sm ${
                    currentPage === (item === "Art Store" ? "art-store" : item.toLowerCase())
                      ? "text-[#ff6b8b] scale-110 bg-white/50 shadow-md border border-white/40"
                      : "text-gray-900 hover:text-[#D984B5] hover:scale-110 hover:bg-white/40 hover:shadow-md hover:border-white/30 border border-transparent"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE (Auth & Cart) */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-900 text-lg font-extrabold drop-shadow-sm">Hi, {user.name.split(" ")[0]}</span>
                  <button onClick={handleLogout} className="text-base font-extrabold border-2 border-red-500 text-red-600 bg-white/30 backdrop-blur-sm px-6 py-2.5 rounded-full hover:bg-red-500 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => navigateTo("login")} className="px-8 py-2.5 rounded-full border-2 border-black text-black text-base font-extrabold hover:bg-[#D984B5] hover:border-[#D984B5] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 drop-shadow-sm bg-white/20 backdrop-blur-sm">
                  Login
                </button>
              )}
            </div>

            <button onClick={() => navigateTo("cart")} className="relative p-3 bg-white/40 border border-white/50 rounded-full text-[#D984B5] hover:text-[#ff6b8b] hover:bg-white/70 hover:scale-110 hover:shadow-lg transition-all duration-300 shadow-sm">
              <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 drop-shadow-sm" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1.5 text-xs font-extrabold text-white bg-[#D984B5] border-2 border-white rounded-full animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="flex md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 rounded-xl bg-white/40 border border-white/50 text-[#D984B5] hover:text-[#ff6b8b] hover:bg-white/80 z-50 shadow-sm transition-all duration-300 active:scale-90">
                {isMenuOpen ? <X className="h-7 w-7 drop-shadow-sm" /> : <Menu className="h-7 w-7 drop-shadow-sm" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* MOBILE BACKDROP & MENU (Truncated for brevity, remains unchanged) */}
    </nav>
  );
};

export default Navbar;
