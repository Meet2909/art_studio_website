  import React, { useState, useEffect } from 'react';
  import { User } from 'lucide-react';
  import { Toaster, toast } from 'react-hot-toast';

  // Components
  import Navbar from './components/Navbar';
  import Background from './components/Background';
  import DotGrid from './components/DotGrid';

  // Pages
  import Home from './pages/Home';
  import Courses from './pages/Courses';
  import Gallery from './pages/Gallery';
  import About from './pages/About';
  import Contact from './pages/Contact';
  import Cart from './pages/Cart';
  import Corporate from './pages/Corporate';
  import AdminDashboard from './pages/AdminDashboard';
  import Login from './pages/Login';

  export default function App() {
    // 1. FIX: Initialize Page from LocalStorage (or default to 'home')
    const [currentPage, setCurrentPage] = useState(() => {
        return localStorage.getItem('lastPage') || 'home';
    });

    const [cart, setCart] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [bgType] = useState('dots'); 

    // Initialize user from LocalStorage
    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('userInfo');
      return savedUser ? JSON.parse(savedUser) : null;
    });

    // --- 2. NEW: Reusable Function to Fetch Cart ---
    const fetchUserCart = async (userId) => {
        try {
            const res = await fetch(`/api/user/${userId}/cart`);
            if (res.ok) {
                const dbCart = await res.json();
                setCart(dbCart); 
            }
        } catch (err) {
            console.error("Error loading cart:", err);
        }
    };

    // --- 3. FIX: Fetch Cart on Page Load (Refresh Fix) ---
    useEffect(() => {
        // If user is already logged in (from localStorage), fetch their cart immediately
        if (user && user._id) {
            fetchUserCart(user._id);
        }
    }, []); // Empty dependency array = runs once on mount (refresh)

    const handleLoginSuccess = (userData) => {
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      navigateTo('home'); 
      
      // Fetch cart immediately after login
      fetchUserCart(userData._id);
    };

    const handleLogout = () => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('lastPage'); // Clear saved page on logout
      setUser(null);
      setCart([]); 
      navigateTo('home');
      toast.success("Logged out successfully");
    };

    const syncCartToDB = async (newCart, userId) => {
      if (!userId) return;
      try {
          await fetch(`/api/user/${userId}/cart`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cart: newCart })
          });
      } catch (error) {
          console.error("Network error syncing cart:", error);
      }
    };

    const addToCart = (course) => {
        if (!user) {
            toast.error("Please login to enroll", {
                icon: '🔒',
                style: { borderRadius: '10px', background: '#333', color: '#fff' },
            });
            navigateTo('login');
            return; 
        }

        const cartItem = {
            id: course._id || course.id,      
            title: Array.isArray(course.title) ? course.title.join(" ") : course.title,
            price: course.price,
            image: course.image || course.imageUrl, 
            category: course.category || "General",
        };

        const newCart = [...cart, cartItem];
        setCart(newCart);
        syncCartToDB(newCart, user._id);
        toast.success("Added to Cart!");
    };

    const removeFromCart = (courseId) => {
      const index = cart.findIndex(item => (item.id || item._id) === courseId);
      if (index !== -1) {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        if (user) syncCartToDB(newCart, user._id);
      }
    };

    // 4. FIX: Clear Cart logic passed to Cart Page
    const clearCart = () => {
        setCart([]);
        if (user) syncCartToDB([], user._id);
    };

    // 5. FIX: Save Page to LocalStorage on Navigation
    const navigateTo = (page) => {
      localStorage.setItem('lastPage', page); // Remember this page
      setCurrentPage(page);
      setIsMenuOpen(false);
      window.scrollTo(0, 0);
    };

    return (
      <div className="w-full overflow-x-hidden relative">
        <div className="min-h-screen text-slate-100 selection:bg-[#7B7481] selection:text-white" style={{ fontFamily: "'Quicksand', sans-serif"}}>
          <Toaster position="top-center" toastOptions={{ 
            style: { background: 'rgba(255, 255, 255, 0.1)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }
          }} />
          
          {bgType === 'dots' ? <Background /> : (
            <div className="fixed inset-0 z-0 bg-[#0f0c14]">
              <DotGrid dotSize={4} gap={30} baseColor="#d8b4e2" activeColor="#fbfbfb" proximity={200} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0c14] pointer-events-none" />
            </div>
          )}
  
          <Navbar 
            cartCount={cart.length} 
            currentPage={currentPage} 
            navigateTo={navigateTo} 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            clearCart={clearCart}
            user={user}                 
            handleLogout={handleLogout} 
          />
          
          <main className="relative z-10 transition-all duration-500 ease-in-out">
            {currentPage === 'home' && <Home navigateTo={navigateTo} />}
            {currentPage === 'courses' && <Courses addToCart={addToCart} />}
            {currentPage === 'gallery' && <Gallery />}
            {currentPage === 'about' && <About />}
            {currentPage === 'contact' && <Contact />}
            {currentPage === 'corporate' && <Corporate navigateTo={navigateTo} />} 
            {currentPage === 'admin' && <AdminDashboard />}
            {currentPage === 'cart' && (
              <Cart 
                cart={cart} 
                navigateTo={navigateTo} 
                removeFromCart={removeFromCart} 
                addToCart={addToCart}
                clearCart={clearCart}
                user={user} 
              />
            )}
            {currentPage === 'login' && (
                <Login navigateTo={navigateTo} onLoginSuccess={handleLoginSuccess} />
            )} 
          </main>
  
          <footer className="relative z-10 glass-card border-t border-white/10 py-12 px-4 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-black">Chetna's Creative Den</h3>
                    <p className="text-black text-sm mt-2">© 2024 All Rights Reserved.</p>
                </div>
                <div className="flex gap-6 text-gray-400 font-medium">
                    <button onClick={() => navigateTo('admin')} className="text-black hover:text-grey transition-colors flex items-center gap-1">
                      <User size={14}/> Admin Login
                    </button>
                </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
