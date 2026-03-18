import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { userService } from '../api/api';
import { FaGoogle } from 'react-icons/fa6';

const LoginPopup = () => {
    const { setShowUserLogin, setToken, setUser } = useAppContext();
    const [state, setState] = useState('Login');
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleAuthSuccess = (token) => {
        if (localStorage.getItem("token")) {
            localStorage.removeItem("token");
        }
        localStorage.setItem("token", token);
        setToken(token);
        setUser(true);
        setShowUserLogin(false);
        toast.success("Welcome back!");
    };

    const onLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = state === "Login"
                ? await userService.login(data)
                : await userService.register(data);

            const res = response.data;

            if (res.token) {
                handleAuthSuccess(res.token);
            } else if (!res.email_verified) {
                toast.warning("Please verify your email.");
                setShowUserLogin(false);
                navigate('/verify');
            }
        } catch (error) {
            const message = error || "Something went wrong";

            if (error.response?.status === 403) {
                toast.warning("Please verify your email before logging in.");
                setShowUserLogin(false);
                navigate('/verify');
            } else {
                toast.error(message); // Pass string, not the whole error object
            }
        } finally {
            setLoading(false);
        }
    };

    const googleLoginHandler = () => {
        // Use the backend URL from environment variables, falling back to localhost if not set
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        window.location.href = `${backendUrl}/auth/google_oauth2`;
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Increased max-w-md (448px) and added p-10 for more breathing room */}
            <form onSubmit={onLogin} className="bg-white w-[90%] max-w-md p-10 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-8 text-black">
                    <h2 className="text-2xl font-bold">{state}</h2>
                    <IoClose
                        onClick={() => setShowUserLogin(false)}
                        className="w-8 h-8 cursor-pointer hover:bg-gray-100 rounded-full transition p-1.5"
                    />
                </div>

                {/* Increased gap from 4 to 5 for taller appearance */}
                <div className="flex flex-col gap-5">
                    {state === "Sign Up" && (
                        <input name="name" onChange={onChangeHandler} value={data.name} className="border border-gray-300 p-3 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" type="text" placeholder="Your name" required />
                    )}
                    <input name="email" onChange={onChangeHandler} value={data.email} className="border border-gray-300 p-3 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" type="email" placeholder="Email address" required />
                    <input name="password" onChange={onChangeHandler} value={data.password} className="border border-gray-300 p-3 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary" type="password" placeholder="Password" required />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-primary text-white py-3.5 rounded-xl mt-8 hover:bg-primary/90 transition font-bold text-lg shadow-md hover:shadow-lg disabled:bg-gray-400"
                >
                    {loading ? "Processing..." : (state === "Sign Up" ? "Create account" : "Login")}
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <button
                    type="button"
                    onClick={googleLoginHandler}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3.5 rounded-xl hover:bg-gray-50 transition font-semibold text-gray-700 cursor-pointer"
                >
                    <FaGoogle className="text-xl text-red-500" />
                    <span>Continue with Google</span>
                </button>

                <div className="mt-8 text-base text-gray-600 text-center">
                    {state === "Login" ? (
                        <p>Don't have an account? <span className="text-primary cursor-pointer font-bold hover:underline" onClick={() => setState("Sign Up")}>Sign up</span></p>
                    ) : (
                        <p>Already have an account? <span className="text-primary cursor-pointer font-bold hover:underline" onClick={() => setState("Login")}>Login here</span></p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPopup;