import React, { useState, useEffect } from 'react';
import { adminService } from '../../api/api';
import { toast } from 'react-toastify';
import { Search, ChevronLeft, ChevronRight, Shield, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const { userData } = useAppContext();

    console.log(users);
    

    const fetchUsers = async (pageToFetch) => {
        setLoading(true);
        try {
            const res = await adminService.getUsers(pageToFetch, 10);
            setUsers(res.data.users);
            setTotalPages(res.data.meta.total_pages);
            setPage(res.data.meta.current_page);
        } catch (err) {
            toast.error(err || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const toggleUserRole = async (userId, currentRole) => {
        // Prevent removing your own admin status
        if (userData && userData.id === userId) {
            toast.error("You cannot change your own role!");
            return;
        }

        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await adminService.updateUser(userId, { user: { role: newRole } });
            toast.success(`User role updated to ${newRole}`);
            fetchUsers(page); // Refresh list
        } catch (err) {
            toast.error(err || "Failed to update role");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in text-gray-100 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Users Management</h1>
                    <p className="text-sm text-gray-400">View and manage all registered users.</p>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-800 border-none rounded-lg text-sm text-white focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-64"
                    />
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700/50 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Contact</th>
                                <th className="px-6 py-4 font-medium">Status / Role</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Plan</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
                                        <p className="mt-2 text-sm">Loading users...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 shrink-0">
                                                    {user.cloudinary_url ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={user.cloudinary_url} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{user.name || 'No Name'}</div>
                                                    <div className="text-sm text-gray-400 sm:hidden">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    {user.email_verified ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                    <span className={`text-xs font-medium ${user.email_verified ? 'text-green-500' : 'text-red-500'}`}>
                                                        {user.email_verified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {user.role === 'admin' || user.role === 1 ? (
                                                        <ShieldAlert className="w-4 h-4 text-purple-500" />
                                                    ) : (
                                                        <Shield className="w-4 h-4 text-blue-500" />
                                                    )}
                                                    <span className={`text-xs font-medium ${user.role === 'admin' || user.role === 1 ? 'text-purple-400' : 'text-blue-400'}`}>
                                                        {user.role === 'admin' || user.role === 1 ? 'Admin' : 'User'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-sm">
                                            {user.plan? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize bg-blue-500/10 text-blue-400">
                                                    {user.plan}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">No Plan</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                onClick={() => toggleUserRole(user.id, user.role === 1 || user.role === 'admin' ? 'admin' : 'user')}
                                                className={`text-xs px-3 py-1.5 rounded-full transition-colors border ${user.role === 'admin' || user.role === 1
                                                    ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20'
                                                    }`}
                                            >
                                                {user.role === 'admin' || user.role === 1 ? 'Remove Admin' : 'Make Admin'}
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
        </div>
    );
};

export default UsersList;
