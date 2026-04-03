import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import PatientPage from './pages/PatientPage.jsx';

// Komponent pomocniczy do ochrony tras (opcjonalnie, ale warto)
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token } = useAuth();
    
    if (!token) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" />;
    }
    return children;
};

function AppContent() {
    return (
        <Routes>
            {/* Strona główna (Root) - teraz to Rejestracja */}
            <Route path="/" element={<RegisterPage />} />
            
            {/* Strona logowania */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Panel Admina i Doktora */}
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
                        <AdminPage />
                    </ProtectedRoute>
                } 
            />
            
            {/* Panel Pacjenta */}
            <Route 
                path="/patient" 
                element={
                    <ProtectedRoute allowedRoles={['PATIENT']}>
                        <PatientPage />
                    </ProtectedRoute>
                } 
            />

            {/* Przekierowanie dla nieznanych tras */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}