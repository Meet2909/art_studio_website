    import React from 'react';
    import { MessageCircle } from 'lucide-react';

    const FloatingWhatsApp = () => {
    // REPLACE with the client's actual phone number (Country code + Number)
    // Example: "919876543210" for India
    const phoneNumber = "919899400835"; 
    const message = "Hi! I'm interested in joining a workshop.";

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-[200] bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center gap-2 group"
        aria-label="Chat on WhatsApp"
        >
        <MessageCircle size={32} fill="white" />
        {/* Optional: Text that appears on hover */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold">
            Chat with us
        </span>
        </button>
    );
    };

    export default FloatingWhatsApp;