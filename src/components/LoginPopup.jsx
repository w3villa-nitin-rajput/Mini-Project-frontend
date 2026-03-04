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
            const message = error.response?.data?.message || "Something went wrong";
            
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
        // Direct redirection to backend OAuth route
        window.location.href = "http://localhost:3000/auth/google_oauth2";
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <form onSubmit={onLogin} className="bg-white w-[90%] max-w-[350px] p-8 rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6 text-black">
                    <h2 className="text-xl font-semibold">{state}</h2>
                    <IoClose
                        onClick={() => setShowUserLogin(false)}
                        className="w-7 h-7 cursor-pointer hover:text-red-500 transition p-1"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    {state === "Sign Up" && (
                        <input name="name" onChange={onChangeHandler} value={data.name} className="border border-gray-300 p-2.5 rounded outline-none focus:border-primary" type="text" placeholder="Your name" required />
                    )}
                    <input name="email" onChange={onChangeHandler} value={data.email} className="border border-gray-300 p-2.5 rounded outline-none focus:border-primary" type="email" placeholder="Email address" required />
                    <input name="password" onChange={onChangeHandler} value={data.password} className="border border-gray-300 p-2.5 rounded outline-none focus:border-primary" type="password" placeholder="Password" required />
                </div>

                <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-primary text-white py-2.5 rounded-md mt-6 hover:bg-primary/90 transition font-medium disabled:bg-gray-400"
                >
                    {loading ? "Processing..." : (state === "Sign Up" ? "Create account" : "Login")}
                </button>

                <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-gray-400 text-xs">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* --- Unified Google Button --- */}
                <button 
                    type="button"
                    onClick={googleLoginHandler}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-md hover:bg-gray-50 transition font-medium text-gray-700 cursor-pointer"
                >
                    <FaGoogle className="text-primary" />
                    <span>Continue with Google</span>
                </button>

                <div className="mt-6 text-sm text-gray-600 text-center">
                    {state === "Login" ? (
                        <p>Create a new account? <span className="text-primary cursor-pointer font-medium hover:underline" onClick={() => setState("Sign Up")}>Click here</span></p>
                    ) : (
                        <p>Already have an account? <span className="text-primary cursor-pointer font-medium hover:underline" onClick={() => setState("Login")}>Login here</span></p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginPopup;