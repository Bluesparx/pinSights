import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const accessToken = sessionStorage.getItem('accessToken');

    const handleLogout = () => {
        sessionStorage.removeItem('accessToken');
        window.location.href = '/';
    };

    return (
        <nav className="bg-black/50 text-red-600 shadow-lg fixed top-0 left-0 w-full z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16">
                    <div className="flex space-x-4">
                        <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                        <Link to="/privacy-policy" className="text-white hover:text-gray-300">Privacy Policy</Link>
                        {accessToken ? (
                            <>
                                <Link to="/callback" className="text-white hover:text-gray-300">Review</Link>
                                <button onClick={handleLogout} className="hover:text-gray-300">
                                    Logout
                                </button>
                            </>
                        ) : (<></>)}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
