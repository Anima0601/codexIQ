// devmate-frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage'; 
import CodeEditor from './CodeEditor'; 


function App() {
    
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const checkAuthStatus = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

  
        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []); 

   
    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
     
    };

  
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false); 
    
    };

    return (
        <Router>
            <div className="App">
                <Routes>
               
                    <Route
                        path="/auth"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/" replace />
                            ) : (
                                <AuthPage onAuthSuccess={handleAuthSuccess} />
                            )
                        }
                    />

                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <CodeEditor onLogout={handleLogout} /> 
                            ) : (
                                <Navigate to="/auth" replace />
                            )
                        }
                    />

                  
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
