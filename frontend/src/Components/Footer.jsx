import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black/30  text-red-600 shadow-lg fixed bottom-0 w-full z-50">
            <div className="max-w-6xl mx-auto px-2">
            <div className="flex justify-center items-center h-8">
            <p className="text-sm text-gray-800 dark:text-gray-200">
                Copyright ©<a href='https://naziahassan.vercel.app'> Nazia Hassan</a> 2024
            </p>
            </div>
            </div>
        </footer>
    );
};

export default Footer;
