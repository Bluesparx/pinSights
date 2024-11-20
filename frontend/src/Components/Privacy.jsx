import React from 'react';
import PrivacyPolicy from './Policy';
import Navbar from './Navbar';
import background from '../assets/background.png';

const Privacy = () => {
    return (
        <div
        className="w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${background})` }}
    >
        <Navbar/>
        <div className='flex items-center justify-center my-28'>
            <div className=' mt-16 rounded-lg border border-white/10 shadow 
                shadow-red-600 bg-red-50 bg-opacity-30 backdrop-blur-lg max-w-3xl p-6'>
                <h1 className='text-center mb-4 text-2xl text-red-800'>
                    Privacy Policy
                </h1>
                <PrivacyPolicy />
            </div>
        </div>
        </div>
    );
};

export default Privacy;
