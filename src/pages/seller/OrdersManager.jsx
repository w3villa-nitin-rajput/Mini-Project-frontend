import React, { useState, useEffect } from 'react';
import { adminService } from '../../api/api';
import { toast } from 'react-toastify';
import { ShoppingBag, Search, ChevronLeft, ChevronRight, Filter, Eye, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const OrdersManager = () => {
    const { currency } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    // Modal state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrders = async (pageToFetch, status = statusFilter) => {
        setLoading(true);
        try {
            const res = await adminService.getOrders(pageToFetch, 10, status);
            setOrders(res.data.orders);
            setTotalPages(res.data.meta.total_pages);
            setPage(res.data.meta.current_page);
        } catch (err) {
            toast.error(err || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page, statusFilter);
    }, [page, statusFilter]);

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const handleViewOrder = async (order) => {
        try {
            const res = await adminService.getOrder(order.id);
            setSelectedOrder(res.data);
        } catch (err) {
            toast.error("Failed to fetch order details");
        }
    };

    const handleUpdateOrderStatus = async (newStatus) => {
        if (!selectedOrder) return;
        setIsUpdating(true);
        try {
            await adminService.updateOrderStatus(selectedOrder.id, { order: { status: newStatus } });
            toast.success(`Order status updated to ${newStatus}`);
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            fetchOrders(page, statusFilter); // Refresh list
        } catch (err) {
            toast.error(err || "Failed to update order status");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
            delivered: "bg-green-500/10 text-green-500 border-green-500/20",
            cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
        };
        return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase ${statusConfig[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20"}`;
    };

    return (
        <div className="space-y-6 animate-fade-in text-gray-100 h-full flex flex-col relative">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Orders Management</h1>
                    <p className="text-sm text-gray-400">Track and manage customer orders.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="pl-10 pr-8 py-2.5 bg-gray-800 border-none rounded-lg text-sm text-white focus:ring-2 focus:ring-primary appearance-none cursor-pointer w-full sm:w-48"
                        >
                            <option value="">All Statuses</option>
                            <option value="0">Pending</option>
                            <option value="1">Confirmed</option>
                            <option value="2">Shipped</option>
                            <option value="3">Delivered</option>
                            <option value="4">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700/50 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Date</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
                                        <p className="mt-2 text-sm">Loading orders...</p>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-400">
                                            {new Date(order.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">{order.user?.name || 'Guest'}</div>
                                            <div className="text-xs text-gray-400">{order.user?.email || ''}</div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-white">
                                            {currency}{Number(order.total).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadge(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-lg text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-900/30 flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{totalPages}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700/80 bg-gray-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    Order #{selectedOrder.id}
                                    <span className={getStatusBadge(selectedOrder.status)}>
                                        {selectedOrder.status}
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition-colors bg-gray-700/50 p-1.5 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-primary" /> Order Items
                                    </h3>
                                    <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-800/80 text-gray-400">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium">Item</th>
                                                    <th className="px-4 py-3 font-medium text-center">Qty</th>
                                                    <th className="px-4 py-3 font-medium text-right">Price</th>
                                                    <th className="px-4 py-3 font-medium text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700/50">
                                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                                    selectedOrder.items.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-4 py-3 text-white">{item.name}</td>
                                                            <td className="px-4 py-3 text-center text-gray-300">{item.quantity}</td>
                                                            <td className="px-4 py-3 text-right text-gray-300">{currency}{item.price}</td>
                                                            <td className="px-4 py-3 text-right font-medium text-white">{currency}{item.price * item.quantity}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="4" className="px-4 py-4 text-gray-400 text-center">No items data available</td></tr>
                                                )}
                                            </tbody>
                                            <tfoot className="bg-gray-800/50 border-t border-gray-700 font-semibold">
                                                <tr>
                                                    <td colSpan="3" className="px-4 py-3 text-right text-white">Grand Total</td>
                                                    <td className="px-4 py-3 text-right text-primary">{currency}{Number(selectedOrder.total).toLocaleString()}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">Name</p>
                                            <p className="text-white font-medium">{selectedOrder.user?.name || 'Guest'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Email</p>
                                            <p className="text-white">{selectedOrder.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Shipping Info</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">Address</p>
                                            <p className="text-white">{selectedOrder.shipping_address || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Payment Method</p>
                                            <p className="text-white font-medium">{selectedOrder.payment_method || 'COD'} <span className={`text-xs ml-2 px-2 py-0.5 rounded ${selectedOrder.payment_status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>{selectedOrder.payment_status || 'Pending'}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Update Status</h3>
                                    <div className="space-y-2">
                                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                                            <button
                                                key={status}
                                                disabled={isUpdating || selectedOrder.status === status}
                                                onClick={() => handleUpdateOrderStatus(status)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize border ${selectedOrder.status === status
                                                        ? 'bg-primary border-primary text-white cursor-default'
                                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManager;
