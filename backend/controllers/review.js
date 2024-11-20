import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from 'sharp';
import { HfInference } from "@huggingface/inference";

const HF_API_KEY = process.env.HF_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new HfInference(HF_API_KEY);

async function queryHuggingFace(imageBuffer) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/octet-stream", // Binary data
                },
                method: "POST",
                body: imageBuffer,
            }
        );
        return await response.json();
    } catch (error) {
        console.error("Error querying Hugging Face API:", error.message);
        return null;
    }
}

const selectRandomImages = (imageUrls, count) => {
    const shuffled = imageUrls.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const generateImageDescriptions = async (imageUrls) => {
    const descriptions = [];
    for (const url of imageUrls) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data);

            const processedImage = await sharp(imageBuffer).resize(600).toBuffer();
            const result = await queryHuggingFace(processedImage);
            if (result?.length > 0) {
                descriptions.push(result[0]?.generated_text?.trim());
            } else {
                console.error("Failed to generate description for an image");
            }
        } catch (error) {
            console.error("Error processing image:", error.message);
        }
    }
    return descriptions;
};

const fetchReview = async (req, res) => {
    try {
        console.log("Fetching review...");
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }

        const pinterestResponse = await axios.get('https://api.pinterest.com/v5/pins', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const pins = pinterestResponse.data.items || [];
        if (pins.length === 0) {
            return res.status(404).json({ error: 'No pins found for this user' });
        }

        const pinImageUrls = [];

        for (const pin of pins.slice(0, 50)) {
            try {
                const pinResponse = await axios.get(`https://api.pinterest.com/v5/pins/${pin.id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const imageUrl = pinResponse.data?.media?.images?.['600x']?.url;
                if (imageUrl) {
                    pinImageUrls.push(imageUrl);
                }
            } catch (err) {
                console.error(`Error fetching image for pin ${pin.id}:`, err.message);
            }
        }

        const validImageUrls = pinImageUrls.filter(url => url);
        if (validImageUrls.length === 0) {
            return res.status(404).json({ error: 'No valid image URLs found' });
        }

        const selectedImages = selectRandomImages(validImageUrls, 6);
        const descriptions = await generateImageDescriptions(selectedImages);

        if (descriptions.length === 0) {
            return res.status(500).json({ error: 'Failed to generate image descriptions' });
        }

        const prompt = `
            A user authorised you to evaluate their pins and you found these descriptions. Provide a creative review about their overall persona.
            Descriptions: ${descriptions.join(". ")}
            Your review should be thoughtful and cute, not more than 150 words.
        `;

        const chatCompletion = await client.chatCompletion({
            model: "microsoft/Phi-3-mini-4k-instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            n: 1,
        });

        const result = chatCompletion.choices[0]?.message.content.trim();
        if (!result) {
            return res.status(500).json({ error: 'Failed to generate a review' });
        }

        console.log("Review generated!");
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in fetchReview:", error.message);
        return res.status(500).json({ error: "Error generating review", details: error.message });
    }
};

export default fetchReview;
