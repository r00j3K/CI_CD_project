import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { validateLoginForm } from '../services/validation.js';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        const validationErrors = validateLoginForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login(formData);
            const { token, email, firstName, lastName, role } = response.data;
            login({ email, firstName, lastName, role }, token);

            if (role === 'ADMIN' || role === 'DOCTOR') {
                navigate('/admin');
            } else {
                navigate('/patient');
            }
        } catch (err) {
            setServerError('Nieprawidłowy email lub hasło');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>🏥 MedApp</h1>
                    <p style={styles.subtitle}>Zaloguj się do systemu</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                borderColor: errors.email ? '#e53e3e' : '#bee3f8'
                            }}
                            placeholder="jan.kowalski@example.com"
                        />
                        {errors.email && (
                            <span style={styles.error}>{errors.email}</span>
                        )}
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Hasło</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                borderColor: errors.password ? '#e53e3e' : '#bee3f8'
                            }}
                            placeholder="••••••••••"
                        />
                        {errors.password && (
                            <span style={styles.error}>{errors.password}</span>
                        )}
                    </div>

                    {serverError && (
                        <div style={styles.serverError}>{serverError}</div>
                    )}

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                </form>

                <p style={styles.registerText}>
                    Nie masz konta?{' '}
                    <Link to="/register" style={styles.link}>
                        Zarejestruj się
                    </Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ebf8ff',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 20px rgba(0, 100, 200, 0.15)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2b6cb0',
        margin: '0 0 8px 0',
    },
    subtitle: {
        color: '#718096',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontWeight: '600',
        color: '#2d3748',
        fontSize: '14px',
    },
    input: {
        padding: '10px 14px',
        borderRadius: '8px',
        border: '2px solid #bee3f8',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    error: {
        color: '#e53e3e',
        fontSize: '13px',
    },
    serverError: {
        backgroundColor: '#fff5f5',
        border: '1px solid #fc8181',
        borderRadius: '8px',
        padding: '12px',
        color: '#c53030',
        fontSize: '14px',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2b6cb0',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    registerText: {
        textAlign: 'center',
        marginTop: '24px',
        color: '#718096',
        fontSize: '14px',
    },
    link: {
        color: '#2b6cb0',
        fontWeight: '600',
        textDecoration: 'none',
    },
};