🔍 CodexIQ: AI-Powered Code ReviewerCodexIQ is a full-stack web application designed to help developers improve code quality by providing AI-powered code reviews. Users can review both pasted code snippets and code fetched directly from GitHub URLs. It includes secure user authentication and a modern, responsive UI.✨ FeaturesAI Code Review: Instantly receive feedback on:BugsSecurity vulnerabilitiesPerformance issuesReadabilityBest practicesPowered by OpenAI.GitHub Integration: Review code directly from public GitHub repository file URLs.User Authentication: Secure registration and login system using JWT (JSON Web Tokens).Protected Routes: Code review APIs are protected—only authenticated users can access them.Language Selection: Specify the programming language to improve the accuracy of AI reviews.🚀 Technologies Used🔧 BackendNode.js & Express.js – REST API serverMongoDB & Mongoose – NoSQL database with schema validationbcryptjs – Password hashingjsonwebtoken – JWT-based authenticationdotenv – Environment variable managementopenai – OpenAI API integrationfetch/axios – HTTP requestscors – Enable CORS for frontend-backend communication🎨 FrontendReact – Component-based UIVite – Fast bundler and development serverTailwind CSS – Utility-first CSS frameworkDaisyUI – Tailwind CSS component library for themes and componentsreact-router-dom – Routingreact-markdown + remark-gfm – Render markdown feedback from OpenAI⚙️ Setup Instructions📦 PrerequisitesNode.js (v18+)npmMongoDB (local or MongoDB Atlas)OpenAI API KeyGitHub Personal Access Token (PAT)1️⃣ Clone the Repositorygit clone <your-repository-url>
cd CodexIQ # Or whatever your project folder is called
2️⃣ Backend SetupNavigate to the devmate-backend directory:cd devmate-backend
npm install
Create a .env file in the devmate-backend/ directory with the following content. Replace the placeholder values with your actual credentials and a strong secret key.PORT=5000
MONGO_URI=mongodb://localhost:27017/codexiq_db # Or your MongoDB Atlas connection string
JWT_SECRET=YOUR_SUPER_SECURE_RANDOM_JWT_SECRET_KEY_HERE
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
GITHUB_ACCESS_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
3️⃣ Frontend SetupNavigate back to the project root and then into the devmate-frontend directory:cd ../devmate-frontend
npm install
Configure Tailwind in tailwind.config.js to include DaisyUI:// devmate-frontend/tailwind.config.js

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
Add Tailwind directives to src/index.css:/* devmate-frontend/src/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Any other global CSS styles */
▶️ Running the ApplicationYou'll need three separate terminal tabs/windows to run the database, backend, and frontend concurrently.1. Start MongoDBOpen a new terminal and run your MongoDB daemon. If it's installed as a service, it might already be running.mongod
Or, if you use a specific data path:mongod --dbpath /path/to/mongo/data
Keep this terminal open.2. Start Backend ServerOpen a new terminal, navigate to the devmate-backend directory, and start the server:cd devmate-backend
node server.js
You should see output similar to:MongoDB connected successfully!
Server running on port 5000
Keep this terminal open.3. Start Frontend ServerOpen a new terminal, navigate to the devmate-frontend directory, and start the development server:cd devmate-frontend
npm run dev
The terminal will show a local URL (e.g., http://localhost:5173).🖥️ Usage GuideAccess Application: Open the frontend URL (e.g., http://localhost:5173) in your web browser.Authentication: You will be redirected to the Login/Register page.Register: Create a new user account.Login: Use your registered credentials to access the reviewer.Code Review: Once logged in:Paste code in the editor, ORPaste a raw GitHub file URL (e.g., https://raw.githubusercontent.com/owner/repo/branch/path/to/file.js).Select the programming language.Click "Get AI Review".Review Output: View detailed feedback in a clean, Markdown-styled output.Logout: Click the "Logout" button to end your session, which will redirect you back to the authentication page.Enjoy using CodexIQ to enhance your code!