    /* eslint-disable no-unused-vars */
    import React, { useState } from "react";
    import {
    ShoppingCart,
    CreditCard,
    Trash2,
    Plus,
    Minus,
    User,
    Building2,
    X,
    MapPin,
    Phone,
    Smile,
    AlertTriangle,
    Info // <--- Imported for the warning icon
    } from "lucide-react";
    import toast from "react-hot-toast";

    // Helper to load Razorpay script
    const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
    };

    const Cart = ({ cart, navigateTo, addToCart, removeFromCart, clearCart, user }) => {
    const [attendeeNames, setAttendeeNames] = useState({});
    
    // Modal States
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [showRefundWarning, setShowRefundWarning] = useState(false); // <--- New State

    const [checkoutDetails, setCheckoutDetails] = useState({
        address: user?.address || "",
        phone: user?.phone || "",
    });

    const groupedItems = cart.reduce((acc, item) => {
        const itemId = item.id || item._id;
        if (!acc[itemId]) {
        acc[itemId] = { ...item, quantity: 0 };
        }
        acc[itemId].quantity += 1;
        return acc;
    }, {});

    const cartItems = Object.values(groupedItems);
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handleNameChange = (courseId, index, name) => {
        const key = `${courseId}-${index}`;
        setAttendeeNames((prev) => ({ ...prev, [key]: name }));
    };

    const handleCheckoutInputChange = (e) => {
        const { name, value } = e.target;
        setCheckoutDetails((prev) => ({ ...prev, [name]: value }));
    };

    const validateCheckoutDetails = () => {
        if (!checkoutDetails.address.trim() || !checkoutDetails.phone.trim()) {
        toast.error("Please provide address and phone number.");
        return false;
        }
        return true;
    };

    // --- OPTION 1: HANDLE COD (Pay on Spot) ---
    const handleCODSubmit = async () => {
        if (!validateCheckoutDetails()) return;

        const toastId = toast.loading("Processing order...");

        try {
        const res = await fetch("/api/payment/cod-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            userId: user ? user._id : "guest_user",
            userEmail: user ? user.email : "guest@example.com",
            userPhone: checkoutDetails.phone,
            shippingAddress: checkoutDetails.address,
            items: cartItems.map((item) => {
                const itemId = item.id || item._id;
                return {
                title: Array.isArray(item.title) ? item.title.join(" ") : item.title,
                price: item.price,
                courseId: itemId,
                attendees: Array.from({ length: item.quantity }).map(
                    (_, i) => attendeeNames[`${itemId}-${i}`] || "Guest"
                ),
                };
            }),
            totalAmount: total,
            }),
        });

        const data = await res.json().catch(() => ({ message: "Server communication failed" }));

        if (res.ok) {
            toast.success("Order Placed! Pay at the studio.", { id: toastId });
            clearCart();
            setIsCheckoutModalOpen(false);
            navigateTo("home");
        } else {
            toast.error(data.message || "Failed to place order", { id: toastId });
        }
        } catch (error) {
        console.error("COD Error:", error);
        toast.error("Something went wrong. Try again.", { id: toastId });
        }
    };

    // --- OPTION 2: HANDLE ONLINE PAYMENT (Interrupted by Warning) ---
    const handleOnlinePaymentBtnClick = () => {
        if (!validateCheckoutDetails()) return;
        
        // 1. Close the Checkout Form
        setIsCheckoutModalOpen(false);
        
        // 2. Open the Refund Warning Modal
        setShowRefundWarning(true);
    };

    // --- ACTUAL RAZORPAY TRIGGER (Called after confirmation) ---
    const startRazorpayFlow = async () => {
        const toastId = toast.loading("Initializing Payment...");
        const res = await loadRazorpay();

        if (!res) {
        toast.error("Razorpay SDK failed to load.", { id: toastId });
        return;
        }

        try {
        // A. Create Order
        const orderRes = await fetch("/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total, currency: "INR", items: cartItems }),
        });

        // eslint-disable-next-line no-unused-vars
        const orderData = await orderRes.json().catch((_err) => null);

        if (!orderRes.ok || !orderData) {
            throw new Error(orderData?.message || "Server Error: Could not create order");
        }

        toast.dismiss(toastId);

        // B. Open Razorpay
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Chetna's Creative Den",
            description: "Workshop Enrollment",
            order_id: orderData.id,
            // 1. Success Handler
            handler: async function (response) {
            const verifyToast = toast.loading("Verifying Payment...");
            try {
                const verifyRes = await fetch("/api/payment/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user ? user._id : "guest_user",
                    userEmail: user ? user.email : "guest@example.com",
                    userPhone: checkoutDetails.phone,
                    shippingAddress: checkoutDetails.address,
                    items: cartItems.map((item) => {
                    const itemId = item.id || item._id;
                    return {
                        title: Array.isArray(item.title) ? item.title.join(" ") : item.title,
                        price: item.price,
                        courseId: itemId,
                        attendees: Array.from({ length: item.quantity }).map(
                        (_, i) => attendeeNames[`${itemId}-${i}`] || "Guest"
                        ),
                    };
                    }),
                    totalAmount: total,
                }),
                });

                const verifyData = await verifyRes.json();
                if (verifyRes.ok) {
                toast.success("Payment Successful!", { id: verifyToast });
                clearCart();
                navigateTo("home");
                } else {
                toast.error(verifyData.message || "Verification Failed", { id: verifyToast });
                }
            } catch (err) {
                toast.error("Verification Network Error", { id: verifyToast });
            }
            },
            // 2. Handle Cancellation
            modal: {
            ondismiss: function () {
                toast.error("Payment Cancelled");
            },
            },
            prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: checkoutDetails.phone,
            },
            theme: { color: "#D984B5" },
        };

        const paymentObject = new window.Razorpay(options);

        paymentObject.on("payment.failed", function (response) {
            toast.error(response.error.description || "Payment Failed");
        });

        paymentObject.open();
        } catch (error) {
        console.error(error);
        toast.error(error.message || "Checkout failed.", { id: toastId });
        }
    };

    // --- SUB-COMPONENTS ---
    const CorporateNote = () => (
        <div className="max-w-6xl mx-auto mt-12 mb-8 w-full">
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-center gap-3 text-center bg-white/5 backdrop-blur-sm">
            <Building2 className="text-gray-700" size={24} />
            <p className="text-gray-600 text-lg font-medium">
            For corporate workshops, please{" "}
            <button
                onClick={() => navigateTo("contact")}
                className="text-[#D984B5] font-bold hover:underline decoration-2 underline-offset-4 transition-all"
            >
                contact
            </button>{" "}
            the founder directly.
            </p>
        </div>
        </div>
    );

    const UserNote = () => (
        <div className="max-w-6xl mx-auto mt-12 mb-8 w-full">
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-center gap-3 text-center bg-white/5 backdrop-blur-sm">
            <Smile className="text-blue-400" size={24} />
            <p className="text-gray-600 text-lg font-medium">
            We would recommend visiting us and for any query, please{" "}
            <button
                onClick={() => navigateTo("contact")}
                className="text-[#D984B5] font-bold hover:underline decoration-2 underline-offset-4 transition-all"
            >
                contact
            </button>{" "}
            the founder directly.
            </p>
        </div>
        </div>
    );

    if (cart.length === 0) {
        return (
        <div className="pt-40 text-center min-h-screen px-4 flex flex-col items-center">
            <div className="max-w-md mx-auto glass-card p-12 rounded-2xl border border-white/10 mb-8">
            <ShoppingCart size={64} className="mx-auto text-[#000000] mb-6" />
            <h2 className="text-2xl font-bold text-black mb-2">Your Cart is Empty</h2>
            <p className="text-black mb-8">Ready to start your artistic journey?</p>
            <button
                onClick={() => navigateTo("courses")}
                className="px-6 py-3 bg-[#D984B5] text-white rounded-full font-bold hover:bg-[#AEE2FF] hover:text-[#3D2C4D] transition-colors shadow-md"
            >
                Browse Workshops
            </button>
            </div>
            <CorporateNote />
            <UserNote />
        </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            
            {/* Left Column (Cart Items) */}
            <div className="md:col-span-2 space-y-6">
            <h2 className="font-bold text[#0d00ffd7] text-3xl group relative w-fit mx-auto px-6 py-3 md:px-10 md:py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-black/10 text-black transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Enrolled Courses ({cart.length})
            </h2>
            {cartItems.map((item) => {
                const itemId = item.id || item._id;
                return (
                <div key={itemId} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
                    <div className="flex gap-4">
                    <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover border border-white/10" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-black">
                            {Array.isArray(item.title) ? item.title.join(" ") : item.title}
                            </h3>
                            <p className="text-sm text-black">{item.category}</p>
                        </div>
                        <p className="text-[#D984B5] font-bold text-xl">₹{item.price * item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                            <button onClick={() => removeFromCart(itemId)} className="p-2 hover:bg-white/10 text-black transition-colors">
                            <Minus size={16} />
                            </button>
                            <span className="px-4 font-bold text-black">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="p-2 hover:bg-white/10 text-black transition-colors">
                            <Plus size={16} />
                            </button>
                        </div>
                        <button onClick={() => { for (let i = 0; i < item.quantity; i++) removeFromCart(itemId); }} className="text-gray-400 hover:text-red-400 p-2">
                            <Trash2 size={18} />
                        </button>
                        </div>
                    </div>
                    </div>

                    {/* Attendee Details Input - CONDITIONALLY RENDERED */}
                    {(item.category !== 'Painting' && item.type !== 'art') && (
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                        <User size={14} /> Attendee Details
                        </h4>
                        <div className="space-y-3">
                        {Array.from({ length: item.quantity }).map((_, index) => (
                            <div key={`${itemId}-${index}`} className="flex items-center gap-3">
                            <span className="text-xs text-black w-6 font-bold">#{index + 1}</span>
                            <input
                                type="text"
                                placeholder={`Name for Student ${index + 1}`}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#D984B5] placeholder-gray-500"
                                value={attendeeNames[`${itemId}-${index}`] || ""}
                                onChange={(e) => handleNameChange(itemId, index, e.target.value)}
                            />
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                </div>
                );
            })}
            </div>

            {/* Right Column (Summary) */}
            <div className="md:col-span-1">
            <div className="glass-card p-8 rounded-3xl sticky top-24 border border-white/10">
                <h3 className="text-2xl font-bold text-black mb-6">Summary</h3>
                <div className="space-y-4 mb-8 border-b border-white/10 pb-8">
                <div className="flex justify-between text-black">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                </div>
                </div>
                <div className="flex justify-between text-black font-bold text-2xl mb-8">
                <span>Total</span>
                <span>₹{total}</span>
                </div>

                <button
                className="w-full py-4 bg-gradient-to-r from-[#D984B5] to-[#AEE2FF] text-white rounded-xl font-bold shadow-lg hover:shadow-[#D984B5]/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                onClick={() => setIsCheckoutModalOpen(true)}
                >
                <CreditCard size={20} /> Proceed to Checkout
                </button>
            </div>
            </div>
        </div>

        <CorporateNote />
        <UserNote />

        {/* --- CHECKOUT MODAL --- */}
        {isCheckoutModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
            <div className="glass-card w-full max-w-md p-8 rounded-[2.5rem] border border-white/20 relative animate-in fade-in zoom-in duration-300">
                <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="absolute top-6 right-6 text-black/70 hover:text-black transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
                >
                <X size={24} />
                </button>

                <h2 className="text-3xl font-bold text-white mb-8 text-center">Checkout Details</h2>

                {/* Input Fields */}
                <div className="space-y-6 mb-8">
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-3 ml-1">
                    <MapPin size={18} className="text-[#D984B5]" />Address
                    </label>
                    <textarea
                    name="address"
                    rows="3"
                    placeholder="Enter complete address"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-[#D984B5] placeholder-white/50 resize-none backdrop-blur-md"
                    value={checkoutDetails.address}
                    onChange={handleCheckoutInputChange}
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-3 ml-1">
                    <Phone size={18} className="text-[#D984B5]" /> Phone Number
                    </label>
                    <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-[#D984B5] placeholder-white/50 backdrop-blur-md"
                    value={checkoutDetails.phone}
                    onChange={handleCheckoutInputChange}
                    />
                </div>
                </div>

                {/* Payment Option Buttons */}
                <div className="flex flex-col gap-4">
                <button
                    onClick={handleOnlinePaymentBtnClick}
                    className="w-full py-4 bg-gradient-to-r from-[#D984B5] to-[#AEE2FF] text-black rounded-2xl font-bold shadow-lg hover:shadow-[#D984B5]/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    <CreditCard size={20} /> Pay Now (Online)
                </button>

                <button
                    onClick={handleCODSubmit}
                    className="w-full py-4 bg-white/20 hover:bg-white/30 text-black border-2 border-white/30 rounded-2xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 backdrop-blur-md"
                >
                    <Building2 size={20} /> Pay on Spot (COD)
                </button>
                </div>
                <p className="text-center text-white text-sm mt-6 font-medium">
                Total Payable: ₹{total}
                </p>
            </div>
            </div>
        )}

        {/* --- REFUND POLICY CONFIRMATION MODAL (Friendly Version) --- */}
        {showRefundWarning && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#fdf2f8]/90 backdrop-blur-md transition-all">
            <div className="bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl border-4 border-white relative animate-in fade-in zoom-in duration-300 ring-1 ring-black/5">
                <button
                onClick={() => setShowRefundWarning(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full hover:bg-gray-100"
                >
                <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-tr from-[#D984B5] to-[#AEE2FF] p-4 rounded-full mb-6 shadow-lg shadow-[#D984B5]/30 transform hover:scale-110 transition-transform duration-500">
                    <Info size={40} className="text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Just a Quick Note!</h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">
                    We are so excited to have you! ✨ <br/>
                    To secure your spot, please confirm you understand that this enrollment is <span className="font-bold text-[#D984B5]">non-refundable</span>.
                </p>

                <div className="flex gap-3 w-full">
                    <button
                    onClick={() => setShowRefundWarning(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors text-sm"
                    >
                    Wait, Go Back
                    </button>
                    
                    <button
                    onClick={() => {
                        setShowRefundWarning(false);
                        startRazorpayFlow(); 
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D984B5] to-[#AEE2FF] text-white rounded-2xl font-bold shadow-lg hover:shadow-[#D984B5]/40 transition-all hover:scale-105 text-sm"
                    >
                    Yes, I Agree!
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}

        </div>
    );
    };

    export default Cart;