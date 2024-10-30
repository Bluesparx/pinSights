import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Login = () => {
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');

        if (token) {
            setAccessToken(token);
        } else {
            const query = new URLSearchParams(window.location.search);
            const authorizationCode = query.get('code');

            if (authorizationCode) {
                exchangeCodeForAccessToken(authorizationCode);
            }
        }
    }, []);

    const handlePinterestAuth = () => {
        const redirectUrl = import.meta.env.VITE_PINTEREST_REDIRECT_URI;

        const authorizationUrl = `https://www.pinterest.com/oauth/?client_id=${
            import.meta.env.VITE_PINTEREST_CLIENT_ID
        }&redirect_uri=${redirectUrl}&response_type=code&scope=user_accounts:read,boards:read,pins:read`;

        window.location.href = authorizationUrl;
    };

    const exchangeCodeForAccessToken = async (authorizationCode) => {
        try {
            const redirectUri = import.meta.env.VITE_PINTEREST_REDIRECT_URI;

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND}/oauth`,
                {
                    code: authorizationCode,
                    redirect_uri: redirectUri,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const { access_token } = response.data;

            if (!access_token) {
                throw new Error('No access token received from server');
            }

            setAccessToken(access_token);
            sessionStorage.setItem('accessToken', access_token);
            window.location.href = '/callback';
        } catch (err) {
            console.error('Pinterest OAuth error:', {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message,
            });
            setError(
                err.response
                    ? err.response.data.message || 'Failed to authenticate. Please try again.'
                    : 'Network error. Please try again.'
            );
        }
    };

    return (
        <>
        <Navbar/>
        <div className='max-h-screen flex items-center justify-center mt-28 pb-16 max-w-100'>
            <div className='w-full max-w-2xl p-10 rounded-lg border border-white/10 shadow 
                shadow-red-600 bg-white/20 bg-opacity-30 backdrop-blur-xl text-center'>
                <h1 className="text-3xl text-white font-bold mb-6 text-center">Pinsights</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <p className='text-l text-gray-100 p-2 mb-2'> Get AI-generated review based on your saves in pinterest.</p>
                <button
                    onClick={handlePinterestAuth}
                    className="bg-red-600 max-w-64 hover:bg-red-700 text-white font-bold py-2 my-3 rounded-full w-full pr-2 pl-2 transition duration-200"
                >
                    Authorize with Pinterest
                </button>

                <div className="mt-6">
                    <p className="text-sm text-gray-100">
                        By logging in, you agree to our 
                        <a href="/privacy-policy" className="text-red-600 hover:underline"> Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;
