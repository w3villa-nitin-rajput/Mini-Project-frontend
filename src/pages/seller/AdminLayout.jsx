import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Box, Tags, ShoppingCart, LogOut, Home } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AdminLayout = () => {
    const { user, userData, setToken, setUser, setUserData } = useAppContext();
    const navigate = useNavigate();

    // Redirect unauthenticated users and non-admins
    React.useEffect(() => {
        if (!user && !localStorage.getItem('token')) {
            navigate('/');
        } else if (userData && userData.role !== 'admin' && userData.role !== 1) {
            navigate('/');
        }
    }, [user, userData, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser(false);
        setUserData(null);
        navigate("/");
    };

    const navItems = [
        { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
        { name: 'Users', path: '/seller/users', icon: Users },
        { name: 'Categories', path: '/seller/categories', icon: Tags },
        { name: 'Products', path: '/seller/products', icon: Box },
        { name: 'Orders', path: '/seller/orders', icon: ShoppingCart },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 bg-gray-950 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-white tracking-widest text-center">
                        ADMIN PANEL
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/seller'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary text-white font-medium shadow-md'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800 flex flex-col gap-2">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Back to Store
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-900/50 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

// admin@zepto.com
//password123
