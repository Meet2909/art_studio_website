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
        <nav className="fixed w-full z-50 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
            
            {/* LOGO */}
            <div
                className="flex-shrink-0 cursor-pointer flex items-center gap-3 group"
                onClick={() => navigateTo("home")}
            >
                <div className="flex flex-col -space-y-1">
                <span className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff86cd] to-[#36b8ff]">
                    Chetna's
                </span>
                <span className="text-black/40 text-xl font-bold tracking-widest uppercase">
                    Creative Den
                </span>
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
                        : "text-black"
                    }`}
                    >
                    {item}
                    </button>
                ))}
                </div>
            </div>

            {/* RIGHT SIDE ICONS */}
            <div className="flex items-center gap-4">
                
                {/* AUTH SECTION (Desktop) - UPDATED */}
                <div className="hidden md:block">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {/* 1. Bigger Greeting Text */}
                            <span className="text-black text-lg font-bold">
                                Hi, {user.name.split(' ')[0]}
                            </span>
                            
                            {/* 2. Bigger Logout Button */}
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
                    className="relative p-2 text-black hover:text-[#D984B5] transition-colors mr-4 md:mr-0"
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
                    className="p-2 rounded-md text-black hover:text-[#D984B5] hover:bg-white/10"
                    >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                    </button>
                </div>
            </div>
            </div>
        </div>

        {/* MOBILE DROPDOWN */}
        {isMenuOpen && (
            <div className="md:hidden glass-card border-t border-white">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
                    onClick={() => navigateTo(item.toLowerCase())}
                    className="text-black hover:text-[#D984B5] block w-full text-left px-3 py-3 rounded-md text-base font-medium"
                    >
                    {item} {item === "Cart" && `(${cartCount})`}
                    </button>
                ))}

                {/* Auth Link for Mobile */}
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-600 block w-full text-left px-3 py-3 rounded-md text-lg font-bold border-t border-white/10 mt-2"
                    >
                        Logout ({user.name})
                    </button>
                ) : (
                    <button
                        onClick={() => navigateTo('login')}
                        className="text-[#D984B5] block w-full text-left px-3 py-3 rounded-md text-base font-bold border-t border-white/10 mt-2"
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