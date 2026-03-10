import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <XCircle className="w-20 h-20 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
                <p className="text-gray-600 mb-8">
                    Your payment was not processed. No charges were made to your account. You can try again whenever you're ready.
                </p>
                <div className="space-y-4">
                    <Link
                        to="/pricing"
                        className="block w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md hover:shadow-lg"
                    >
                        Try Again
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

export default PaymentCancel;
