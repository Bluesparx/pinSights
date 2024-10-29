import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Review = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReview = async () => {
            setLoading(true);
            setError('');

            if (!accessToken) {
                setError('Access token is required.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND}/fetch`, {
                    accessToken,
                });
                setReview(response);
            } catch (err) {
                console.error('Error fetching review:', err);
                setError('Error fetching review. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchReview();
        }
    }, [accessToken]);

    if (loading) return <p>Loading review...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className='flex flex-col'>
            <h2 className='bg-red text-lg'>Here's your Review</h2>
            <p>{review}</p>
        </div>
    );
};

export default Review;
