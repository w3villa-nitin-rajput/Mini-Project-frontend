import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const { currency, userData, subscribe, user, setShowUserLogin, plans } = useAppContext();
    const navigate = useNavigate();

    const handleSubscribe = async (planId) => {
        if (!user) {
            setShowUserLogin(true);
            return;
        }

        const currentPlanType = userData?.plan || 'free';
        if (planId === 'free' || planId === currentPlanType) return;

        try {
            console.log("Subscribing to plan:", planId);
            const data = await subscribe(planId);
            console.log("Subscription response:", data);
            if (data && data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                console.error("No checkout_url found in response data:", data);
            }
        } catch (error) {
            console.error("Subscription failed error:", error);
        }
    };

    return (
        <div className="py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
                <p className="text-lg text-gray-600">Unlock bigger discounts and better prices with our premium plans.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {plans.map((plan) => {
                    const currentPlanType = userData?.plan || 'free';
                    const isCurrentPlan = currentPlanType === plan.plan_type;
                    const expiresAt = userData?.plan_expires_at ? new Date(userData.plan_expires_at).toLocaleDateString() : '';

                    return (
                    <div
                        key={plan.id}
                        className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${plan.popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-gray-200 shadow-sm'
                            } ${plan.color || 'bg-white'}`}
                    >
                        {plan.popular && (
                            <span className="absolute top-0 right-8 transform -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                Most Popular
                            </span>
                        )}

                        <h3 className={`text-2xl font-bold mb-2 ${plan.text_color || 'text-gray-900'}`}>{plan.name}</h3>
                        <div className="flex items-baseline mb-4">
                            <span className="text-4xl font-extrabold text-gray-900">{currency}{plan.price}</span>
                            <span className="text-gray-500 ml-1">/ {plan.plan_type === 'free' ? 'forever' : 'one-time'}</span>
                        </div>

                        <p className="text-gray-600 mb-6 font-medium">Valid for: {plan.duration_hours > 0 ? `${plan.duration_hours} Hours` : 'Unlimited'}</p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-gray-700">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {plan.benefit}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Instant Activation
                            </li>
                        </ul>

                        <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isCurrentPlan}
                            className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 ${isCurrentPlan
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed text-sm'
                                : plan.popular
                                    ? 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
                                    : 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white'
                                }`}
                        >
                            {isCurrentPlan 
                                ? (expiresAt ? `Subscribed until ${expiresAt}` : 'Current Plan') 
                                : plan.plan_type === 'free' ? 'Get Started' : 'Subscribe Now'}
                        </button>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default Pricing;
