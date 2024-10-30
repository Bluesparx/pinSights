import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Analyzing your Pinterest boards...</p>
          <p className="text-sm text-gray-500">
            This may take a while as we process your pins
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <div className="bg-white/20 border border-pink-500 rounded-lg p-4 max-w-md w-full">
          <h3 className="text-red-100 font-medium mb-2">Error</h3>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

// const review = 'testing';

  return (
    <>
    <Navbar/>
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/30 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500/50 to-pink-600/50 p-4">
          <h2 className="text-gray-100 text-xl font-semibold text-center">
            Your Pinterest Analysis
          </h2>
        </div>

        <div className="p-6">
          {review ? (
            <div className="prose prose-pink max-w-80">
              <p className="text-white leading-relaxed whitespace-pre-line">
                {review}
              </p>
            </div>
          ) : (
            <div className='flex flex-col items-center'>
            <p className="text-gray-100 text-center italic min-width-80 mb-4">
              Please login to get review.
            </p>
            <Link to="/" className="bg-red-600 max-w-64 hover:bg-red-700 text-white font-bold py-2 my-3 rounded-full w-full pr-2 pl-2 transition duration-200 text-center">Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Review;