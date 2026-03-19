import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { doctorService, slotService } from '../services/api.js';
import { validateDoctorForm } from '../services/validation.js';

export default function AdminPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('doctors');
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [doctorForm, setDoctorForm] = useState({
        firstName: '',
        lastName: '',
        specialization: '',
        roomNumber: '',
        phoneNumber: '',
    });
    const [doctorErrors, setDoctorErrors] = useState({});

    const [slotForm, setSlotForm] = useState({
        doctorId: '',
        startTime: '',
    });
    const [slotErrors, setSlotErrors] = useState({});

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (activeTab === 'slots') fetchSlots();
    }, [activeTab]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await doctorService.getAll();
            setDoctors(response.data);
        } catch (err) {
            showMessage('Błąd pobierania lekarzy', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const response = await slotService.getAvailable();
            setSlots(response.data);
        } catch (err) {
            showMessage('Błąd pobierania slotów', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDoctorChange = (e) => {
        const { name, value } = e.target;
        setDoctorForm(prev => ({ ...prev, [name]: value }));
        if (doctorErrors[name]) {
            setDoctorErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSlotChange = (e) => {
        const { name, value } = e.target;
        setSlotForm(prev => ({ ...prev, [name]: value }));
        if (slotErrors[name]) {
            setSlotErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        const errors = validateDoctorForm(doctorForm);
        if (Object.keys(errors).length > 0) {
            setDoctorErrors(errors);
            return;
        }
        try {
            await doctorService.add(doctorForm);
            showMessage('Lekarz został dodany!', 'success');
            setDoctorForm({
                firstName: '',
                lastName: '',
                specialization: '',
                roomNumber: '',
                phoneNumber: '',
            });
            fetchDoctors();
        } catch (err) {
            showMessage('Błąd podczas dodawania lekarza', 'error');
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!slotForm.doctorId) errors.doctorId = 'Wybierz lekarza';
        if (!slotForm.startTime) errors.startTime = 'Wybierz datę i godzinę';
        if (Object.keys(errors).length > 0) {
            setSlotErrors(errors);
            return;
        }
        try {
            await slotService.add({
                doctorId: parseInt(slotForm.doctorId),
                startTime: slotForm.startTime,
            });
            showMessage('Slot został dodany!', 'success');
            setSlotForm({ doctorId: '', startTime: '' });
            if (activeTab === 'slots') fetchSlots();
        } catch (err) {
            showMessage('Błąd podczas dodawania slotu', 'error');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInputStyle = (errors, field) => ({
        ...styles.input,
        borderColor: errors[field] ? '#e53e3e' : '#bee3f8',
    });

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <span style={styles.navTitle}>🏥 MedApp</span>
                <div style={styles.navRight}>
                    <span style={styles.navUser}>
                        👤 {user?.firstName} {user?.lastName}
                        <span style={styles.roleBadge}>{user?.role}</span>
                    </span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Wyloguj
                    </button>
                </div>
            </nav>

            <div style={styles.content}>
                <h2 style={styles.pageTitle}>Panel Administratora</h2>

                {message && (
                    <div style={{
                        ...styles.message,
                        backgroundColor: message.type === 'success'
                            ? '#f0fff4' : '#fff5f5',
                        borderColor: message.type === 'success'
                            ? '#68d391' : '#fc8181',
                        color: message.type === 'success'
                            ? '#276749' : '#c53030',
                    }}>
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'doctors' ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab('doctors')}
                    >
                        👨‍⚕️ Lekarze
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'addDoctor' ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab('addDoctor')}
                    >
                        ➕ Dodaj lekarza
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'slots' ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab('slots')}
                    >
                        📅 Sloty
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'addSlot' ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab('addSlot')}
                    >
                        ➕ Dodaj slot
                    </button>
                </div>

                {/* Lista lekarzy */}
                {activeTab === 'doctors' && (
                    <div>
                        <h3 style={styles.sectionTitle}>
                            Lista lekarzy ({doctors.length})
                        </h3>
                        {loading ? (
                            <p style={styles.loading}>Ładowanie...</p>
                        ) : doctors.length === 0 ? (
                            <div style={styles.emptyState}>
                                😔 Brak lekarzy w systemie
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {doctors.map(doctor => (
                                    <div key={doctor.id} style={styles.card}>
                                        <div style={styles.cardHeader}>
                                            <span style={styles.doctorName}>
                                                👨‍⚕️ Dr {doctor.firstName} {doctor.lastName}
                                            </span>
                                            <span style={styles.specBadge}>
                                                {doctor.specialization}
                                            </span>
                                        </div>
                                        <p style={styles.cardInfo}>
                                            🚪 Gabinet: {doctor.roomNumber}
                                        </p>
                                        <p style={styles.cardInfo}>
                                            📞 {doctor.phoneNumber}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Formularz dodawania lekarza */}
                {activeTab === 'addDoctor' && (
                    <div style={styles.formCard}>
                        <h3 style={styles.sectionTitle}>Dodaj nowego lekarza</h3>
                        <form onSubmit={handleAddDoctor} style={styles.form}>
                            <div style={styles.row}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Imię</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={doctorForm.firstName}
                                        onChange={handleDoctorChange}
                                        style={getInputStyle(doctorErrors, 'firstName')}
                                        placeholder="Anna"
                                    />
                                    {doctorErrors.firstName && (
                                        <span style={styles.error}>
                                            {doctorErrors.firstName}
                                        </span>
                                    )}
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Nazwisko</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={doctorForm.lastName}
                                        onChange={handleDoctorChange}
                                        style={getInputStyle(doctorErrors, 'lastName')}
                                        placeholder="Nowak"
                                    />
                                    {doctorErrors.lastName && (
                                        <span style={styles.error}>
                                            {doctorErrors.lastName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Specjalizacja</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={doctorForm.specialization}
                                    onChange={handleDoctorChange}
                                    style={getInputStyle(doctorErrors, 'specialization')}
                                    placeholder="Kardiologia"
                                />
                                {doctorErrors.specialization && (
                                    <span style={styles.error}>
                                        {doctorErrors.specialization}
                                    </span>
                                )}
                            </div>

                            <div style={styles.row}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Numer gabinetu</label>
                                    <input
                                        type="text"
                                        name="roomNumber"
                                        value={doctorForm.roomNumber}
                                        onChange={handleDoctorChange}
                                        style={getInputStyle(doctorErrors, 'roomNumber')}
                                        placeholder="101"
                                    />
                                    {doctorErrors.roomNumber && (
                                        <span style={styles.error}>
                                            {doctorErrors.roomNumber}
                                        </span>
                                    )}
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Numer telefonu</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={doctorForm.phoneNumber}
                                        onChange={handleDoctorChange}
                                        style={getInputStyle(doctorErrors, 'phoneNumber')}
                                        placeholder="123456789"
                                    />
                                    {doctorErrors.phoneNumber && (
                                        <span style={styles.error}>
                                            {doctorErrors.phoneNumber}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button type="submit" style={styles.submitBtn}>
                                ➕ Dodaj lekarza
                            </button>
                        </form>
                    </div>
                )}

                {/* Lista slotów */}
                {activeTab === 'slots' && (
                    <div>
                        <h3 style={styles.sectionTitle}>
                            Dostępne sloty ({slots.length})
                        </h3>
                        {loading ? (
                            <p style={styles.loading}>Ładowanie...</p>
                        ) : slots.length === 0 ? (
                            <div style={styles.emptyState}>
                                😔 Brak dostępnych slotów
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {slots.map(slot => (
                                    <div key={slot.id} style={styles.card}>
                                        <div style={styles.cardHeader}>
                                            <span style={styles.doctorName}>
                                                👨‍⚕️ Dr {slot.doctorFirstName} {slot.doctorLastName}
                                            </span>
                                            <span style={styles.specBadge}>
                                                {slot.doctorSpecialization}
                                            </span>
                                        </div>
                                        <p style={styles.cardInfo}>
                                            🕐 {formatDate(slot.startTime)}
                                        </p>
                                        <p style={styles.cardInfo}>
                                            🚪 Gabinet: {slot.roomNumber}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Formularz dodawania slotu */}
                {activeTab === 'addSlot' && (
                    <div style={styles.formCard}>
                        <h3 style={styles.sectionTitle}>Dodaj nowy slot</h3>
                        <form onSubmit={handleAddSlot} style={styles.form}>
                            <div style={styles.field}>
                                <label style={styles.label}>Lekarz</label>
                                <select
                                    name="doctorId"
                                    value={slotForm.doctorId}
                                    onChange={handleSlotChange}
                                    style={getInputStyle(slotErrors, 'doctorId')}
                                >
                                    <option value="">-- Wybierz lekarza --</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>
                                            Dr {doctor.firstName} {doctor.lastName} — {doctor.specialization}
                                        </option>
                                    ))}
                                </select>
                                {slotErrors.doctorId && (
                                    <span style={styles.error}>
                                        {slotErrors.doctorId}
                                    </span>
                                )}
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>
                                    Data i godzina (slot trwa 30 min)
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={slotForm.startTime}
                                    onChange={handleSlotChange}
                                    style={getInputStyle(slotErrors, 'startTime')}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                                {slotErrors.startTime && (
                                    <span style={styles.error}>
                                        {slotErrors.startTime}
                                    </span>
                                )}
                            </div>

                            <button type="submit" style={styles.submitBtn}>
                                ➕ Dodaj slot
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#ebf8ff' },
    navbar: {
        backgroundColor: '#2b6cb0',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navTitle: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
    navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    navUser: { color: '#bee3f8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
    roleBadge: {
        backgroundColor: '#2c5282',
        color: '#bee3f8',
        padding: '2px 8px',
        borderRadius: '10px',
        fontSize: '11px',
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #bee3f8',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' },
    pageTitle: { color: '#2b6cb0', fontSize: '24px', marginBottom: '24px' },
    message: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid',
        marginBottom: '24px',
        fontSize: '14px',
        fontWeight: '500',
    },
    tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    tab: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: '2px solid #bee3f8',
        backgroundColor: 'white',
        color: '#2b6cb0',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    activeTab: { backgroundColor: '#2b6cb0', color: 'white', borderColor: '#2b6cb0' },
    sectionTitle: { color: '#2d3748', fontSize: '18px', marginBottom: '16px' },
    loading: { color: '#718096', textAlign: 'center', padding: '32px' },
    emptyState: {
        textAlign: 'center',
        padding: '48px',
        backgroundColor: 'white',
        borderRadius: '12px',
        color: '#718096',
        fontSize: '16px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,100,200,0.1)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
    },
    doctorName: { fontWeight: '600', color: '#2d3748', fontSize: '15px' },
    specBadge: {
        backgroundColor: '#ebf8ff',
        color: '#2b6cb0',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },
    cardInfo: { color: '#718096', fontSize: '14px', margin: '4px 0' },
    formCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,100,200,0.1)',
        maxWidth: '600px',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    row: { display: 'flex', gap: '16px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
    label: { fontWeight: '600', color: '#2d3748', fontSize: '14px' },
    input: {
        padding: '10px 14px',
        borderRadius: '8px',
        border: '2px solid #bee3f8',
        fontSize: '16px',
        outline: 'none',
    },
    error: { color: '#e53e3e', fontSize: '13px' },
    submitBtn: {
        backgroundColor: '#2b6cb0',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};