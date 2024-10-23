import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Review = ({ accessToken }) => {
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReview = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await axios.post(`${import.meta.env.VITE_APPWRITE_API_URL}/fetchPins`, {
                    accessToken,
                });
                setReview(response.data.review);
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
        <div>
            <h2>Your Collective Review</h2>
            <p>{review}</p>
        </div>
    );
};

export default Review;
