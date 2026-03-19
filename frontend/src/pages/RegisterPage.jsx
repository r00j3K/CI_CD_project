import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { validateRegisterForm } from '../services/validation.js';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        const validationErrors = validateRegisterForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authService.register(registerData);
            const { token, email, firstName, lastName, role } = response.data;
            login({ email, firstName, lastName, role }, token);
            navigate('/patient');
        } catch (err) {
            if (err.response?.status === 400) {
                setServerError('Ten email jest już zajęty');
            } else {
                setServerError('Błąd rejestracji — spróbuj ponownie');
            }
        } finally {
            setLoading(false);
        }
    };

    const getInputStyle = (fieldName) => ({
        ...styles.input,
        borderColor: errors[fieldName] ? '#e53e3e' : '#bee3f8',
    });

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>🏥 MedApp</h1>
                    <p style={styles.subtitle}>Utwórz nowe konto pacjenta</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>Imię</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                style={getInputStyle('firstName')}
                                placeholder="Jan"
                            />
                            {errors.firstName && (
                                <span style={styles.error}>
                                    {errors.firstName}
                                </span>
                            )}
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Nazwisko</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                style={getInputStyle('lastName')}
                                placeholder="Kowalski"
                            />
                            {errors.lastName && (
                                <span style={styles.error}>
                                    {errors.lastName}
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={getInputStyle('email')}
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
                            style={getInputStyle('password')}
                            placeholder="••••••••••"
                        />
                        {errors.password && (
                            <span style={styles.error}>{errors.password}</span>
                        )}
                        <div style={styles.passwordHints}>
                            <span style={getHintStyle(formData.password.length >= 10)}>
                                ✓ Min. 10 znaków
                            </span>
                            <span style={getHintStyle(/[A-Z]/.test(formData.password))}>
                                ✓ Wielka litera
                            </span>
                            <span style={getHintStyle(/[a-z]/.test(formData.password))}>
                                ✓ Mała litera
                            </span>
                            <span style={getHintStyle(/[0-9]/.test(formData.password))}>
                                ✓ Cyfra
                            </span>
                            <span style={getHintStyle(/[!@#$%^&*]/.test(formData.password))}>
                                ✓ Znak specjalny
                            </span>
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Potwierdź hasło</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={getInputStyle('confirmPassword')}
                            placeholder="••••••••••"
                        />
                        {errors.confirmPassword && (
                            <span style={styles.error}>
                                {errors.confirmPassword}
                            </span>
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
                        {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                    </button>
                </form>

                <p style={styles.loginText}>
                    Masz już konto?{' '}
                    <Link to="/login" style={styles.link}>
                        Zaloguj się
                    </Link>
                </p>
            </div>
        </div>
    );
}

const getHintStyle = (isValid) => ({
    fontSize: '12px',
    color: isValid ? '#38a169' : '#a0aec0',
    fontWeight: isValid ? '600' : '400',
});

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ebf8ff',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '480px',
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
    row: {
        display: 'flex',
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
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
    },
    passwordHints: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '4px',
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
    loginText: {
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