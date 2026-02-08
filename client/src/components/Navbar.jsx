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

    // Lock body scroll when menu is open
    React.useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }, [isMenuOpen]);

    // Helper to handle navigation slug (converts "Art Store" -> "art-store")
    const handleNavClick = (item) => {
        const route = item === "Art Store" ? "art-store" : item.toLowerCase();
        navigateTo(route);
        setIsMenuOpen(false); // Close mobile menu if open
    };

    const menuItems = ["Home", "Courses", "Art Store", "Corporate", "Gallery", "About", "Contact"];

    return (
        <nav className="fixed w-full z-[100] top-0 left-0 glass-card border-b border-white/20 bg-white/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">

            {/* LOGO */}
            <div
                className="flex-shrink-0 cursor-pointer group"
                onClick={() => navigateTo("home")}
            >
                <img
                src="/logo.jpeg"
                alt="Chetna's Creative Den"
                className="h-16 w-auto object-contain hover:scale-105 transition-transform"
                onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                }}
                />
                {/* Fallback Text Logo */}
                <div className="hidden flex-col -space-y-1">
                <span className="font-bold text-2xl text-black">Chetna's</span>
                <span className="text-sm font-bold tracking-widest uppercase">
                    Creative Den
                </span>
                </div>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex flex-grow justify-center">
                <div className="flex items-center space-x-6 lg:space-x-8">
                {menuItems.map((item) => (
                    <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className={`px-3 py-2 rounded-md text-lg font-bold transition-all duration-300 hover:text-[#D984B5] ${
                        currentPage === (item === "Art Store" ? "art-store" : item.toLowerCase())
                        ? "text-[#ff6b8b] scale-105"
                        : "text-gray-800"
                    }`}
                    >
                    {item}
                    </button>
                ))}
                </div>
            </div>

            {/* RIGHT SIDE (Auth & Cart) */}
            <div className="flex items-center gap-2 md:gap-4">

                {/* AUTH DESKTOP */}
                <div className="hidden md:block">
                {user ? (
                    <div className="flex items-center gap-4">
                    <span className="text-black text-lg font-bold">
                        Hi, {user.name.split(" ")[0]}
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
                    onClick={() => navigateTo("login")}
                    className="px-6 py-2 rounded-full border-2 border-black text-black text-sm font-bold hover:bg-[#d984b67a] hover:text-[#3D2C4D] transition-all"
                    >
                    Login
                    </button>
                )}
                </div>

                {/* CART ICON */}
                <button
                onClick={() => navigateTo("cart")}
                className="relative p-2 text-[#D984B5] hover:text-[#D984B5] transition-colors"
                >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4 bg-[#D984B5] rounded-full animate-bounce">
                    {cartCount}
                    </span>
                )}
                </button>

                {/* MOBILE TOGGLE BUTTON */}
                <div className="flex md:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md text-[#D984B5] hover:text-[#D984B5] hover:bg-white/80 z-50 transition-transform duration-300 active:scale-90"
                >
                    {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
                </div>

            </div>
            </div>
        </div>

        {/* MOBILE BACKDROP */}
        <div
            className={`md:hidden fixed inset-0 z-[95] transition-all duration-300 ${
            isMenuOpen
                ? "bg-white/60 backdrop-blur-sm opacity-60"
                : "pointer-events-none opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
        />

        {/* MOBILE MENU PANEL */}
        <div
            className={`md:hidden fixed left-0 top-20 w-full z-[96] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
            isMenuOpen
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
            }`}
        >
            <div className="mx-3 rounded-3xl shadow-[0_10px_30px_-12px_rgba(255, 255, 255, 0.12)] border border-white/60 bg-white/85 backdrop-blur-3xl overflow-hidden">

            <div className="px-4 py-4 space-y-2">
                {menuItems.map((item, i) => (
                    <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-lg font-semibold text-gray-900 transition-all duration-300
                    ${
                        isMenuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    }
                    hover:bg-[#f3d9e5] hover:text-[#c04b7a]`}
                    style={{ transitionDelay: `${i * 40}ms` }}
                    >
                    {item}
                    </button>
                )
                )}
            </div>

            <div className="border-t border-gray-100 px-4 py-3">
                {user ? (
                <button
                    onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-red-500 font-bold px-4 py-3 rounded-xl hover:bg-red-50 transition"
                >
                    Logout ({user.name})
                </button>
                ) : (
                <button
                    onClick={() => {
                    navigateTo("login");
                    setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-[#D984B5] font-bold px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
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