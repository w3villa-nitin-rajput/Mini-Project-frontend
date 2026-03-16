import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { orderService } from '../api/api';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const { currency, token } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            console.log("Fetching orders");
            
            const response = await orderService.getOrders();
            console.log("Orders response:", response);
            console.log("Orders response data:", response.data);
            console.log("Orders response data orders:", response.data.orders);

            if (response.data && response.data.orders) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="pt-20 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-screen mb-20">
            <div className="flex flex-col gap-2 mb-10">
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-500">Track and manage your recent purchases and delivery status.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <img src={assets.box_icon} className="w-12 h-12 opacity-80" alt="empty orders" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700">No orders yet</h2>
                    <p className="text-gray-500 mt-2">You haven't placed any orders yet. Start shopping to fill this space!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="bg-gray-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Order Placed</p>
                                        <p className="text-sm font-bold text-gray-700">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Total Amount</p>
                                        <p className="text-sm font-bold text-primary">{currency}{order.total}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Ship To</p>
                                        <p className="text-sm font-bold text-gray-700 truncate max-w-[150px]">{order.shipping_address}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Order ID</p>
                                    <p className="text-sm font-bold text-gray-500">#{order.id}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="flex flex-col gap-6">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 p-2 overflow-hidden border border-gray-100">
                                                <img 
                                                    className="w-full h-full object-contain" 
                                                    src={item.image || assets.box_icon} 
                                                    alt={item.name} 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-semibold text-primary">{currency}{item.price}</p>
                                                </div>
                                            </div>
                                            <div className="hidden sm:flex flex-col items-end justify-center min-w-[120px]">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-primary'}`}></span>
                                                    <p className="text-sm font-bold text-gray-700 capitalize">{order.status}</p>
                                                </div>
                                                <button onClick={fetchOrders} className="mt-2 text-xs font-semibold text-primary hover:underline border border-primary/20 bg-primary/5 px-3 py-1 rounded-full cursor-pointer">
                                                    Track Item
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Footer - Mobile Status Only */}
                            <div className="sm:hidden px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-primary'}`}></span>
                                    <p className="text-sm font-bold text-gray-700 capitalize">{order.status}</p>
                                </div>
                                <button onClick={fetchOrders} className="text-xs font-semibold text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">
                                    Track Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
