import React from 'react';
import PrivacyPolicy from './Policy';
import Navbar from './Navbar';
import background from '../assets/background.png';
import Footer from './Footer';

const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', 
    height: '100vh',
    width: '100%',
};
const Privacy = () => {
    return (
        <div
        className="w-full h-full bg-cover bg-center flex items-center justify-center"
         style={backgroundStyle}>
        <Navbar/>
        <div className='flex items-center justify-center my-28'>
            <div className='mt-16 rounded-lg  
                 bg-black bg-opacity-80 backdrop-blur-xl max-w-3xl p-6'>
                <h1 className="text-3xl text-white font-bold mb-6 text-center font-[Ariel]">Privacy Policy</h1>
                <PrivacyPolicy />
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default Privacy;
