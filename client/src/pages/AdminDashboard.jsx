    import React, { useState } from "react";
    import {
    Users, ShoppingBag, DollarSign, RefreshCw, Lock, Trash2, Plus, 
    Image as ImageIcon, Edit, MessageSquare, Save, X, LogOut, Palette, Phone, MapPin
    } from "lucide-react";
    import toast from "react-hot-toast"; 

    const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview"); 
    const [loading, setLoading] = useState(false);
    
    // Auth State
    const [user, setUser] = useState(null); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Data States
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [artPieces, setArtPieces] = useState([]); // <--- NEW STATE

    // Form States
    const [newItem, setNewItem] = useState({ title: "", rounded: "rounded-[15px]", file: null });
    const [editingCourse, setEditingCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({ 
    title: "", price: "", category: "Adults", type: "Fine Arts", description: "", slots: 20, file: null });
    
    // New Art Form State
    const [newArt, setNewArt] = useState({ 
        title: "", price: "", category: "Painting", description: "", file: null 
    });

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const API_URL = isLocal ? "http://localhost:5000" : "";

    // ... (Keep handleLogin, authFetch, handleLogout exactly as they were) ...
    const handleLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Verifying credentials...");
        try {
        localStorage.removeItem("userInfo"); 
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok && data.role === "admin") {
            setUser(data);
            fetchData(data.token);
            toast.success("Welcome Admin", { id: toastId });
        } else {
            toast.error(data.message || "Access Denied", { id: toastId });
        }
        } catch (error) {
        toast.error("Login failed", { id: toastId });
        }
    };

    const authFetch = async (endpoint, options = {}, token = user?.token) => {
        const headers = { ...options.headers, Authorization: `Bearer ${token}` };
        const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        if (res.status === 401) { handleLogout(); throw new Error("Unauthorized"); }
        return res;
    };

    const handleLogout = () => { setUser(null); setOrders([]); setEnquiries([]); };

        const fetchData = async (token) => {
        if (!token) return;
        setLoading(true);
        try {
            // Use authFetch for ALL requests. 
            // This ensures the token is sent, and if a 401 occurs, it throws an error 
            // effectively skipping the 'setGalleryItems' line preventing the crash.
            const [statsRes, ordersRes, galleryRes, coursesRes, enquiryRes, artRes] = await Promise.all([
                authFetch("/api/admin/stats", {}, token),
                authFetch("/api/admin/orders", {}, token),
                authFetch("/api/admin/gallery", {}, token), // CHANGED from fetch to authFetch
                authFetch("/api/admin/courses", {}, token), // CHANGED from fetch to authFetch
                authFetch("/api/admin/enquiries", {}, token),
                authFetch("/api/admin/art", {}, token),     // CHANGED from fetch to authFetch
            ]);

            setStats(await statsRes.json());
            setOrders(await ordersRes.json());
            setGalleryItems(await galleryRes.json());
            setCourses(await coursesRes.json());
            setEnquiries(await enquiryRes.json());
            setArtPieces(await artRes.json());

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---

    // 1. Add Art Handler
    const handleAddArt = async (e) => {
        e.preventDefault();
        if (!newArt.file) return toast.error("Please select an image");

        const formData = new FormData();
        formData.append("title", newArt.title);
        formData.append("price", newArt.price);
        formData.append("category", newArt.category);
        formData.append("description", newArt.description);
        formData.append("imageFile", newArt.file);

        const toastId = toast.loading("Uploading Art...");

        try {
        const res = await fetch(`/api/admin/art`, {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` },
            body: formData,
        });

        if (res.ok) {
            toast.success("Art Added to Store!", { id: toastId });
            setNewArt({ title: "", price: "", category: "Painting", description: "", file: null });
            fetchData(user.token);
        } else {
            toast.error("Upload failed", { id: toastId });
        }
        } catch (err) {
        toast.error("Server Error", { id: toastId });
        }
    };

    // 2. Delete Art Handler
    const handleDeleteArt = async (id) => {
        if(!window.confirm("Remove this item from store?")) return;
        try {
        await authFetch(`/api/admin/art/${id}`, { method: "DELETE" });
        toast.success("Item Removed");
        fetchData(user.token);
        } catch (error) {
        toast.error("Delete failed");
        }
    };

    // ... (Keep existing handlers for Gallery, Courses, Images) ...
    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newItem.file) return toast.error("Please select a file");
        const formData = new FormData();
        formData.append("title", newItem.title);
        formData.append("rounded", newItem.rounded);
        formData.append("imageFile", newItem.file);
        try {
        const res = await fetch(`${API_URL}/api/admin/gallery`, {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` },
            body: formData,
        });
        if (res.ok) { toast.success("Image Uploaded!"); setNewItem({ title: "", rounded: "rounded-[15px]", file: null }); fetchData(user.token); }
        } catch (err) { toast.error("Server Error"); }
    };
    const handleDeleteGallery = async (id) => {
        if(!window.confirm("Delete this image?")) return;
        try { await authFetch(`/api/admin/gallery/${id}`, { method: "DELETE" }); toast.success("Image Deleted"); fetchData(user.token); } catch (error) {}
    };
    // Add New Course Handler
const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.file) return toast.error("Please select a course image");

    const formData = new FormData();
    formData.append("title", newCourse.title);
    formData.append("price", newCourse.price);
    formData.append("category", newCourse.category);
    formData.append("type", newCourse.type);
    formData.append("description", newCourse.description);
    formData.append("slots", newCourse.slots);
    formData.append("imageFile", newCourse.file);

    const toastId = toast.loading("Adding Course...");

    try {
        const res = await fetch(`/api/admin/courses`, {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` },
            body: formData,
        });

        if (res.ok) {
            toast.success("Course Added!", { id: toastId });
            setNewCourse({ title: "", price: "", category: "Adults", type: "Fine Arts", description: "", slots: 20, file: null });
            fetchData(user.token);
        } else {
            toast.error("Upload failed", { id: toastId });
        }
    } catch (err) {
        toast.error("Server Error", { id: toastId });
    }
};

// Updated Update Course Handler
    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Updating Course...");
        
        const formData = new FormData();
        formData.append("title", editingCourse.title);
        formData.append("price", editingCourse.price);
        formData.append("category", editingCourse.category);
        formData.append("type", editingCourse.type);
        formData.append("slots", editingCourse.slots);
        
        // Convert array back to string if needed for the backend parser
        const descString = Array.isArray(editingCourse.description) 
            ? editingCourse.description.join('\n') 
            : editingCourse.description;
        formData.append("description", descString);
    
        if (editingCourse.newFile) {
            formData.append("imageFile", editingCourse.newFile);
        }
    
        try {
            const res = await fetch(`/api/admin/courses/${editingCourse._id}`, { 
                method: "PUT", 
                headers: { Authorization: `Bearer ${user.token}` },
                body: formData 
            });
            
            if (res.ok) { 
                toast.success("Course Updated!", { id: toastId }); 
                setEditingCourse(null); 
                fetchData(user.token); 
            } else {
                toast.error("Update failed", { id: toastId });
            }
        } catch (err) { 
            toast.error("Server Error", { id: toastId }); 
        }
    };

        // Delete Course Handler
    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
        
        const toastId = toast.loading("Deleting Course...");
        try {
            const res = await authFetch(`/api/admin/courses/${id}`, { method: "DELETE" });
            
            if (res.ok) {
                toast.success("Course Deleted!", { id: toastId });
                fetchData(user.token); // Refresh the course list
            } else {
                toast.error("Failed to delete course", { id: toastId });
            }
        } catch (error) {
            toast.error("Server Error", { id: toastId });
        }
    };
    // --- RENDER ---
    if (!user) {
        // ... (Keep existing Login UI) ...
        return (
            <div className="pt-32 min-h-screen flex items-center justify-center px-4">
                <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center border border-white/10">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#D984B5]">
                    <Lock size={32} />
                </div>
                <h2 className="text-2xl font-bold text-black mb-6">Admin Portal</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Admin Email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-black focus:outline-none focus:border-[#D984B5]" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-black focus:outline-none focus:border-[#D984B5]" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className="w-full bg-[#D984B5] hover:bg-white hover:text-[#3D2C4D] text-black font-bold py-3 rounded-lg transition-colors">Login</button>
                </form>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
        <div className="max-w-[95%] mx-auto">

            {/* --- ADD THIS LOADING SPINNER --- */}
            {loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl flex flex-col items-center shadow-2xl animate-in zoom-in">
                    <div className="w-12 h-12 border-4 border-[#D984B5] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-black font-bold">Loading Data...</p>
                </div>
            </div>
            )}
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-4xl font-bold text-black">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
                <div className="flex bg-white/5 p-1 rounded-lg overflow-x-auto">
                {["overview", "store", "orders", "gallery", "courses", "enquiries"].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md capitalize font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab ? "bg-[#D984B5] text-black" : "text-black hover:text-[#84d2ff]"
                    }`}
                    >
                    {tab === 'store' ? 'Art Store' : tab}
                    </button>
                ))}
                </div>
                <button onClick={handleLogout} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"><LogOut size={20} /></button>
            </div>
            </div>

            {/* --- TAB: OVERVIEW --- */}
            {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="p-4 bg-green-500/20 rounded-full text-green-400"><DollarSign size={32} /></div>
                <div><p className="text-black text-sm">Revenue</p><h3 className="text-3xl font-bold text-black">₹{stats.totalRevenue?.toLocaleString()}</h3></div>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="p-4 bg-blue-500/20 rounded-full text-blue-400"><ShoppingBag size={32} /></div>
                <div><p className="text-black text-sm">Orders</p><h3 className="text-3xl font-bold text-black">{stats.totalOrders}</h3></div>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="p-4 bg-purple-500/20 rounded-full text-purple-400"><Palette size={32} /></div>
                <div><p className="text-black text-sm">Art Pieces</p><h3 className="text-3xl font-bold text-black">{artPieces.length}</h3></div>
                </div>
            </div>
            )}

            {/* --- TAB: ART STORE (NEW) --- */}
                {activeTab === "store" && (
                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-3xl border border-white/10">
                    <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                        <Palette className="text-[#D984B5]" /> Add New Item to Store
                    </h2>
                    <form onSubmit={handleAddArt} className="grid md:grid-cols-2 gap-4">
                        <input 
                        type="text" placeholder="Item Title" required
                        className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                        value={newArt.title} onChange={(e)=>setNewArt({...newArt, title: e.target.value})}
                        />
                        <input 
                        type="number" placeholder="Price (₹)" required
                        className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                        value={newArt.price} onChange={(e)=>setNewArt({...newArt, price: e.target.value})}
                        />
                        
                        {/* --- UPDATED CATEGORY DROPDOWN --- */}
                        <select 
                        className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                        value={newArt.category} onChange={(e)=>setNewArt({...newArt, category: e.target.value})}
                        >
                        <optgroup label="Artworks">
                            <option value="Painting">Painting</option>
                            <option value="Sketch">Sketch</option>
                            <option value="Sculpture">Sculpture</option>
                            <option value="Oil Painting">Oil Painting</option>
                            <option value="Portrait">Portrait</option>
                        </optgroup>
                        <optgroup label="Products">
                            <option value="Stationary">Stationary</option>
                            <option value="Craft">Craft</option>
                        </optgroup>
                        </select>

                        <input 
                        type="file" accept="image/*" required
                        className="bg-white/5 border border-white/10 rounded-lg p-3 text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D984B5] file:text-white"
                        onChange={(e)=>setNewArt({...newArt, file: e.target.files[0]})}
                        />
                        <textarea 
                        placeholder="Description"
                        className="md:col-span-2 bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                        value={newArt.description} onChange={(e)=>setNewArt({...newArt, description: e.target.value})}
                        />
                        <button className="md:col-span-2 bg-[#D984B5] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors">
                        Add to Store
                        </button>
                    </form>
                    </div>

                {/* List of Art Pieces */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {artPieces.map((art) => (
                    <div key={art._id} className="glass-card p-4 rounded-2xl border border-white/10 flex gap-4 relative group">
                    <img src={art.image} alt={art.title} className="w-24 h-24 object-cover rounded-xl" />
                    <div>
                        <h3 className="font-bold text-black text-lg">{art.title}</h3>
                        <p className="text-[#D984B5] font-bold">₹{art.price}</p>
                        <p className="text-gray-600 text-xs">{art.category}</p>
                    </div>
                    <button 
                        onClick={() => handleDeleteArt(art._id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-red-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={16} />
                    </button>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* --- TAB: ORDERS --- */}
                {activeTab === "orders" && (
                <div className="glass-card p-8 rounded-3xl border border-white/10 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="text-black border-b border-black/10">
                        <th className="p-4">Order Info</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Shipping Details</th>
                        <th className="p-4">Items</th>
                        <th className="p-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {orders.map((order) => (
                        <tr key={order._id} className="border-b border-black/5 hover:bg-black/5">
                            {/* Order ID & Date */}
                            <td className="p-4 align-top">
                            <span className="font-mono text-[#D984B5] font-bold text-sm">
                                #{order._id.slice(-6).toUpperCase()}
                            </span>
                            <div className="text-xs mt-1 text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            </td>

                            {/* Customer Email & Phone */}
                            <td className="p-4 align-top">
                            <div className="font-bold text-sm">{order.userEmail}</div>
                            {order.phone && (
                                <div className="text-xs text-gray-600 mt-2 flex items-center gap-1.5">
                                    <Phone size={14} className="text-[#D984B5]" /> {order.phone}
                                </div>
                            )}
                            </td>

                            {/* Shipping Address */}
                            <td className="p-4 align-top">
                            {order.address ? (
                                <div className="text-sm text-gray-700 flex items-start gap-1.5 max-w-[250px] break-words">
                                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#D984B5]" />
                                    <span className="leading-snug">
                                    {/* Handles both string addresses and Razorpay address objects */}
                                    {typeof order.address === 'object' 
                                        ? Object.values(order.address).filter(Boolean).join(", ") 
                                        : order.address}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400 italic">No Address Provided</span>
                            )}
                            </td>

                            {/* Order Items */}
                            <td className="p-4 align-top">
                            {order.items.map((i, idx) => (
                                <div key={idx} className="text-sm font-medium mb-1">
                                • {i.title}
                                </div>
                            ))}
                            </td>

                            {/* Total */}
                            <td className="p-4 text-right font-bold text-lg align-top">
                            ₹{order.totalAmount}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}

            {/* --- TAB: GALLERY --- */}
            {activeTab === "gallery" && (
            <div className="space-y-8">
                <div className="glass-card p-8 rounded-3xl border border-white/10">
                <h2 className="text-2xl font-bold text-black mb-6">Upload Showcase Image</h2>
                <form onSubmit={handleAddImage} className="grid md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Title" required className="bg-white/5 border border-white/10 rounded-lg p-3 text-black" value={newItem.title} onChange={(e)=>setNewItem({...newItem, title: e.target.value})} />
                    <input type="file" accept="image/*" required className="bg-white/5 border border-white/10 rounded-lg p-3 text-black" onChange={(e)=>setNewItem({...newItem, file: e.target.files[0]})} />
                    <button className="bg-[#D984B5] text-black font-bold py-3 rounded-lg">Upload</button>
                </form>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {galleryItems.map((item) => (
                    <div key={item._id} className="glass-card p-2 rounded-xl relative group">
                    <img src={item.imageUrl} className="w-full aspect-square object-cover rounded-lg" />
                    <button onClick={() => handleDeleteGallery(item._id)} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={16} color="white"/></button>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* --- TAB: COURSES --- */}
            {activeTab === "courses" && (
            <div className="space-y-8">
                
                {/* Add Course Form */}
                <div className="glass-card p-8 rounded-3xl border border-white/10">
                    <h2 className="text-2xl font-bold text-black mb-6">Add New Course</h2>
                    <form onSubmit={handleAddCourse} className="grid md:grid-cols-2 gap-4">
                        <input 
                            type="text" placeholder="Course Title" required
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                            value={newCourse.title} onChange={(e)=>setNewCourse({...newCourse, title: e.target.value})}
                        />
                        <input 
                            type="number" placeholder="Price (₹) per month" required
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                            value={newCourse.price} onChange={(e)=>setNewCourse({...newCourse, price: e.target.value})}
                        />
                        <select 
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                            value={newCourse.category} onChange={(e)=>setNewCourse({...newCourse, category: e.target.value})}
                        >
                            <option value="Adults">Adults</option>
                            <option value="Kids">Kids</option>
                        </select>
                        <select 
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                            value={newCourse.type} onChange={(e)=>setNewCourse({...newCourse, type: e.target.value})}
                        >
                            <option value="Fine Arts">Fine Arts</option>
                            <option value="Sculpting">Sculpting</option>
                        </select>
                        <input 
                            type="number" placeholder="Available Slots" required
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                            value={newCourse.slots} onChange={(e)=>setNewCourse({...newCourse, slots: e.target.value})}
                        />
                        <input 
                            type="file" accept="image/*" required
                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D984B5] file:text-white"
                            onChange={(e)=>setNewCourse({...newCourse, file: e.target.files[0]})}
                        />
                        <textarea 
                            placeholder="Description (Press Enter for new bullet points)" required rows="4"
                            className="md:col-span-2 bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                            value={newCourse.description} onChange={(e)=>setNewCourse({...newCourse, description: e.target.value})}
                        />
                        <button className="md:col-span-2 bg-[#D984B5] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors">
                            Add Course
                        </button>
                    </form>
                </div>
            
                {/* Edit Modal */}
                {editingCourse && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a2e] p-8 rounded-2xl w-full max-w-2xl border border-white/20 relative overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setEditingCourse(null)} className="absolute top-4 right-4 text-white"><X /></button>
                        <h2 className="text-2xl font-bold text-white mb-6">Edit Course</h2>
                        <form onSubmit={handleUpdateCourse} className="space-y-4">
                            <input placeholder="Title" className="bg-white/5 p-3 rounded text-white border border-white/20 w-full" value={editingCourse.title} onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Price" className="bg-white/5 p-3 rounded text-white border border-white/20 w-full" value={editingCourse.price} onChange={(e) => setEditingCourse({...editingCourse, price: e.target.value})} />
                                <input type="number" placeholder="Slots" className="bg-white/5 p-3 rounded text-white border border-white/20 w-full" value={editingCourse.slots} onChange={(e) => setEditingCourse({...editingCourse, slots: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="bg-[#1a1a2e] p-3 rounded text-white border border-white/20 w-full" value={editingCourse.category} onChange={(e)=>setEditingCourse({...editingCourse, category: e.target.value})}>
                                    <option value="Adults">Adults</option>
                                    <option value="Kids">Kids</option>
                                </select>
                                <select className="bg-[#1a1a2e] p-3 rounded text-white border border-white/20 w-full" value={editingCourse.type} onChange={(e)=>setEditingCourse({...editingCourse, type: e.target.value})}>
                                    <option value="Fine Arts">Fine Arts</option>
                                    <option value="Sculpting">Sculpting</option>
                                </select>
                            </div>
                            <textarea 
                                rows="4" 
                                className="bg-white/5 p-3 rounded text-white border border-white/20 w-full" 
                                value={Array.isArray(editingCourse.description) ? editingCourse.description.join('\n') : editingCourse.description} 
                                onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})} 
                            />
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Update Image (Leave blank to keep current)</label>
                                <input 
                                    type="file" accept="image/*" 
                                    className="bg-white/5 border border-white/20 rounded-lg p-2 text-white w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D984B5] file:text-white"
                                    onChange={(e)=>setEditingCourse({...editingCourse, newFile: e.target.files[0]})}
                                />
                            </div>
                            <button className="w-full bg-[#D984B5] py-3 rounded text-black font-bold hover:bg-white transition-colors mt-4">Save Changes</button>
                        </form>
                    </div>
                </div>
                )}
            
                {/* Course List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="glass-card p-6 rounded-2xl border border-white/10 flex gap-4">
                    <img src={course.image} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-black">{Array.isArray(course.title) ? course.title[0] : course.title}</h3>
                            <p className="text-[#D984B5] font-bold">₹{course.price}</p>
                            <p className="text-xs text-gray-600">{course.category} • {course.type}</p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                            <button 
                                onClick={() => setEditingCourse(course)} 
                                className="px-4 py-2 bg-white/10 hover:bg-white hover:text-[#D984B5] text-black rounded-lg flex items-center gap-2 transition-colors flex-1 justify-center"
                            >
                                <Edit size={16} /> Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteCourse(course._id)} 
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg flex items-center gap-2 transition-colors flex-1 justify-center"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
            {/* --- TAB: ENQUIRIES --- */}
            {activeTab === "enquiries" && (
            <div className="glass-card p-8 rounded-3xl border border-white/10">
                <h2 className="text-2xl font-bold text-black mb-6">Messages</h2>
                <div className="space-y-4">
                    {enquiries.map((msg) => (
                        <div key={msg._id} className="bg-white/5 p-6 rounded-xl border border-white/5">
                            <h4 className="text-lg font-bold text-[#D984B5]">{msg.name}</h4>
                            <p className="text-black bg-black/20 p-4 rounded-lg">{msg.message}</p>
                        </div>
                    ))}
                </div>
            </div>
            )}

        </div>
        </div>
    );
    };

    export default AdminDashboard;
