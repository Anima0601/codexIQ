
import React, { useState } from 'react';
import './CodeEditor.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function CodeEditor({ onLogout }) { 
  const [code, setCode] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [githubUrl, setGithubUrl] = useState('');


  const handleReviewCode = async () => {
    setLoading(true);
    setError('');
    setReviewResult('');

    let endpoint = '';
    let requestBody = {};

    if (code.trim()) {
      endpoint = 'http://localhost:5000/api/review-code';
      requestBody = { code, language };
    } else if (githubUrl.trim()) {
      endpoint = 'http://localhost:5000/api/review-github';
      requestBody = { githubUrl, language };
    } else {
      setError('Please paste some code or provide a GitHub URL to review.');
      setLoading(false);
      return;
    }

    try {
 
      const token = localStorage.getItem('token'); 
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
       
        return;
      }
  

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, 
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 401) {
            setError(errorData.msg || 'Session expired. Please log in again.');
            if (onLogout) onLogout(); 
            return;
        }
     
        throw new Error(errorData.error || 'Something went wrong on the server.');
      }

      const data = await response.json();
      setReviewResult(data.review);

    } catch (err) {
      setError(err.message || 'Failed to fetch review. Please check your network and server.');
      console.error("Frontend error during review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 relative">
 
      <button
          onClick={onLogout} 
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 z-50"
      >
          Logout
      </button>

      <h1 className="text-4xl font-extrabold text-blue-800 mb-8">CodexIQ: AI Code Reviewer</h1>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Code Input:</h2>

        <div className="mb-4">
          <label htmlFor="language-select" className="block text-gray-700 text-sm font-bold mb-2">
            Programming Language:
          </label>
          <select
            id="language-select"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="php">PHP</option>
            <option value="go">Go</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="other">Other</option>
          </select>
        </div>

        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono mb-4"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setGithubUrl('');
          }}
        ></textarea>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <input
          type="text"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono mb-4"
          placeholder="Enter GitHub URL (e.g., https://github.com/owner/repo/blob/main/src/file.js)"
          value={githubUrl}
          onChange={(e) => {
            setGithubUrl(e.target.value);
            setCode('');
          }}
        />

        <button
          onClick={handleReviewCode}
          disabled={loading || (!code.trim() && !githubUrl.trim())}
          className={`mt-6 w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200
            ${loading || (!code.trim() && !githubUrl.trim())
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
        >
          {loading ? 'Reviewing Code...' : 'Get AI Review'}
        </button>

        {error && (
          <p className="mt-4 text-red-600 text-center text-lg font-medium">{error}</p>
        )}

        {reviewResult && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">AI Review:</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-800 leading-relaxed ai-review-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                children={reviewResult}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;