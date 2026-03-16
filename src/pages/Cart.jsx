import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, getCartAmount } = useAppContext();
    const [cartData, setCartData] = useState([]);
    const navigate = useNavigate();

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
        }
    }, [cartItems, products]);

    const delivery_fee = 30;

    return (
        <div className="pt-14 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-screen mb-20 animate-fade-in ">
            <div className="text-2xl mb-3">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                <p className="text-gray-500 text-sm">Review your selected items and proceed to checkout.</p>
            </div>

            <div className="mt-10 flex flex-col lg:flex-row gap-10">
                {/* Cart Items List */}
                <div className="flex-1">
                    {cartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <img src={assets.cart_icon} className="w-12 h-12 opacity-20" alt="empty cart" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
                            <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
                            <button
                                onClick={() => navigate('/products')}
                                className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-md cursor-pointer"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartData.map((item, index) => {
                                const productData = products.find((product) => (product._id || product.id).toString() === item._id.toString());

                                if (!productData) return null;

                                return (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden p-2">
                                            <img
                                                className="w-full h-full object-contain"
                                                src={productData.image_urls?.[0] || productData.image?.[0]}
                                                alt={productData.name}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{productData.name}</h3>
                                                    <p className="text-sm text-gray-500">{productData.category}</p>
                                                </div>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 0)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    <img className="w-5" src={assets.remove_icon} alt="remove" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-2 font-bold text-primary text-lg">
                                                    {currency}{productData.offer_price || productData.offerPrice}
                                                </div>

                                                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-500 transition-all font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-6 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-500 transition-all font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {cartData.length > 0 && (
                    <div className="w-full lg:w-96">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">{currency}{getCartAmount()}.00</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Fee</span>
                                    <span className="font-semibold">{currency}{delivery_fee}.00</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full mt-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <img src={assets.trust_icon} className="w-4" alt="secure" />
                                <span>Secure Checkout | Fast Delivery</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
