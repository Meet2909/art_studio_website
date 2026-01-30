    import React, { useState } from "react";
    import { User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
    import toast from 'react-hot-toast';

    const Login = ({ navigateTo, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = isLogin ? "/login" : "/register";

        try {
        const res = await fetch(`/api/auth${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
            // Save user to local storage (Simple Session)
            onLoginSuccess(data); // Call the helper from App.jsx
            toast.success(`Welcome, ${data.name}!`, { duration: 7000 });

            // Redirect based on role
            if (data.role === "admin") {
            navigateTo("admin");
            } else {
            navigateTo("home");
            }
        } else {
            toast.error(data.message || 'Something went wrong');
        }
        } catch (err) {
        console.error(err);
        setError("Server error. Please try again later.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg border border-white/10 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D984B5]/20 rounded-full blur-[80px] -z-10"></div>

            <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-black mb-2">
                {isLogin ? "Welcome Back" : "Join the Studio"}
            </h2>
            <p className="text-black">
                {isLogin
                ? "Enter your details to access your creative space."
                : "Start your artistic journey with us today."}
            </p>
            </div>

            {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm text-center mb-6 border border-red-500/30">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Only for Signup) */}
            {!isLogin && (
                <div className="relative group">
                <User
                    className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#D984B5] transition-colors"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-black focus:outline-none focus:border-[#D984B5]/50 transition-all placeholder-gray-500"
                    value={formData.name}
                    onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                    }
                />
                </div>
            )}

            {/* Email Field */}
            <div className="relative group">
                <Mail
                className="absolute left-4 top-3.5 text-black group-focus-within:text-[#D984B5] transition-colors"
                size={20}
                />
                <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-black focus:outline-none focus:border-[#D984B5]/50 transition-all placeholder-gray-500"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                />
            </div>

            {/* Password Field */}
            <div className="relative group">
                <Lock
                className="absolute left-4 top-3.5 text-black group-focus-within:text-[#D984B5] transition-colors"
                size={20}
                />
                <input
                type="password"
                placeholder="Password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-black focus:outline-none focus:border-[#D984B5]/50 transition-all placeholder-gray-500"
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
                />
            </div>

            <button
                disabled={loading}
                className="w-full bg-[#D984B5] hover:bg-white hover:text-[#3D2C4D] text-black font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 mt-4"
            >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                {!loading && <ArrowRight size={20} />}
            </button>
            </form>

            <div className="mt-8 text-center">
            <p className="text-black text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-black font-bold hover:underline hover:text-[#AEE2FF] transition-colors"
                >
                {isLogin ? "Sign Up" : "Login"}
                </button>
            </p>
            </div>
        </div>
        </div>
    );
    };

    export default Login;
