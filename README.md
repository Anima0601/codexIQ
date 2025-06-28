🔍 CodexIQ: AI-Powered Code Reviewer
CodexIQ is a full-stack web application that helps developers improve code quality by providing AI-powered code reviews. Users can review both pasted code snippets and code fetched from GitHub URLs. It includes secure user authentication and a modern, responsive UI.

✨ Features
AI Code Review
Instantly receive feedback on:

Bugs

Security vulnerabilities

Performance issues

Readability

Best practices
Powered by OpenAI.

GitHub Integration
Review code directly from public GitHub repository file URLs.

User Authentication
Secure registration and login system using JWT (JSON Web Tokens).

Protected Routes
Code review APIs are protected—only authenticated users can access them.

Language Selection
Specify the programming language to improve the accuracy of AI reviews.

🚀 Technologies Used
🔧 Backend
Node.js & Express.js – REST API server

MongoDB & Mongoose – NoSQL database with schema validation

bcryptjs – Password hashing

jsonwebtoken – JWT-based authentication

dotenv – Environment variable management

openai – OpenAI API integration

fetch/axios – HTTP requests

cors – Enable CORS for frontend-backend communication

🎨 Frontend
React – Component-based UI

Vite – Fast bundler and development server

Tailwind CSS – Utility-first CSS framework

react-router-dom – Routing

react-markdown + remark-gfm – Render markdown feedback from OpenAI

⚙️ Setup Instructions
📦 Prerequisites
Node.js (v18+)

npm

MongoDB (local or MongoDB Atlas)

OpenAI API Key

GitHub Personal Access Token (PAT)

1️⃣ Clone the Repository
bash
Copy
Edit
git clone <your-repository-url>
cd CodexIQ
2️⃣ Backend Setup
bash
Copy
Edit
cd devmate-backend
npm install
Create .env file in devmate-backend/:
env
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/codexiq_db
JWT_SECRET=YOUR_SUPER_SECURE_RANDOM_JWT_SECRET_KEY_HERE
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
GITHUB_ACCESS_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
3️⃣ Frontend Setup
bash
Copy
Edit
cd ../devmate-frontend
npm install
Configure Tailwind in tailwind.config.js:
js
Copy
Edit
// devmate-frontend/tailwind.config.js

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
Add Tailwind to src/index.css:
css
Copy
Edit
@tailwind base;
@tailwind components;
@tailwind utilities;
▶️ Running the Application
Open three terminal tabs:

1. Start MongoDB
bash
Copy
Edit
mongod
Or:

bash
Copy
Edit
mongod --dbpath /path/to/mongo/data
2. Start Backend Server
bash
Copy
Edit
cd devmate-backend
node server.js
You should see:

arduino
Copy
Edit
MongoDB connected successfully!
Server running on port 5000
3. Start Frontend Server
bash
Copy
Edit
cd devmate-frontend
npm run dev
The terminal will show a URL (e.g., http://localhost:5173).

🖥️ Usage Guide
Access App: Open the frontend URL in your browser.

Register: Create a user account.

Login: Use your credentials to access the reviewer.

Code Review:

Paste code in the editor, OR

Paste a raw GitHub file URL.

Select the language.

Click "Get AI Review".

Review: View detailed feedback in a clean markdown-styled output.

Logout: Click the Logout button to end your session.

