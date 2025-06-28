
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); 

const app = express();
const PORT = process.env.PORT || 5000;


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


app.use(express.json());

app.use(cors());


app.get('/', (req, res) => {
    res.send('DevMate Backend is running!');
});


app.post('/api/review-code', async (req, res) => {
    const { code } = req.body; 

    if (!code) {
        return res.status(400).json({ error: 'Code is required for review.' });
    }

    if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not set in .env file!");
        return res.status(500).json({ error: "Server configuration error: OpenAI API key missing." });
    }

    try {
        console.log("Received code for review. Sending to OpenAI...");
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "system", content: "You are a helpful AI assistant specialized in code review. Provide concise suggestions for style, readability, potential bugs, and optimizations. Be polite and constructive." },
                { role: "user", content: `Review the following code:\n\n\`\`\`\n${code}\n\`\`\`` }
            ],
            max_tokens: 500, 
            temperature: 0.7, 
        });

        const reviewResult = completion.choices[0].message.content;
        console.log("OpenAI review completed.");
        res.json({ review: reviewResult });

    } catch (error) {
        console.error('Error reviewing code with OpenAI:', error.message);
        if (error.response) {
            console.error('OpenAI API error status:', error.response.status);
            console.error('OpenAI API error data:', error.response.data);
            if (error.response.status === 401) {
                res.status(401).json({ error: "OpenAI API key unauthorized or invalid. Please check your key." });
            } else if (error.response.status === 429) {
                res.status(429).json({ error: "OpenAI API rate limit exceeded or out of credits. Please check your OpenAI usage." });
            } else {
                res.status(error.response.status).json({ error: `OpenAI API error: ${error.response.data.error.message || error.message}` });
            }
        } else {
            res.status(500).json({ error: `Failed to review code: ${error.message}` });
        }
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});