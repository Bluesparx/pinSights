import React from 'react';
import PrivacyPolicy from './Policy';
import Navbar from './Navbar';

const Privacy = () => {
    return (
        <>
        <Navbar/>
        <div className='max-h-screen flex items-center justify-center mt-28 pb-16 max-w-100'>
            <div className='w-full max-w-2xl p-10 rounded-lg border border-white/10 shadow 
                shadow-red-600 bg-red-50 bg-opacity-30 backdrop-blur-xl'>
                <h1 className='text-center mb-4 text-2xl text-gray-200'>
                    Privacy Policy
                </h1>
                <PrivacyPolicy />
            </div>
        </div>
        </>
    );
};

export default Privacy;
