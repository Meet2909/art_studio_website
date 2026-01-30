    import React, { useState } from "react";
    import {
    Users, ShoppingBag, DollarSign, RefreshCw, Lock, Trash2, Plus, 
    Image as ImageIcon, Edit, MessageSquare, Save, X, LogOut
    } from "lucide-react";
    import toast from "react-hot-toast"; 

    const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview"); 
    const [setLoading] = useState(false);
    
    // --- AUTH STATE (RAM ONLY) ---
    // We do NOT load from localStorage on mount. 
    // This ensures a Refresh wipes this state back to null.
    const [user, setUser] = useState(null); 
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Data States
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enquiries, setEnquiries] = useState([]);

    // Form States
    const [newItem, setNewItem] = useState({ title: "", rounded: "rounded-[15px]", file: null });
    const [editingCourse, setEditingCourse] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || "";

    // --- 1. LOGIN HANDLER (Enforces Single Session) ---
    const handleLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Verifying credentials...");

        try {
        // 1. Force Logout of any existing regular user (Student)
        // This prevents "Simultaneous" login. You are either Admin OR Student.
        localStorage.removeItem("userInfo"); 

        // 2. Attempt Admin Login
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await res.json();
        
        if (res.ok && data.role === "admin") {
            // 3. SET STATE ONLY (Do NOT save to localStorage)
            // This keeps the session alive only as long as the page is not refreshed.
            setUser(data);
            
            fetchData(data.token);
            toast.success("Welcome, Admin (Session Active)", { id: toastId });
        } else {
            toast.error(data.message || "Access Denied", { id: toastId });
        }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
        toast.error("Login failed. Check server.", { id: toastId });
        }
    };

    // --- 2. AUTH FETCH HELPER ---
    const authFetch = async (endpoint, options = {}, token = user?.token) => {
        const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`, 
        };

        const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

        if (res.status === 401) {
        handleLogout(); 
        throw new Error("Unauthorized");
        }
        return res;
    };

    // --- 3. LOGOUT HANDLER ---
    const handleLogout = () => {
        // Just clear the state. Since we didn't save to localStorage, 
        // there's nothing else to clean up.
        setUser(null);
        setOrders([]);
        setEnquiries([]);
        toast.success("Logged out");
    };

    const fetchData = async (token) => {
        if(!token) return;
        setLoading(true);
        try {
        const [statsRes, ordersRes, galleryRes, coursesRes, enquiryRes] = await Promise.all([
            authFetch("/api/admin/stats", {}, token),
            authFetch("/api/admin/orders", {}, token),
            fetch(`${API_URL}/api/admin/gallery`), 
            fetch(`${API_URL}/api/admin/courses`), 
            authFetch("/api/admin/enquiries", {}, token),
        ]);

        setStats(await statsRes.json());
        setOrders(await ordersRes.json());
        setGalleryItems(await galleryRes.json());
        setCourses(await coursesRes.json());
        setEnquiries(await enquiryRes.json());
        } catch (error) {
        console.error("Error fetching data:", error);
        } finally {
        setLoading(false);
        }
    };

    // --- HANDLERS (Same as before) ---
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
        if (res.ok) {
            toast.success("Image Uploaded!");
            setNewItem({ title: "", rounded: "rounded-[15px]", file: null });
            fetchData(user.token);
        } else {
            toast.error("Upload failed");
        }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
        toast.error("Server Error");
        }
    };

    const handleDeleteGallery = async (id) => {
        if(!window.confirm("Delete this image?")) return;
        try {
        await authFetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
        toast.success("Image Deleted");
        fetchData(user.token);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
        toast.error("Failed to delete");
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
        const res = await authFetch(`/api/admin/courses/${editingCourse._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingCourse),
        });
        if (res.ok) {
            toast.success("Course Updated!");
            setEditingCourse(null);
            fetchData(user.token);
        }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
        toast.error("Update failed");
        }
    };

    // --- LOGIN SCREEN (Shown if user is null) ---
    if (!user) {
        return (
        <div className="pt-32 min-h-screen flex items-center justify-center px-4">
            <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center border border-white/10">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#D984B5]">
                <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-black mb-6">Admin Portal</h2>
            <p className="text-sm text-gray-500 mb-6">
                Note: Logging in here will log out any active student sessions.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                type="email"
                placeholder="Admin Email"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-black focus:outline-none focus:border-[#D984B5]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-black focus:outline-none focus:border-[#D984B5]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button className="w-full bg-[#D984B5] hover:bg-white hover:text-[#3D2C4D] text-black font-bold py-3 rounded-lg transition-colors">
                Login (Temporary Session)
                </button>
            </form>
            </div>
        </div>
        );
    }

    // --- DASHBOARD (Only shown if user state exists in RAM) ---
    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
        <div className="max-w-[95%] mx-auto">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            
            <div className="flex items-center gap-4">
                <div className="flex bg-white/5 p-1 rounded-lg overflow-x-auto">
                {["overview", "orders", "gallery", "courses", "enquiries"].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md capitalize font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab ? "bg-[#D984B5] text-black" : "text-black hover:text-white"
                    }`}
                    >
                    {tab}
                    </button>
                ))}
                </div>
                
                <button 
                onClick={handleLogout}
                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"
                title="Logout"
                >
                <LogOut size={20} />
                </button>
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
                <div className="p-4 bg-purple-500/20 rounded-full text-purple-400"><MessageSquare size={32} /></div>
                <div><p className="text-black text-sm">Messages</p><h3 className="text-3xl font-bold text-black">{enquiries.length}</h3></div>
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
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Courses & Attendees</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="text-black">
                    {orders.map((order) => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 align-top transition-colors">
                        <td className="p-4">
                        <span className="font-mono text-[#D984B5] text-sm">#{order._id.slice(-6)}</span>
                        <div className="text-xs text-black mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-black">
                            {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        </td>
                        <td className="p-4 max-w-[250px]">
                        <div className="font-bold text-black mb-1">{order.userEmail}</div>
                        {order.userPhone ? (
                            <div className="text-sm text-black flex items-center gap-2 mb-1">
                            📞 {order.userPhone}
                            </div>
                        ) : <div className="text-xs text-red-700">No Phone</div>}
                        {order.shippingAddress ? (
                            <div className="text-xs text-black bg-white/5 p-2 rounded border border-white/5">
                            📍 {order.shippingAddress}
                            </div>
                        ) : <div className="text-xs text-black">No Address</div>}
                        </td>
                        <td className="p-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="mb-3 last:mb-0">
                            <div className="text-black font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-[#D984B5] mt-1 ml-2 pl-2 border-l border-[#D984B5]/30">
                                {item.attendees && item.attendees.length > 0 ? (
                                item.attendees.map((name, i) => (
                                    <div key={i}>• {name}</div>
                                ))
                                ) : "Guest"}
                            </div>
                            </div>
                        ))}
                        </td>
                        <td className="p-4">
                        <div className="flex flex-col gap-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded w-fit border ${
                            order.paymentMode === 'COD' 
                                ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20' 
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                            {order.paymentMode === 'COD' ? 'Pay on Spot' : 'Online Paid'}
                            </span>
                            <span className={`text-xs flex items-center gap-1 ${
                            order.paymentStatus === 'Completed' ? 'text-green-400' : 'text-orange-700'
                            }`}>
                            ● {order.paymentStatus}
                            </span>
                        </div>
                        </td>
                        <td className="p-4 text-right">
                        <span className="text-xl font-bold text-black">₹{order.totalAmount}</span>
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
                <h2 className="text-2xl font-bold text-black mb-6">Upload New Art</h2>
                <form onSubmit={handleAddImage} className="grid md:grid-cols-3 gap-4">
                    <input 
                    type="text" placeholder="Title" required
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-black"
                    value={newItem.title} onChange={(e)=>setNewItem({...newItem, title: e.target.value})}
                    />
                    <input 
                    type="file" accept="image/*" required
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#D984B5] file:text-white"
                    onChange={(e)=>setNewItem({...newItem, file: e.target.files[0]})}
                    />
                    <button className="bg-[#D984B5] text-black font-bold py-3 rounded-lg">Upload</button>
                </form>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {galleryItems.map((item) => (
                    <div key={item._id} className="glass-card p-2 rounded-xl border border-white/10 relative group">
                    <img src={item.imageUrl} alt={item.title} className="w-full aspect-square object-cover rounded-lg" />
                    <button onClick={() => handleDeleteGallery(item._id)} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} color="white"/></button>
                    <p className="text-center text-black mt-2 text-sm">{item.title}</p>
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
                    <div className="bg-[#1a1a2e] p-8 rounded-2xl w-full max-w-2xl border border-white/20 relative max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setEditingCourse(null)} className="absolute top-4 right-4 text-black"><X /></button>
                    <h2 className="text-2xl font-bold text-white mb-6">Edit Course</h2>
                    <form onSubmit={handleUpdateCourse} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                        <input className="bg-white/5 p-3 rounded text-black" value={editingCourse.title} onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})} placeholder="Title" />
                        <input className="bg-white/5 p-3 rounded text-black" type="number" value={editingCourse.price} onChange={(e) => setEditingCourse({...editingCourse, price: e.target.value})} placeholder="Price" />
                        </div>
                        <textarea className="bg-white/5 p-3 rounded text-black w-full h-32" value={editingCourse.description.join('\n')} onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value.split('\n')})} placeholder="Description (One per line)" />
                        <input className="bg-white/5 p-3 rounded text-black w-full" value={editingCourse.image} onChange={(e) => setEditingCourse({...editingCourse, image: e.target.value})} placeholder="Image URL" />
                        <button className="w-full bg-[#D984B5] py-3 rounded text-black font-bold">Save Changes</button>
                    </form>
                    </div>
                </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="glass-card p-6 rounded-2xl border border-white/10 flex gap-4">
                    <img src={course.image} className="w-24 h-24 object-cover rounded-lg" alt="" />
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-black">{course.title}</h3>
                        <p className="text-[#D984B5] font-bold">₹{course.price}</p>
                        <p className="text-black text-sm mt-2 line-clamp-2">{course.description.join(', ')}</p>
                        <button onClick={() => setEditingCourse(course)} className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-black rounded-lg flex items-center gap-2">
                        <Edit size={16} /> Edit Course
                        </button>
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
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-[#D984B5]">{msg.name}</h4>
                        <span className="text-xs text-black">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-black text-sm mb-2">{msg.email}</p>
                    <p className="text-black bg-black/20 p-4 rounded-lg">{msg.message}</p>
                    </div>
                ))}
                {enquiries.length === 0 && <p className="text-black">No messages yet.</p>}
                </div>
            </div>
            )}
        </div>
        </div>
    );
    };

    export default AdminDashboard;