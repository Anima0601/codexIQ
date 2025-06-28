
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const axios = require('axios'); 
const auth = require('../middleware/authMiddleware');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get content from GitHub raw URL
const getGitHubRawContent = async (url, token) => {
    try {
        let rawUrl = url;
        if (url.includes('/blob/')) {
            rawUrl = url.replace('/blob/', '/raw/');
        } else if (url.includes('/tree/')) {
            throw new Error('Directory URLs are not supported for direct file content review. Please provide a file URL.');
        }

        const headers = {
            'User-Agent': 'CodexIQ-Code-Reviewer', // GitHub requires a User-Agent header
        };
        if (token) {
            headers['Authorization'] = `token ${token}`; // Use your GitHub token for higher rate limits
        }

        const response = await axios.get(rawUrl, { headers });

        return response.data;
    } catch (error) {
        console.error('Error fetching GitHub content:', error.message);
        if (error.response) {
            console.error('GitHub API response error:', error.response.data);
            // More specific error for GitHub
            if (error.response.status === 404) {
                throw new Error('GitHub file not found. Please check the URL and file path.');
            } else if (error.response.status === 401 || error.response.status === 403) {
                throw new Error('Access denied to GitHub repository. Check your PAT permissions or repo visibility.');
            }
        }
        throw new Error(`Failed to fetch content from GitHub: ${error.message}`);
    }
};

// @route   POST /api/review-code
// @desc    Get AI review for pasted code
// @access  Private (requires authentication)
router.post('/review-code', auth, async (req, res) => {
    const { code, language } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required for review.' });
    }
    if (!language || language.trim() === '') {
        return res.status(400).json({ error: 'Programming language must be specified.' });
    }
    // ADDED: Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
        console.error("Error: OPENAI_API_KEY is not set in .env file!");
        return res.status(500).json({ error: "Server configuration error: OpenAI API key missing." });
    }

    try {
        console.log(`Received ${language} code for review.`);

        // --- ENHANCED PROMPT STARTS HERE ---
        const messages = [
            {
                role: "system",
                content: `You are DevMate, an expert AI code reviewer specializing in ${language} programming. Your primary goal is to help developers improve their code by analyzing it for:
-   **Bugs or Logical Errors:** Identify potential issues that would cause incorrect behavior.
-   **Readability & Maintainability:** Suggest improvements for clarity, structure, and ease of understanding.
-   **Style & Best Practices:** Adhere to common conventions for the specified language. For JavaScript, this includes using 'const' or 'let' over 'var', consistent semicolon usage, proper camelCase for function and variable names (e.g., 'myFunction' not 'MyFunction'), and consistent bracing style.
-   **Optimization:** Propose ways to make the code more efficient, explaining the performance benefits.
-   **Security Vulnerabilities:** Point out any potential security risks or common insecure patterns.

Provide clear, concise, and actionable feedback. When suggesting changes, explain *why* it's an improvement. Do not execute the code. If no issues are found, state that the code looks good and briefly explain why, focusing on good practices observed.`
            },
            {
                role: "user",
                content: `Please review the following ${language} code. Focus on the points mentioned in your system prompt.

Provide feedback as a numbered list where each item clearly states:
[Category: Bug/Style/Readability/Optimization/Security] Line Number (if applicable): Description of the issue. Suggestion/Example of corrected code.

Example format for JavaScript:
1. [Style] Line 5: 'var' is an outdated keyword in modern JavaScript. Suggestion: Use 'const' or 'let' instead. Example: 'const myVariable = 10;'
2. [Bug] Line 10: Loop condition 'i <= array.length' will cause an 'undefined' access on the last iteration. Suggestion: Change to 'i < array.length'.
3. [Readability] Overall: Nested 'if' statements make the logic hard to follow. Suggestion: Consider using early returns or combining conditions for clarity.

Code to review:\n\n\`\`\`${language}\n${code}\n\`\`\``
            }
        ];
        // --- ENHANCED PROMPT ENDS HERE ---

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // You can try "gpt-4" or "gpt-4o" for better quality if you have access
            messages: messages, // Use the detailed messages array
            max_tokens: 1500, // Adjust based on desired review length
            temperature: 0.1, // Lower temperature for more focused and less creative reviews
        });

        const review = completion.choices[0].message.content;
        console.log("OpenAI review completed.");
        res.json({ review });

    } catch (error) {
        console.error('Error reviewing code with OpenAI:', error.message);
        if (error.response) {
            console.error('OpenAI API error status:', error.response.status);
            console.error('OpenAI API error data:', error.response.data);
            // --- ENHANCED ERROR HANDLING STARTS HERE ---
            if (error.response.status === 401) {
                return res.status(401).json({ error: "OpenAI API key unauthorized or invalid. Please check your key and ensure it's correct and has access to the models." });
            } else if (error.response.status === 429) {
                return res.status(429).json({ error: "OpenAI API rate limit exceeded or out of credits. Please check your OpenAI usage and billing details." });
            } else {
                const errorMessage = error.response.data && error.response.data.error && error.response.data.error.message
                    ? error.response.data.error.message
                    : error.message;
                return res.status(error.response.status).json({ error: `OpenAI API error: ${errorMessage}` });
            }
            // --- ENHANCED ERROR HANDLING ENDS HERE ---
        }
        res.status(500).json({ error: `Failed to get code review from AI: ${error.message}. Please check your network connection or server logs.` });
    }
});


// @route   POST /api/review-github
// @desc    Get AI review for code from a GitHub URL
// @access  Private (requires authentication)
router.post('/review-github', auth, async (req, res) => {
    const { githubUrl, language } = req.body;

    if (!githubUrl) {
        return res.status(400).json({ error: 'GitHub URL is required for review.' });
    }
    if (!language || language.trim() === '') {
        return res.status(400).json({ error: 'Programming language must be specified.' });
    }
    if (!process.env.GITHUB_ACCESS_TOKEN) {
        console.error("Error: GITHUB_ACCESS_TOKEN is not set in .env file!");
        return res.status(500).json({ error: "Server configuration error: GitHub Access Token missing. Please ensure it's in your .env file." });
    }

    const githubToken = process.env.GITHUB_ACCESS_TOKEN;

    try {
        const code = await getGitHubRawContent(githubUrl, githubToken);

        if (!code) {
            return res.status(400).json({ error: 'Could not retrieve code from the provided GitHub URL.' });
        }

        // --- ENHANCED PROMPT STARTS HERE ---
        const messages = [
            {
                role: "system",
                content: `You are DevMate, an expert AI code reviewer specializing in ${language} programming. Your primary goal is to help developers improve their code by analyzing it for:
-   **Bugs or Logical Errors:** Identify potential issues that would cause incorrect behavior.
-   **Readability & Maintainability:** Suggest improvements for clarity, structure, and ease of understanding.
-   **Style & Best Practices:** Adhere to common conventions for the specified language. For JavaScript, this includes using 'const' or 'let' over 'var', consistent semicolon usage, proper camelCase for function and variable names (e.g., 'myFunction' not 'MyFunction'), and consistent bracing style.
-   **Optimization:** Propose ways to make the code more efficient, explaining the performance benefits.
-   **Security Vulnerabilities:** Point out any potential security risks or common insecure patterns.

Provide clear, concise, and actionable feedback. When suggesting changes, explain *why* it's an improvement. Do not execute the code. If no issues are found, state that the code looks good and briefly explain why, focusing on good practices observed.`
            },
            {
                role: "user",
                content: `Please review the following ${language} code, which was fetched from GitHub. Focus on the points mentioned in your system prompt.

Provide feedback as a numbered list where each item clearly states:
[Category: Bug/Style/Readability/Optimization/Security] Line Number (if applicable): Description of the issue. Suggestion/Example of corrected code.

Example format for JavaScript:
1. [Style] Line 5: 'var' is an outdated keyword in modern JavaScript. Suggestion: Use 'const' or 'let' instead. Example: 'const myVariable = 10;'
2. [Bug] Line 10: Loop condition 'i <= array.length' will cause an 'undefined' access on the last iteration. Suggestion: Change to 'i < array.length'.
3. [Readability] Overall: Nested 'if' statements make the logic hard to follow. Suggestion: Consider using early returns or combining conditions for clarity.

Code to review:\n\n\`\`\`${language}\n${code}\n\`\`\``
            }
        ];
        // --- ENHANCED PROMPT ENDS HERE ---

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages, // Use the detailed messages array
            max_tokens: 1500,
            temperature: 0.1,
        });

        const review = completion.choices[0].message.content;
        res.json({ review });

    } catch (error) {
        console.error('Error reviewing GitHub code:', error.message);
        // --- ENHANCED ERROR HANDLING STARTS HERE ---
        if (error.response) { // This `if` block handles errors from OpenAI API
            console.error('OpenAI API error status:', error.response.status);
            console.error('OpenAI API error data:', error.response.data);
            if (error.response.status === 401) {
                return res.status(401).json({ error: "OpenAI API key unauthorized or invalid. Please check your key and ensure it's correct and has access to the models." });
            } else if (error.response.status === 429) {
                return res.status(429).json({ error: "OpenAI API rate limit exceeded or out of credits. Please check your OpenAI usage and billing details." });
            } else {
                const errorMessage = error.response.data && error.response.data.error && error.response.data.error.message
                    ? error.response.data.error.message
                    : error.message;
                return res.status(error.response.status).json({ error: `OpenAI API error: ${errorMessage}` });
            }
        }
        // This line catches errors from `getGitHubRawContent` or other general errors
        res.status(500).json({ error: error.message || 'Failed to get GitHub code review from AI. Please check your network or URL.' });
        // --- ENHANCED ERROR HANDLING ENDS HERE ---
    }
});

module.exports = router;