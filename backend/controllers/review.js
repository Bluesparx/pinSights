import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const fetchReview = async (req, res) => {
    try {
        console.log("fetching...");
        const accessToken = req.body.accessToken;

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }

        const pinterestResponse = await axios.get('https://api.pinterest.com/v5/pins', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const pins = pinterestResponse.data.items;

        if (!pins || pins.length === 0) {
            return res.status(404).json({ error: 'No pins found for this user' });
        }

        const pinImageUrls = [];

        for (let i = 0; i < Math.min(pins.length, 50); i++) {
            // get img url from pin id
            try {
                const pinsResponse = await axios.get(`https://api.pinterest.com/v5/pins/${pins[i].id}?`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (pinsResponse.data && pinsResponse.data.media && pinsResponse.data.media.images) {
                    const images = pinsResponse.data.media.images;

                    pinImageUrls.push(images['600x'].url);
                }
            } catch (err) {
                console.error(`Error fetching image URL for pin ${pins[i].id}:`, err.message);
            }
        }
        console.log(pinImageUrls)
        const descriptions = await generateImageDescriptions(pinImageUrls);

        const cprompt = `
        Based on the following descriptions of a user's pins, provide a detailed and creative review to the user about their overall interests, themes, and preferences.
        Pin Descriptions: ${descriptions.join('.')}Your review should be thoughtful, emphasize common themes, and suggest what the user's collection says about their personality and preferences.
        `;
        console.log(cprompt)

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            prompt: cprompt,
            maxTokens: 150,
        });

        return res.status(200).json(result.response.text());
    } catch (error) {
        console.error('Error generating review:', error);
        return res.status(500).json({ error: 'Error generating review' });
    }
};

const generateImageDescriptions = async (imageUrls) => {
    try {
        const response = await axios.post('http://localhost:5000/process-images', {
            imageUrls: imageUrls,
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching image descriptions:', error);
        throw error;
    }
};

// const generateReview = async (gemprompt) => {
//     try {
//         const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


//         const result = await model.generateContent({
//             prompt: gemprompt,
//             maxTokens: 100, // Adjust the token count as needed
//             temperature: 0.7 // Adjust for creativity
//         });
//         console.log(result.response.text());

//         const generatedReview = result.response.text(); 

//         return generatedReview;
//     } catch (error) {
//         console.error('Error generating review using Gemini:', error);
//         return 'An error occurred while generating the review.';
//     }
// };


export default fetchReview;
