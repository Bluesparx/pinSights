import axios from 'axios';
import { spawn } from 'child_process';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const fetchPins = async (req, res) => {
    try {
        const accessToken = req.body.accessToken;

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }

        // Fetch pins from Pinterest
        const pinterestResponse = await axios.get('https://api.pinterest.com/v5/me/pins/', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const pins = pinterestResponse.data.data;
        if (!pins || pins.length === 0) {
            return res.status(404).json({ error: 'No pins found for this user' });
        }

        // Generate descriptions for the images
        const descriptions = await generateImageDescriptions(pins);

        // Generate a collective review based on the descriptions
        const review = await generateReview(descriptions);

        return res.status(200).json({ review, pins });
    } catch (error) {
        console.error('Error generating review:', error);
        return res.status(500).json({ error: 'Error generating review' });
    }
};

const generateImageDescriptions = (pins) => {
    return new Promise((resolve, reject) => {
        const pinImageUrls = pins.map(pin => pin.image.original.url);
        
        const pythonProcess = spawn('python3', ['model.py', JSON.stringify(pinImageUrls)]);

        let dataString = '';
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`);
            reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(`Python process exited with code ${code}`);
            }
            try {
                const descriptions = JSON.parse(dataString);
                resolve(descriptions);
            } catch (err) {
                reject('Error parsing JSON from Python script');
            }
        });
    });
};

// Function to generate a review using Google Gemini
const generateReview = async (descriptions) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Based on the following descriptions of a user's pins, provide a detailed and creative review of the user's overall interests, themes, and preferences.
            Pin Descriptions:
            ${descriptions.join('\n')}
            Your review should be thoughtful, emphasize common themes, and suggest what the user's collection says about their personality and preferences.
        `;

        const response = await model.generateContent(prompt);
        const generatedReview = response.response.text(); 

        return generatedReview;
    } catch (error) {
        console.error('Error generating review using Gemini:', error);
        return 'An error occurred while generating the review.';
    }
};

export default {
    fetchPins,
    generateReview
};
