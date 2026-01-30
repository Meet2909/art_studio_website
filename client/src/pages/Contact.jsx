    import React, { useState } from "react";
    import {
    MapPin,
    Phone,
    Mail,
    Linkedin,
    Instagram,
    Facebook,
    } from "lucide-react";

    const Contact = () => {
    // Form State
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        try {
        const res = await fetch("/api/admin/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setStatus("success");
            setFormData({ name: "", email: "", message: "" });
        } else {
            setStatus("error");
        }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
        setStatus("error");
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto glass-card rounded-2xl p-8 shadow-xl">
            <h2 className="text-5xl font-bold text-[#835da6b6] mb-8 text-center">
            Get in Touch
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
            {/* --- LEFT COLUMN: Contact Info --- */}
            <div className="space-y-6">
                
                {/* Visit Us (Google Maps Link) */}
                <div className="flex items-center gap-4 text-[#ebd8fd]">
                <a 
                    href="https://maps.google.com/?q=1218,+2nd+Floor,+Sector+5,+Vasundhara,+Ghaziabad,+Uttar+Pradesh+201012"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:opacity-75 transition-opacity cursor-pointer group w-full"
                >
                    <div className="p-3 bg-[#715b7e] rounded-full text-[#ff9dd6] shrink-0">
                    <MapPin size={20} />
                    </div>
                    <div>
                    <p className="font-bold text-[#352a3e]">Visit Us</p>
                    <p className="text-black text-sm">1218, 2nd Floor, Sector 5, Vasundhara, Ghaziabad, U.P. 201012</p>
                    </div>
                </a>
                </div>

                {/* Call Us */}
                <div className="flex items-center gap-4 text-[#f8f0ff]">
                <a href="tel:+919899400835" className="flex items-center gap-4 hover:opacity-75 transition-opacity w-full">
                    <div className="p-3 bg-[#715b7e] rounded-full text-[#f8a6d6] shrink-0">
                        <Phone size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-[#32293a]">Call Us</p>
                        <p className="text-black">+91 98994 00835</p>
                    </div>
                </a>
                </div>

                {/* Email Us */}
                <div className="flex items-center gap-4 text-[#eddaff]">
                <a href="mailto:info@chetnascreativeden.com" className="flex items-center gap-4 hover:opacity-75 transition-opacity w-full">
                    <div className="p-3 bg-[#715b7e] rounded-full text-[#f990cd] shrink-0">
                        <Mail size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-[#32293a]">Email Us</p>
                        <p className="text-black break-all">info@chetnascreativeden.com</p>
                    </div>
                </a>
                </div>

                {/* Social Media Links */}
                <div className="pt-6">
                <h3 className="text-[#32293a] font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                    {/* LinkedIn */}
                    <a 
                    href="https://www.linkedin.com/company/chetna-s-creative-den/about/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-[#AEE2FF] rounded-full text-[#3D2C4D] hover:scale-110 transition-transform flex items-center justify-center"
                    >
                    <Linkedin size={20} />
                    </a>

                    {/* Instagram */}
                    <a 
                    href="https://www.instagram.com/chetnascreativeden?igsh=eXBhZno0aW40NXJ4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-[#D984B5] rounded-full text-white hover:scale-110 transition-transform flex items-center justify-center"
                    >
                    <Instagram size={20} />
                    </a>

                    {/* Facebook (Restored) */}
                    <a 
                        href="https://www.facebook.com/chetna.aerongautam" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-[#AEE2FF] rounded-full text-[#3D2C4D] hover:scale-110 transition-transform flex items-center justify-center"
                    >
                        <Facebook size={20} />
                    </a>
                </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: Working Contact Form --- */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full bg-white/10 border border-[#A9B5D9]/50 rounded-lg p-3 text-black placeholder-gray-600 focus:outline-none focus:border-[#D984B5] transition-colors font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                type="email"
                placeholder="Your Email"
                required
                className="w-full bg-white/10 border border-[#A9B5D9]/50 rounded-lg p-3 text-black placeholder-gray-600 focus:outline-none focus:border-[#D984B5] transition-colors font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <textarea
                rows="4"
                placeholder="Message"
                required
                className="w-full bg-white/10 border border-[#A9B5D9]/50 rounded-lg p-3 text-black placeholder-gray-600 focus:outline-none focus:border-[#D984B5] transition-colors font-medium"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>

                <button
                disabled={status === "sending"}
                className="w-full bg-[#D984B5] hover:bg-[#AEE2FF] hover:text-[#3D2C4D] text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                {status === "sending" ? "Sending..." : "Send Message"}
                </button>

                {status === "success" && (
                <p className="text-green-600 text-center font-semibold mt-2">
                    Message sent successfully!
                </p>
                )}
                {status === "error" && (
                <p className="text-red-600 text-center font-semibold mt-2">
                    Failed to send. Please try again.
                </p>
                )}
            </form>
            </div>
        </div>
        </div>
    );
    };

    export default Contact;