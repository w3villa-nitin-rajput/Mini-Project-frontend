import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/api';
import { Users, Box, ShoppingCart, DollarSign } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currency } = useAppContext();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await adminService.getDashboardStats();
                setStats(response.data.stats);
                setRecentOrders(response.data.recent_orders || []);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const statCards = [
        { title: 'Total Revenue', value: `${currency}${Number(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Total Orders', value: stats?.orders || 0, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Total Products', value: stats?.products || 0, icon: Box, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { title: 'Total Users', value: stats?.users || 0, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="space-y-8 animate-fade-in text-gray-100">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back, Admin</h1>
                <p className="text-gray-400">Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-gray-800 border border-gray-700/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table (Snippet) */}
            <div className="bg-gray-800 border border-gray-700/50 rounded-xl shadow-sm overflow-hidden mt-8">
                <div className="px-6 py-5 border-b border-gray-700/50 bg-gray-800/80">
                    <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4 text-gray-300">#{order.id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{order.user?.name || 'Guest'}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-white">{currency}{Number(order.total).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
