import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from 'sharp';

export const fetchReview = async (req, res) => {
    try {
        console.log("Fetching review...");
        const accessToken = req.body.accessToken;

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
            try {
                const pinResponse = await axios.get(`https://api.pinterest.com/v5/pins/${pins[i].id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (pinResponse.data?.media?.images?.['600x']?.url) {
                    pinImageUrls.push(pinResponse.data.media.images['600x'].url);
                }
            } catch (err) {
                console.error(`Error fetching image URL for pin ${pins[i].id}:`, err.message);
            }
        }

        const pinImages = selectRandomImages(pinImageUrls, 6);
        if (pinImageUrls.length === 0) {
            return res.status(404).json({ error: 'No valid image URLs found' });
        }

        // console.log(`Processing ${pinImages.length} images...`);

        const descriptions = await generateImageDescriptions(pinImages, model);
        
        // TEST
        // descriptions = ['one', 'two']
        
        if (descriptions.length === 0) {
            return res.status(500).json({ error: 'Failed to generate image descriptions' });
        }

        const prompt = `
            Based on the following descriptions of a user's pins, provide a creative review to the user about their overall interests, themes, and preferences.
            descriptions: ${descriptions.join('.')}
            Your review should be thoughtful, emphasize common themes, and suggest what the user's collection says about their personality. Not more than 150 words.
        `;
        // console.log(prompt);

        const result = await model.generateContent(prompt);

        // TEST
        // const result= {
        //     response: "helo this is the reuslt"
        // }

        if (!result.response) {
            throw new Error('No response generated from the model');
        }
        // console.log(result.response.text());
        console.log("review generated!");
        return res.status(200).json(result.response.text());

    } catch (error) {
        console.error('Error in fetchReview:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
        return res.status(500).json({ 
            error: 'Error generating review', 
            details: errorMessage,
            timestamp: new Date().toISOString()
        });
    }
};

const selectRandomImages = (imageUrls, count) => {
    const shuffled = imageUrls.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};


const generateImageDescriptions = async (imageUrls, model) => {
    const descriptions = [];

    for (const url of imageUrls) {
        try {
            // console.log(`Processing image: ${url.substring(0, 50)}...`);

            // Fetch the image as binary data
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
            });

            if (!response.data) {
                console.error('No data received from image URL');
                continue;
            }

            const imageBuffer = Buffer.from(response.data);
            const processedImage = await sharp(imageBuffer)
                .resize(600) 
                .toBuffer();

            const result = await model.generateContent([
                "Describe this image in 20 words focussing on theme, sentiment, etc.",
                {
                    inlineData: {
                        data: processedImage.toString('base64'),
                        mimeType: "image/jpeg",
                    },
                },
            ]);

            if (result.response) {
                descriptions.push(result.response.text().trim());
                // console.log('Successfully generated description');
            } else {
                console.error('No response from model for image');
            }

        } catch (error) {
            console.error('Error processing image:', error.message);
        }
    }

    return descriptions;
};

export default fetchReview;
