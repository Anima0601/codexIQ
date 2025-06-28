CodexIQ: AI-Powered Code Reviewer
CodexIQ is a full-stack web application designed to help developers improve their code quality by providing AI-powered code reviews. It supports reviewing both pasted code snippets and code fetched directly from GitHub URLs. The application features a robust user authentication system to manage access and provides a modern, customizable user interface with dark mode capabilities.

✨ Features
AI Code Review: Get instant feedback on your code for bugs, security vulnerabilities, performance issues, readability, and best practices using OpenAI's powerful language models.

GitHub Integration: Review code directly from public GitHub repository file URLs.

User Authentication: Secure user registration and login system using JWT (JSON Web Tokens).

Protected Routes: API endpoints are protected, ensuring only authenticated users can access code review features.

Themeable UI: Modern and responsive user interface built with React and styled with Tailwind CSS, featuring customizable themes via DaisyUI, including a dark mode.

Language Selection: Choose the programming language for more accurate AI reviews.

🚀 Technologies Used
Backend:

Node.js & Express.js: For building the RESTful API server.

MongoDB & Mongoose: NoSQL database for storing user data, with Mongoose for elegant MongoDB object modeling.

bcryptjs: For secure password hashing.

jsonwebtoken (JWT): For user authentication and authorization.

dotenv: For managing environment variables.

openai: Node.js client for interacting with the OpenAI API.

axios / fetch: For making HTTP requests (e.g., to fetch GitHub content).

cors: Middleware to enable Cross-Origin Resource Sharing.

Frontend:

React: A JavaScript library for building user interfaces.

Vite: A fast build tool for modern web projects.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

DaisyUI: A Tailwind CSS component library that simplifies theme management and provides ready-made, styled components.

react-router-dom: For client-side routing.

react-markdown & remark-gfm: For rendering AI review results in Markdown format.

⚙️ Setup Instructions
Prerequisites
Node.js (v18 or higher recommended)

npm (Node Package Manager)

MongoDB installed and running locally, or access to a MongoDB Atlas cluster.

An OpenAI API Key.

A GitHub Personal Access Token (PAT) with repo scope (for reviewing private repos) or no specific scope (for public repos, though a PAT is recommended for higher rate limits).

1. Clone the Repository
git clone <your-repository-url>
cd CodexIQ # Or whatever your project folder is called

2. Backend Setup
cd devmate-backend
npm install

Environment Variables (.env)
Create a .env file in the devmate-backend directory with the following content. Replace the placeholder values with your actual credentials and a strong secret key.

PORT=5000
MONGO_URI=mongodb://localhost:27017/codexiq_db # Or your MongoDB Atlas connection string
JWT_SECRET=YOUR_SUPER_SECURE_RANDOM_JWT_SECRET_KEY_HERE
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
GITHUB_ACCESS_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN

3. Frontend Setup
cd ../devmate-frontend
npm install

Tailwind CSS and DaisyUI Configuration
Ensure your tailwind.config.js in devmate-frontend is set up to include DaisyUI:

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
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "corporate", "synthwave", "dracula", "night"], // Add/remove themes as desired
  },
}

And src/index.css should correctly import Tailwind's directives:

/* devmate-frontend/src/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add any other global CSS here */

▶️ Running the Application
You'll need three separate terminal windows/tabs to run the database, backend, and frontend concurrently.

1. Start MongoDB (if running locally)
Open a new terminal and run your MongoDB daemon. If it's installed as a service, it might already be running.

mongod
# Or if you have a specific data path:
# mongod --dbpath /path/to/your/mongo/data

Keep this terminal open.

2. Start the Backend Server
Open a new terminal, navigate to the devmate-backend directory, and start the server:

cd devmate-backend
node server.js

You should see "MongoDB connected successfully!" and "Server running on port 5000". Keep this terminal open.

3. Start the Frontend Development Server
Open a new terminal, navigate to the devmate-frontend directory, and start the development server:

cd devmate-frontend
npm run dev

The terminal will provide a local URL (e.g., http://localhost:5173).

🖥️ Usage
Access the Application: Open your web browser and navigate to the URL provided by the frontend server (e.g., http://localhost:5173).

Authentication: You will be redirected to the Login/Register page.

Register: Create a new account with a unique username, email, and password.

Login: Use your registered credentials to log in. Upon successful login, you will be redirected to the main Code Reviewer interface.

Code Review:

Paste Code: Enter your code snippet directly into the provided textarea.

GitHub URL: Paste a raw GitHub file URL (e.g., https://raw.githubusercontent.com/owner/repo/branch/path/to/file.js) into the GitHub URL input.

Select Language: Choose the programming language of the code for more accurate AI review.

Click "Get AI Review" to receive feedback.

Logout: A "Logout" button will be available on the Code Editor page. Clicking it will clear your session and redirect you back to the authentication page.

Theme Toggle: If implemented, a theme toggle button will allow you to switch between different DaisyUI themes (e.g., light, dark).

Enjoy using CodexIQ to enhance your code!
