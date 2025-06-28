import React, { useState } from 'react'; 
import './index.css'; 

function App() {
  const [code, setCode] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReviewCode = async () => {
    setLoading(true);
    setError('');
    setReviewResult(''); 

    try {
      const response = await fetch('http://localhost:5000/api/review-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
  
        throw new Error(errorData.error || 'Something went wrong on the server.');
      }

      const data = await response.json();
      setReviewResult(data.review);

    } catch (err) { 
      setError(err.message || 'Failed to fetch review.');
      console.error("Frontend error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8">CodexIQ : AI Code Reviewer</h1>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Paste Your Code Here:</h2>
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono"
          placeholder="e.g., function add(a, b) { return a + b }"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>

        <button
          onClick={handleReviewCode}
          disabled={loading || !code.trim()}
          className={`mt-6 w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200
            ${loading || !code.trim()
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
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-800 font-mono leading-relaxed">
              {reviewResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;