import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../../apiCalls/verifyCalls.js'
import AuthLoadingScreen from '../AuthLoading/AuthLoading';

function ProtectedRoutes() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // ✅ Use the 'api' instance here
                const response = await api.get('/api/auth/verify');
                
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                // If there's an error (e.g., 401), authentication fails
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    if (isLoading) {
        return <AuthLoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;