    import React, { useState } from "react";
    import {
    Users, ShoppingBag, DollarSign, RefreshCw, Lock, Trash2, Plus, 
    Image as ImageIcon, Edit, MessageSquare, Save, X, LogOut, Palette
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
        const res = await fetch(`${API_URL}/api/admin/art`, {
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
    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
        const res = await authFetch(`/api/admin/courses/${editingCourse._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCourse) });
        if (res.ok) { toast.success("Course Updated!"); setEditingCourse(null); fetchData(user.token); }
        } catch (err) { toast.error("Update failed"); }
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
                    <input type="email" placeholder="Admin Email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#D984B5]" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#D984B5]" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
                <div className="flex bg-white/5 p-1 rounded-lg overflow-x-auto">
                {["overview", "store", "orders", "gallery", "courses", "enquiries"].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md capitalize font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab ? "bg-[#D984B5] text-black" : "text-black hover:text-white"
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
                    <Palette className="text-[#D984B5]" /> Add New Artwork
                </h2>
                <form onSubmit={handleAddArt} className="grid md:grid-cols-2 gap-4">
                    <input 
                    type="text" placeholder="Artwork Title" required
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                    value={newArt.title} onChange={(e)=>setNewArt({...newArt, title: e.target.value})}
                    />
                    <input 
                    type="number" placeholder="Price (₹)" required
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                    value={newArt.price} onChange={(e)=>setNewArt({...newArt, price: e.target.value})}
                    />
                    <select 
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                    value={newArt.category} onChange={(e)=>setNewArt({...newArt, category: e.target.value})}
                    >
                    <option value="Painting">Painting</option>
                    <option value="Sketch">Sketch</option>
                    <option value="Digital">Digital Art</option>
                    <option value="Sculpture">Sculpture</option>
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
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-black border-b border-white/10">
                    <th className="p-4">Order Info</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="text-black">
                    {orders.map((order) => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                        <span className="font-mono text-[#D984B5] text-sm">#{order._id.slice(-6)}</span>
                        <div className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">{order.userEmail}</td>
                        <td className="p-4">
                        {order.items.map((i,idx) => <div key={idx} className="text-sm">{i.title}</div>)}
                        </td>
                        <td className="p-4 text-right font-bold">₹{order.totalAmount}</td>
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
                {editingCourse && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a2e] p-8 rounded-2xl w-full max-w-2xl border border-white/20 relative">
                    <button onClick={() => setEditingCourse(null)} className="absolute top-4 right-4 text-black"><X /></button>
                    <h2 className="text-2xl font-bold text-white mb-6">Edit Course</h2>
                    <form onSubmit={handleUpdateCourse} className="space-y-4">
                        <input className="bg-white/5 p-3 rounded text-black w-full" value={editingCourse.title} onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})} />
                        <input className="bg-white/5 p-3 rounded text-black w-full" type="number" value={editingCourse.price} onChange={(e) => setEditingCourse({...editingCourse, price: e.target.value})} />
                        <button className="w-full bg-[#D984B5] py-3 rounded text-black font-bold">Save Changes</button>
                    </form>
                    </div>
                </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="glass-card p-6 rounded-2xl border border-white/10 flex gap-4">
                    <img src={course.image} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-black">{course.title}</h3>
                        <p className="text-[#D984B5] font-bold">₹{course.price}</p>
                        <button onClick={() => setEditingCourse(course)} className="mt-4 px-4 py-2 bg-white/10 text-black rounded-lg flex items-center gap-2"><Edit size={16} /> Edit</button>
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