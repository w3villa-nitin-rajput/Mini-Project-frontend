import React from 'react';
import { NavLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-gray-800/50 mt-20">
            <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <NavLink to="/" className="inline-block">
                            <img className="h-9 brightness-110" src="https://greencart-gs.vercel.app/assets/logo-CMLzTNjw.svg" alt="GreenCart" />
                        </NavLink>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Experience the freshest produce delivered straight from the farms to your doorstep. Quality and health in every bite.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:text-primary hover:border-primary/30 transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:text-primary hover:border-primary/30 transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:text-primary hover:border-primary/30 transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Explore</h3>
                        <ul className="space-y-4 text-sm">
                            <li><NavLink to="/" className="hover:text-primary transition-colors">Home</NavLink></li>
                            <li><NavLink to="/products" className="hover:text-primary transition-colors">All Products</NavLink></li>
                            <li><NavLink to="/about" className="hover:text-primary transition-colors">About Us</NavLink></li>
                            <li><NavLink to="/contact" className="hover:text-primary transition-colors">Contact</NavLink></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Service</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">My Account</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Wishlist</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Shipping Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>123 Fresh Lane, Garden City<br />California, 90210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary" />
                                <span>+1 (555) 000-1234</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary" />
                                <span className="truncate">support@greencart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} GreenCart Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300">Terms of Service</a>
                        <a href="#" className="hover:text-gray-300">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
