import React from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import GlassSurface from "./GlassSurface"; 

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
      
      {/* GLASS SURFACE BACKGROUND */}
      <div className="absolute inset-0 w-full h-24 z-0"> {/* Slightly taller background to accommodate bigger buttons */}
        <GlassSurface
          width="100%"
          height={96} // Matched to h-24 (96px)
          borderRadius={0} 
          borderWidth={0}
          blur={15}
          opacity={0.8}
          backgroundOpacity={0.2}
          className="w-full h-full border-b border-white/20 shadow-sm"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24"> {/* Changed to h-24 */}

          {/* LOGO */}
          <div
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => navigateTo("home")}
          >
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
              <span className="text-sm font-bold tracking-widest uppercase">
                Creative Den
              </span>
            </div>
          </div>

          {/* --- UPDATED DESKTOP MENU --- */}
          <div className="hidden md:flex flex-grow justify-center">
            <div className="flex items-center space-x-2 lg:space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  // Added heavier font, larger text, padding, drop-shadows, and a background hover pill effect
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

          {/* --- UPDATED RIGHT SIDE (Auth & Cart) --- */}
          <div className="flex items-center gap-3 md:gap-6">

            {/* AUTH DESKTOP */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-900 text-lg font-extrabold drop-shadow-sm">
                    Hi, {user.name.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    // Bigger, bolder logout button with hover lift
                    className="text-base font-extrabold border-2 border-red-500 text-red-600 bg-white/30 backdrop-blur-sm px-6 py-2.5 rounded-full hover:bg-red-500 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateTo("login")}
                  // Bigger, bolder login button with hover lift and pink fill
                  className="px-8 py-2.5 rounded-full border-2 border-black text-black text-base font-extrabold hover:bg-[#D984B5] hover:border-[#D984B5] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 drop-shadow-sm bg-white/20 backdrop-blur-sm"
                >
                  Login
                </button>
              )}
            </div>

            {/* CART ICON */}
            <button
              onClick={() => navigateTo("cart")}
              // Added a distinct circular background to make the icon pop off the glass
              className="relative p-3 bg-white/40 border border-white/50 rounded-full text-[#D984B5] hover:text-[#ff6b8b] hover:bg-white/70 hover:scale-110 hover:shadow-lg transition-all duration-300 shadow-sm"
            >
              <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 drop-shadow-sm" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1.5 text-xs font-extrabold text-white bg-[#D984B5] border-2 border-white rounded-full animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* MOBILE TOGGLE BUTTON */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl bg-white/40 border border-white/50 text-[#D984B5] hover:text-[#ff6b8b] hover:bg-white/80 z-50 shadow-sm transition-all duration-300 active:scale-90"
              >
                {isMenuOpen ? <X className="h-7 w-7 drop-shadow-sm" /> : <Menu className="h-7 w-7 drop-shadow-sm" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE BACKDROP & MENU (Unchanged logic, just minor aesthetic tweaks) */}
      <div
        className={`md:hidden fixed inset-0 z-[95] transition-all duration-300 ${
          isMenuOpen
            ? "bg-black/20 backdrop-blur-sm opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`md:hidden fixed left-0 top-24 w-full z-[96] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          isMenuOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
        }`}
      >
        <div className="mx-4 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] border border-white/60 bg-white/90 backdrop-blur-3xl overflow-hidden">
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item, i) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-lg font-bold text-gray-900 transition-all duration-300
                ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }
                hover:bg-[#f3d9e5] hover:text-[#c04b7a] active:scale-95`}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200/60 px-4 py-4">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-center text-red-500 font-extrabold px-4 py-3.5 rounded-2xl hover:bg-red-50 active:scale-95 transition-all border border-red-100"
              >
                Logout ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  navigateTo("login");
                  setIsMenuOpen(false);
                }}
                className="w-full text-center text-white bg-[#D984B5] font-extrabold px-4 py-3.5 rounded-2xl hover:bg-[#c04b7a] shadow-md active:scale-95 transition-all"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
