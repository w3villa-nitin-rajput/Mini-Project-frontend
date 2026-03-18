import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { orderService } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMapPin, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const Checkout = () => {
    const { products, currency, cartItems, getCartAmount, userData } = useAppContext();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [cartData, setCartData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData && userData.address) {
            setAddress(userData.address);
        }
    }, [userData]);

    useEffect(() => {
        if (products.length > 0) {
            const tempData = [];
            for (const items in cartItems) {
                if (cartItems[items] > 0) {
                    tempData.push({
                        _id: items,
                        quantity: cartItems[items]
                    });
                }
            }
            setCartData(tempData);
            if (tempData.length === 0) {
                navigate('/cart');
            }
        }
    }, [cartItems, products, navigate]);

    const delivery_fee = 30;
    const total_amount = getCartAmount() + delivery_fee;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address.trim()) {
            toast.error("Please enter a delivery address");
            return;
        }

        setLoading(true);
        try {
            const response = await orderService.createCheckoutSession(address);
            if (response.data && response.data.checkout_url) {
                window.location.href = response.data.checkout_url;
            }
        } catch (error) {
            console.error(error);
            toast.error(error || "Failed to initiate checkout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-screen mb-20 animate-fade-in">
            <div className="flex flex-col gap-2 mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-500">Review your order and select delivery address.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Side: Delivery Details */}
                <div className="flex-1 space-y-8">
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <FiMapPin className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
                        </div>

                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your full delivery address..."
                            rows={4}
                            className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2 italic">* This address will be used for this delivery only.</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <FiCreditCard className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
                        </div>
                        <div className="flex items-center justify-between p-4 border-2 border-primary bg-primary/5 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full border-4 border-primary"></div>
                                <span className="font-bold text-gray-800">Online Payment (Stripe)</span>
                            </div>
                            <FiCheckCircle className="text-primary w-6 h-6" />
                        </div>
                        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                            You will be redirected to Stripe to securely complete your payment. We support all major credit/debit cards and UPI.
                        </p>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full lg:w-[400px]">
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 sticky top-24 shadow-xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {cartData.map((item, index) => {
                                const productData = products.find((p) => (p._id || p.id).toString() === item._id.toString());
                                if (!productData) return null;

                                // FIX 1: Calculate item total and format to 2 decimals
                                const itemTotal = (item.quantity * (productData.offer_price || productData.price)).toFixed(2);

                                return (
                                    <div key={index} className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 border border-gray-100 flex-shrink-0">
                                            <img src={productData.image_urls?.[0] || productData.image?.[0]} className="w-full h-full object-contain" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-800 truncate">{productData.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-700">{currency}{itemTotal}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                {/* FIX 2: Removed manual .00 and added .toFixed(2) */}
                                <span className="font-semibold">{currency}{getCartAmount().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fee</span>
                                {/* FIX 3: Added .toFixed(2) */}
                                <span className="font-semibold">{currency}{delivery_fee.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-gray-100 my-4"></div>
                            <div className="flex justify-between text-xl font-bold text-gray-900">
                                <span>Total</span>
                                {/* FIX 4: Formatted the final total_amount constant */}
                                <span className="text-primary">{currency}{total_amount.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : "Pay & Place Order"}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            <span>100% Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
