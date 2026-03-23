import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ products }) => {
    if (!products || products.length === 0) return null;
    console.log(products);


    const { currency, cartItems, addToCart, updateQuantity } = useAppContext();
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-between mt-9">
            {products.map((item, index) => {
                const itemId = item.id;
                const quantity = cartItems[itemId] || 0;

                return (
                    <div key={itemId || index} className="border border-gray-500/20 rounded-md max-w-54 md:px-4 px-3 py-2">

                        {/* Image Section — clickable to navigate */}
                        <div
                            className="group cursor-pointer flex items-center justify-center px-2 h-40 overflow-hidden" // Added overflow-hidden
                            onClick={() => navigate(`/products/${itemId}`)}
                        >
                            <img
                                className="group-hover:scale-105 transition-transform duration-300 max-w-full max-h-full object-contain" // Changed to max-h-full
                                src={item.cloudinary_url || item.image_urls?.[0] || item.image?.[0]}
                                alt={item.name}
                            />
                        </div>

                        <div className="text-gray-500/60 text-sm mt-2">
                            <p>{item.category}</p>
                            {/* Product name — also navigates */}
                            <p
                                className="text-gray-700 font-medium text-lg truncate w-full cursor-pointer hover:text-primary transition-colors duration-150"
                                onClick={() => navigate(`/products/${itemId}`)}
                            >
                                {item.name}
                            </p>

                            {/* Star Ratings */}
                            <div className="flex items-center gap-0.5">
                                {Array(5).fill('').map((_, i) => (
                                    <img
                                        key={i}
                                        className="md:w-3.5 w-3"
                                        src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                                        alt="star"
                                    />
                                ))}
                                <p className="ml-1">(4)</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                                <p className="md:text-[16px] text-base font-semibold text-primary break-all">
                                    {currency}{item.discounted_price}
                                    <span className="ml-1 sm:ml-2 text-gray-400 md:text-sm text-xs line-through font-normal">
                                        {currency}{item.price}
                                    </span>
                                </p>

                                {/* Add Button */}
                                <div className="text-primary shrink-0">
                                    {quantity === 0 ? (
                                        <button
                                            className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/20 text-primary md:w-14 w-14 h-8 rounded font-medium"
                                            onClick={(e) => { e.stopPropagation(); addToCart(itemId); }}
                                        >
                                            <CiShoppingCart className="text-xl" />
                                            Add
                                        </button>
                                    ) : (
                                        <div
                                            className="flex items-center justify-between px-1 gap-1 md:w-16 w-16 h-8 bg-indigo-500/25 rounded select-none"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => updateQuantity(itemId, quantity - 1)}
                                                className="cursor-pointer text-md h-full flex items-center justify-center w-5"
                                            >
                                                -
                                            </button>
                                            <span className="w-5 text-center text-sm">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(itemId, quantity + 1)}
                                                className="cursor-pointer text-md h-full flex items-center justify-center w-5"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductCard;