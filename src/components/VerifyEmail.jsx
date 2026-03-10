import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { userService } from '../api/api';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Added this
    const token = searchParams.get('token'); // Get token from URL

    const [status, setStatus] = useState(token ? 'verifying' : 'notice');

    // Handle the actual verification when the token is present
    useEffect(() => {
        if (token) {
            userService.verifyEmail(token)
                .then(() => {
                    toast.success("Verifying your account...");
                    setStatus('success');
                    toast.success("email verified successfully");
                })
                .catch((err) => {
                    setStatus('error');
                    toast.error(err);
                });
        }
    }, [token]);

    const handleResend = async () => {
        const email = prompt("Please enter your email to resend the link:");
        if (!email) return;
        if (!email.includes("@")) return toast.error("Invalid email");

        try {
            await userService.resendVerificationEmail(email);
            toast.success(`Link resent to ${email}`);
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">

                {/* PHASE 1: JUST SIGNED UP (NO TOKEN) */}
                {status === 'notice' && (
                    <div className="space-y-4">
                        <div className="text-primary text-5xl font-bold">✉️</div>
                        <h2 className="text-2xl font-bold text-gray-800">Check Your Mail</h2>
                        <p className="text-gray-600">We sent a verification link. Please check your inbox.</p>
                        <button onClick={handleResend} className="text-sm text-primary hover:underline font-medium">
                            Didn't receive an email? Resend link
                        </button>
                    </div>
                )}

                {/* PHASE 2: VERIFYING (USER CLICKED LINK) */}
                {status === 'verifying' && <h2 className="text-xl animate-pulse">Verifying your account...</h2>}

                {/* PHASE 3: SUCCESS */}
                {status === 'success' && (
                    <div className="space-y-4">
                        <div className="text-green-500 text-5xl">✅</div>
                        <h2 className="text-2xl font-bold">Email Verified!</h2>
                        <p>You can now log in to your account.</p>
                    </div>
                )}

                {/* PHASE 4: ERROR */}
                {status === 'error' && (
                    <div className="space-y-4">
                        <div className="text-red-500 text-5xl">❌</div>
                        <h2 className="text-2xl font-bold">Verification Failed</h2>
                        <p>The link might be expired or invalid.</p>
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition mt-6"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default VerifyEmail;
// nitinrajput824859@gmail.com