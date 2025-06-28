# 🔍 CodexIQ: AI-Powered Code Reviewer

CodexIQ is a full-stack web application designed to help developers improve code quality by providing AI-powered code reviews. Users can review both pasted code snippets and code fetched directly from GitHub URLs. It includes secure user authentication and a modern, responsive user interface.

## ✨ Features

* **AI Code Review:** Get instant feedback on your code for:
    * Bugs
    * Security vulnerabilities
    * Performance issues
    * Readability
    * Best practices
    Powered by OpenAI.

* **GitHub Integration:** Review code directly from public GitHub repository file URLs.

* **User Authentication:** Secure registration and login system using JWT (JSON Web Tokens).

* **Protected Routes:** Code review APIs are protected—only authenticated users can access them.

* **Language Selection:** Specify the programming language to improve the accuracy of AI reviews.

## 🚀 Technologies Used

### Backend
* **Node.js & Express.js** – REST API server
* **MongoDB & Mongoose** – NoSQL database with schema validation
* **`bcryptjs`** – Password hashing
* **`jsonwebtoken`** – JWT-based authentication
* **`dotenv`** – Environment variable management
* **`openai`** – OpenAI API integration
* **`fetch`/`axios`** – HTTP requests
* **`cors`** – Enable Cross-Origin Resource Sharing

### Frontend
* **React** – Component-based UI
* **Vite** – Fast bundler and development server
* **Tailwind CSS** – Utility-first CSS framework
* **`react-router-dom`** – Routing
* **`react-markdown` + `remark-gfm`** – Render markdown feedback from OpenAI

## ⚙️ Setup Instructions

### 📦 Prerequisites
* Node.js (v18+)
* npm
* MongoDB (local or MongoDB Atlas)
* OpenAI API Key
* GitHub Personal Access Token (PAT)

### 1️⃣ Clone the Repository
```bash
git clone <your-repository-url>
cd CodexIQ # Replace with your actual project folder name if different
2️⃣ Backend Setup
Navigate to the devmate-backend directory:

Bash

cd devmate-backend
npm install
Create a .env file in the devmate-backend/ directory with the following content. Replace the placeholder values with your actual credentials and a strong secret key.

Code snippet

PORT=5000
MONGO_URI=mongodb://localhost:27017/codexiq_db # Or your MongoDB Atlas connection string
JWT_SECRET=YOUR_SUPER_SECURE_RANDOM_JWT_KEY_HERE
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
GITHUB_ACCESS_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
3️⃣ Frontend Setup
Navigate back to the project root and then into the devmate-frontend directory:

Bash

cd ../devmate-frontend
npm install
Ensure your tailwind.config.js is set up correctly:

JavaScript

// devmate-frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [], // No DaisyUI plugin if not used
}
Add Tailwind directives to src/index.css:

CSS

/* devmate-frontend/src/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Any other global CSS styles can go here */
▶️ Running the Application
You'll need three separate terminal tabs/windows to run the database, backend, and frontend concurrently.

1. Start MongoDB
Open a new terminal and run your MongoDB daemon. If it's installed as a service, it might already be running.

Bash

mongod
Or, if you use a specific data path:

Bash

mongod --dbpath /path/to/mongo/data
Keep this terminal open.

2. Start Backend Server
Open a new terminal, navigate to the devmate-backend directory, and start the server:

Bash

cd devmate-backend
node server.js
You should see output similar to:

MongoDB connected successfully!
Server running on port 5000
Keep this terminal open.

3. Start Frontend Server
Open a new terminal, navigate to the devmate-frontend directory, and start the development server:

Bash

cd devmate-frontend
npm run dev
The terminal will show a local URL (e.g., http://localhost:5173).

🖥️ Usage Guide
Access Application: Open the frontend URL (e.g., http://localhost:5173) in your web browser.

Authentication: You will be redirected to the Login/Register page.

Register: Create a new user account.

Login: Use your registered credentials to access the reviewer.

Code Review: Once logged in:

Paste code in the editor, OR

Paste a raw GitHub file URL (e.g., https://raw.githubusercontent.com/owner/repo/branch/path/to/file.js).

Select the programming language.

Click "Get AI Review".

Review Output: View detailed feedback in a clean, Markdown-styled output.

Logout: Click the "Logout" button to end your session, which will redirect you back to the authentication page.

Enjoy using CodexIQ to enhance your code!