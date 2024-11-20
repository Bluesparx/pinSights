import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import background from '../assets/background.png';

const Review = () => {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const accessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    const fetchReview = async () => {
      if (!accessToken) {
        setError('Access token is required.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND}/fetch`, {
          accessToken,
        });

        if (response.data) {
          setReview(response.data);
        } else {
          throw new Error('No review data received');
        }
      } catch (err) {
        console.error('Error fetching review:', err);
        setError(
          err.response?.data?.error ||
          'Unable to generate review. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchReview();
    }
  }, [accessToken]);

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100%',
  };

  if (loading) {
    return (
      <div style={backgroundStyle}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-black/20">
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 max-w-md w-full">
          <Loader2 className="h-8 w-8 animate-spin text-pink-700 my-2" />
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-800">Analyzing your Pinterest boards...</p>
            <p className="text-sm text-gray-700 pb-2">
              This may take a few minutes as we process your pins
            </p>
          </div>
        </div>
      </div>

      </div>
    );
  }

  if (error) {
    return (
      <div style={backgroundStyle}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-black/20">
        <div className="flex flex-col items-center justify-center my-4 bg-white border rounded-lg p-4 max-w-md w-full">
            <h3 className="text-gray-700 font-medium">Error analysing pins. Please try again later</h3>
        </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={backgroundStyle}>
        <div className="mx-auto p-6">
          <div className="bg-white/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500/50 to-pink-600/50 p-4">
              <h2 className="text-white text-xl font-semibold text-center">
                Your Pinterest Analysis
              </h2>
            </div>

            <div className="p-6">
              {review ? (
                <div className="prose prose-pink max-w-none">
                  <p className="text-white leading-relaxed whitespace-pre-line">
                    {review}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-white text-center italic mb-4">
                    Please login to get review.
                  </p>
                  <Link
                    to="/"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full w-full max-w-xs text-center transition duration-200"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;
