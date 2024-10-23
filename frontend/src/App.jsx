import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Review from './Components/Dashboard';

const App = () => {
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken'); 
        if (token) {
            setAccessToken(token);
        }
    }, []);

    const handlePinterestAuth = () => {
        const redirectUrl = `https://api.pinterest.com/oauth/?client_id=${import.meta.env.VITE_PINTEREST_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_PINTEREST_REDIRECT_URI}&response_type=code&scope=read_public,write_public`;
        window.location.href = redirectUrl;
    };

    const handleFetchPins = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APPWRITE_API_URL}/fetchPins`, {
                accessToken,
            });

            // Handle response as needed
            console.log(response.data);
        } catch (err) {
            console.error('Error fetching pins:', err);
            setError('Error fetching pins. Please try again.');
        }
    };

    return (
        <div>
            <h1>Pin Insights</h1>
            {!accessToken ? (
                <button onClick={handlePinterestAuth}>Login with Pinterest</button>
            ) : (
                <div>
                    <p>Logged in! Access Token: {accessToken}</p>
                    <button onClick={handleFetchPins}>Fetch Pins</button>
                    <Review accessToken={accessToken} />
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default App;
