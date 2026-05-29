    import React from 'react';
    import { MapPin, Phone, Calendar, Clock, Palette } from 'lucide-react';

    const SummerCamp = () => {
    return (
        // CHANGED: pt-32 to pt-8 to close the massive gap at the top
        <div className="pt-20 pb-20 px-4 min-h-screen overflow-x-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
            
            {/* Header */}
            <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ff4949] to-[#f8ff3b]" style={{ fontFamily: "'Kaushan Script', cursive" }}>
                Summer Camp 2026
            </h1>
            <p className="text-xl text-black font-medium">Chetna's Creative Den • A Courtyard of endless creativity</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Card 1: Kids Summer Camp */}
            <div className="glass-card p-8 rounded-3xl border border-[#fe6dc2]/30 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden flex flex-col justify-between">
                <div>
                <div className="absolute top-0 right-0 bg-[#fe6dc2] text-black px-4 py-1 rounded-bl-xl font-bold text-base">Ages 5-10</div>
                <h2 className="text-3xl font-bold text-black mb-6">Craft & Painting Kids Camp</h2>
                {/* CHANGED: Base text increased to text-lg */}
                <div className="space-y-4 text-black text-lg">
                    <p className="flex items-center gap-3"><Calendar className="text-[#00a6ff]" size={24} /> 1st June to 10th June 2026</p>
                    <p className="flex items-center gap-3"><Clock className="text-[#00a6ff]" size={24} /> 11:00 AM - 12:30 PM</p>
                    <div className="pt-4 border-t border-black/10">
                    <h3 className="font-bold text-[#D984B5] mb-3 text-xl">Programs:</h3>
                    {/* CHANGED: text-sm to text-lg */}
                    <ul className="grid grid-cols-2 gap-3 text-lg list-disc pl-6">
                        <li>Paper crafts</li>
                        <li>Clay Modelling</li>
                        <li>Canvas Painting</li>
                        <li>Tote bag painting</li>
                        <li>Calligraphy</li>
                    </ul>
                    </div>
                </div>
                </div>
                <div className="pt-4 mt-6 border-t border-black/10">
                {/* CHANGED: text-xl to text-3xl, materials note to text-base */}
                <p className="text-3xl font-bold text-black">Fee: Rs. 3000 <span className="text-base font-normal text-black/60">(Materials Included)</span></p>
                </div>
            </div>

            {/* Card 2: Live Sketching Special */}
            <div className="glass-card p-8 rounded-3xl border border-yellow-500/30 hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-br from-yellow-500/10 to-transparent flex flex-col justify-between">
                <div>
                <div className="inline-block bg-yellow-200 text-[#240046] px-4 py-1.5 rounded-full font-bold text-sm mb-4">2 Days Offline</div>
                <h2 className="text-4xl font-bold text-black mb-2">Live Sketching</h2>
                {/* CHANGED: text-xl to text-2xl */}
                <p className="text-2xl text-pink-700 mb-6 font-medium">Class by: Shashank Shukla</p>
                <div className="p-5 bg-black/10 rounded-xl border border-black/10 mb-4">
                    {/* CHANGED: Increased italic text size to text-lg */}
                    <p className="text-black/80 italic text-lg leading-relaxed">"Join us for an intensive 2-day offline session focusing on realistic portrait and figure sketching."</p>
                </div>
                </div>
                <a href="https://wa.me/919899400835" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-xl transition-colors w-full justify-center mt-4 text-lg">
                <Phone size={24} /> Register via WhatsApp
                </a>
            </div>

            {/* Card 3: MERGED Week 1 & 2 Schedule (Spans both columns on desktop) */}
            <div className="glass-card p-8 rounded-3xl border border-[#3bbaff]/30 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden md:col-span-2">
                <div className="absolute top-0 right-0 bg-[#3bbaff] text-black px-4 py-1 rounded-bl-xl font-bold text-base">Ages 10+</div>
                
                {/* Header & Pricing */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-black/10 pb-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">2-Week Summer Camp Package</h2>
                        {/* CHANGED: text-sm to text-base */}
                        <p className="text-base text-black/80 font-bold uppercase tracking-wider">* All Activities & Materials Included</p>
                    </div>
                    <div className="bg-[#3bbaff]/10 border border-[#3bbaff]/30 px-6 py-4 rounded-2xl">
                        {/* CHANGED: text-3xl to text-4xl */}
                        <p className="text-4xl font-bold text-black">Rs. 6500 <span className="text-lg text-black/60 font-normal">/ Package</span></p>
                    </div>
                </div>

                {/* 2-Column Schedule Grid */}
                {/* CHANGED: text-sm to text-base md:text-lg for better readability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-base md:text-lg text-black">
                
                {/* Week 1 List */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-[#D984B5] mb-5 flex items-center gap-2">
                        <Calendar size={24}/> Week 1 Schedule
                    </h3>
                    <div className="flex justify-between border-b border-black/5 pb-3"><span><b>Mon, 1st June</b> (12-2 PM)</span> <span>Tote Bag Painting</span></div>
                    <div className="flex justify-between border-b border-black/5 pb-3"><span><b>Tue, 2nd June</b> (12-2 PM)</span> <span>Canvas Painting</span></div>
                    <div className="flex justify-between border-b border-black/5 pb-3"><span><b>Wed, 3rd June</b> (12-2 PM)</span> <span>Decoupage Pen Holder</span></div>
                    <div className="flex justify-between border-b border-black/5 pb-3"><span><b>Thu, 4th June</b> (12-2 PM)</span> <span>Tie and Die</span></div>
                    <div className="flex justify-between border-b border-black/5 pb-3"><span><b>Fri, 5th June</b> (12-2 PM)</span> <span>Illusion Art</span></div>
                    <div className="flex justify-between text-[#D984B5] font-bold mt-3"><span><b>Sat & Sun, 6th-7th June</b><br/>(11 AM - 3 PM)</span> <span className="text-right">Live Sketching<br/>(Advance w/ Guest Artist)</span></div>
                </div>

                {/* Week 2 List */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-[#D984B5] mb-5 flex items-center gap-2">
                        <Calendar size={24}/> Week 2 Schedule
                    </h3>
                    <div className="flex justify-between border-b border-black/5 pb-3"><span><b>Mon, 8th June</b> (12-2 PM)</span> <span>Texture Painting</span></div>
                    <div className="flex justify-between border-b border-black/5 pb-3"><span><b>Tue 9th & Wed 10th June</b><br/>(12-2 PM)</span> <span className="text-right">Jharokha Decoration<br/>with Lippan Art</span></div>
                    <div className="flex justify-between border-b border-black/5 pb-3"><span><b>Thu 11th & Fri/Sat 12th June</b><br/>(12-2 PM)</span> <span className="text-right">3D Thermacoal Modelling</span></div>
                    <div className="flex justify-between font-bold text-[#00a4fd] mt-3"><span><b>Sun, 13th & 14th June</b> (12-2 PM)</span> <span>Clay Modelling</span></div>
                </div>
                
                </div>
            </div>

            </div>

            {/* Location Footer Card */}
            <div className="glass-card p-6 md:p-10 rounded-3xl border border-black/10 text-center max-w-3xl mx-auto flex flex-col items-center gap-4">
            <h3 className="text-3xl font-bold text-black">Join the Creative Den</h3>
            <p className="flex items-center justify-center gap-3 text-black text-xl"><Phone className="text-[#D984B5]" size={24} /> Call and Register: <strong>9899400835</strong></p>
            <p className="flex items-center justify-center gap-3 text-black text-lg mt-2"><MapPin className="text-[#D984B5]" size={28} /> Plot No. 1218, 2nd Floor, Vasundhara Sector 5, Ghaziabad</p>
            </div>

        </div>

        {/* Floating WhatsApp Bubble */}
        <a 
            href="https://wa.me/919899400835" 
            target="_blank" 
            rel="noreferrer"
            className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform z-50 flex items-center justify-center"
            title="Chat with us on WhatsApp"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
        </a>
        </div>
    );
    };

    export default SummerCamp;