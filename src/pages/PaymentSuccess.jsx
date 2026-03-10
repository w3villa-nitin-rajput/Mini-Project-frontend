import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const { loadUserProfileData, fetchProducts } = useAppContext();

    useEffect(() => {
        // Refresh user data and products to reflect the new plan
        loadUserProfileData();
        fetchProducts();
    }, [loadUserProfileData, fetchProducts]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for subscribing! Your plan has been activated. You can now enjoy exclusive discounts on all our products.
                </p>
                <div className="space-y-4">
                    <Link
                        to="/products"
                        className="block w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
                    >
                        Start Shopping
                    </Link>
                    <Link
                        to="/"
                        className="block w-full py-3 text-gray-600 font-medium hover:text-gray-900 transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
