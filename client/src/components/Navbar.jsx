    import React from 'react';
    import { Menu, X, ShoppingCart } from 'lucide-react';

    const Navbar = ({
    cartCount,
    currentPage,
    navigateTo,
    isMenuOpen,
    setIsMenuOpen,
    user,          
    handleLogout, 
    }) => {

    return (
        <nav className="fixed w-full z-[100] top-0 left-0 glass-card border-b border-white/20 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
            
            {/* --- LOGO UPDATE: IMAGE INSTEAD OF TEXT --- */}
            <div
                className="flex-shrink-0 cursor-pointer group"
                onClick={() => navigateTo("home")}
            >
                <img 
                src="/logo.jpeg" 
                alt="Chetna's Creative Den" 
                className="h-16 w-auto object-contain hover:scale-105 transition-transform"
                onError={(e) => {
                    // Fallback: If image fails, show text
                    e.target.style.display='none';
                    e.target.nextSibling.style.display='flex';
                }}
                />
                {/* Fallback Text (Hidden by default) */}
                <div className="hidden flex-col -space-y-1">
                    <span className="font-bold text-2xl text-black">Chetna's</span>
                    <span className="text-sm font-bold tracking-widest uppercase">Creative Den</span>
                </div>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex flex-grow justify-center">
                <div className="flex items-center space-x-8 ">
                {[
                    "Home",
                    "Courses",
                    "Corporate",
                    "Gallery",
                    "About",
                    "Contact",
                ].map((item) => (
                    <button
                    key={item}
                    onClick={() => navigateTo(item.toLowerCase())}
                    className={`px-3 py-2 rounded-md text-lg font-bold transition-all duration-300 hover:text-[#D984B5] ${
                        currentPage === item.toLowerCase()
                        ? "text-[#ff6b8b] scale-105"
                        : "text-gray-800"
                    }`}
                    >
                    {item}
                    </button>
                ))}
                </div>
            </div>

            {/* RIGHT SIDE ICONS */}
            <div className="flex items-center gap-2 md:gap-4">
                
                {/* AUTH SECTION */}
                <div className="hidden md:block">
                {user ? (
                    <div className="flex items-center gap-4">
                    <span className="text-black text-lg font-bold">
                        Hi, {user.name.split(' ')[0]}
                    </span>
                    <button 
                        onClick={handleLogout} 
                        className="text-sm font-bold border-2 border-red-500 text-red-500 px-6 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                        Logout
                    </button>
                    </div>
                ) : (
                    <button 
                    onClick={() => navigateTo('login')}
                    className="px-6 py-2 rounded-full border-2 border-black text-black text-sm font-bold hover:bg-[#d984b67a] hover:text-[#3D2C4D] transition-all"
                    >
                    Login
                    </button>
                )}
                </div>

                {/* CART ICON */}
                <button
                onClick={() => navigateTo("cart")}
                className="relative p-2 text-black hover:text-[#D984B5] transition-colors"
                >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#D984B5] rounded-full animate-bounce">
                    {cartCount}
                    </span>
                )}
                </button>

                {/* MOBILE MENU TOGGLE */}
                <div className="flex md:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md text-black hover:text-[#D984B5] hover:bg-black/5 z-50"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                    <X className="h-7 w-7" />
                    ) : (
                    <Menu className="h-7 w-7" />
                    )}
                </button>
                </div>
            </div>
            </div>
        </div>

        {isMenuOpen && (
            <div className="md:hidden absolute w-full left-0 top-20 shadow-2xl border-t border-white/20 bg-white/90 backdrop-blur-xl z-[90]">
            <div className="px-4 pt-2 pb-6 space-y-2">
                {[
                "Home",
                "Courses",
                "Corporate",
                "Gallery",
                "About",
                "Contact",
                "Cart",
                ].map((item) => (
                <button
                    key={item}
                    onClick={() => {
                    navigateTo(item.toLowerCase());
                    setIsMenuOpen(false); 
                    }}
                    className="text-black hover:text-[#D984B5] block w-full text-left px-3 py-3 rounded-lg text-lg font-medium hover:bg-white/50 transition-colors"
                >
                    {item} {item === "Cart" && `(${cartCount})`}
                </button>
                ))}

                {user ? (
                <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="text-red-500 hover:text-red-600 block w-full text-left px-3 py-3 rounded-lg text-lg font-bold border-t border-gray-100 mt-4"
                >
                    Logout ({user.name})
                </button>
                ) : (
                <button
                    onClick={() => { navigateTo('login'); setIsMenuOpen(false); }}
                    className="text-[#D984B5] block w-full text-left px-3 py-3 rounded-lg text-lg font-bold border-t border-gray-100 mt-4 bg-gray-50"
                >
                    Login / Sign Up
                </button>
                )}
            </div>
            </div>
        )}
        </nav>
    );
    };

    export default Navbar;