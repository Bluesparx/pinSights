import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
            import.meta.env.VITE_PINTEREST_CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=user_accounts:read,boards:read,pins:read`;
        
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
                        'Content-Type': 'application/json'
                    },
                }
            );
    
            const { access_token } = response.data;
    
            if (!access_token) {
                throw new Error('No access token received from server');
            }
    
            setAccessToken(access_token);
            sessionStorage.setItem('accessToken', access_token);
        } catch (err) {
            console.error('Pinterest OAuth error:', {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message
            });
            setError(
                err.response
                    ? err.response.data.message || 'Failed to authenticate. Please try again.'
                    : 'Network error. Please try again.'
            );
        }
    };    
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Pin Insights</h1>
                <button 
                    onClick={handlePinterestAuth}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Authorize with Pinterest
                </button>
            </div>
        </div>
    );
};

export default Login;
