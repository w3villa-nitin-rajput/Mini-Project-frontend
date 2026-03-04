import { useState, useCallback, memo } from "react";
import { CiSearch } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { TbMenuDeep } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { FaRegCircleUser } from "react-icons/fa6";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user, setUser, setShowUserLogin, setToken, setUserData } = useAppContext();
    const navigate = useNavigate()

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken("");
        setUser(false);
        console.log("Logout successful: States cleared and redirected.");
        navigate('/');

    }, [setToken, setUser, setUserData, navigate]);

    const toggleMenu = useCallback(() => {
        setOpen(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setOpen(false);
    }, []);


    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all shadow-2xl">
            <NavLink to={'/'} onClick={closeMenu}>
                <img className="h-9" src="https://greencart-gs.vercel.app/assets/logo-CMLzTNjw.svg" alt="greencart" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to={'/'}>Home</NavLink>
                {user && <NavLink to={'/myOrders'}>My Orders</NavLink>}
                <NavLink to={'/product'} onClick={closeMenu}>Products</NavLink>
                <NavLink to={'/contact'}>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                    />
                    <CiSearch className="w-4 h-4" />
                </div>

                <div
                    onClick={() => navigate('/')}
                    className="relative cursor-pointer hover:opacity-80 transition"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && navigate('/')}
                >
                    <FiShoppingCart className="h-6 w-6" />
                    <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-4.5 h-4.5 rounded-full flex items-center justify-center">
                        3
                    </span>
                </div>

                {!user ? (
                    <button
                        onClick={() => setShowUserLogin(true)}
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
                    >
                        Login
                    </button>
                ) : (
                    <div className="relative group inline-block">
                        <FaRegCircleUser className="h-7 w-7 cursor-pointer" />
                        <div className="cursor-pointer absolute right-0 top-full hidden group-hover:block z-50 bg-white shadow-lg rounded-md p-2 min-w-30">
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full text-left cursor-pointer px-4 py-1 bg-white text-gray-800 rounded hover:bg-gray-100 text-sm mb-1"
                            >
                                My Profile
                            </button>
                            <button
                                onClick={logout}
                                className="w-full cursor-pointer px-4 py-1 bg-primary text-white rounded hover:bg-primary-dull text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ Optimized mobile menu button */}
            <button
                onClick={toggleMenu}
                onTouchEnd={toggleMenu} // Added touch support
                aria-label="Menu"
                className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                aria-expanded={open}
            >
                <TbMenuDeep className="w-7 h-7" />
            </button>

            {/* ✅ Mobile Menu with better transition */}
            <div
                className={`
                    absolute top-15 left-0 w-full bg-white shadow-md py-4 
                    flex-col items-start gap-2 px-5 text-sm md:hidden z-50
                    transition-all duration-200 ease-in-out
                    ${open ? 'flex opacity-100 visible' : 'hidden opacity-0 invisible'}
                `}
                style={{ top: '60px' }}
            >
                <NavLink to={'/'} onClick={closeMenu}>Home</NavLink>
                {user && (
                    <NavLink to={'/products'} onClick={closeMenu}>My Orders</NavLink>
                )}
                <NavLink to={'/product'} onClick={closeMenu}>Products</NavLink>
                <NavLink to={'/contact'} onClick={closeMenu}>Contact</NavLink>

                {!user ? (
                    <button
                        onClick={() => {
                            closeMenu();
                            setShowUserLogin(true);
                        }}
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
                    >
                        Login
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            closeMenu();
                            logout();
                        }}
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default memo(Navbar); 