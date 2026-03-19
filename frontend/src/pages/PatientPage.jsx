import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { slotService, bookingService } from '../services/api.js';

export default function PatientPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('slots');
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (activeTab === 'slots') fetchSlots();
        if (activeTab === 'bookings') fetchBookings();
    }, [activeTab]);

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

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getMyBookings();
            setBookings(response.data);
        } catch (err) {
            showMessage('Błąd pobierania rezerwacji', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (slot) => {
        try {
            const token = localStorage.getItem('token');
            await bookingService.create({
                slotId: slot.id,
                doctorId: slot.doctorId,
            }, token);
            showMessage('Rezerwacja została dokonana!', 'success');
            fetchSlots();
        } catch (err) {
            if (err.response?.data?.message?.includes('Maximum')) {
                showMessage('Osiągnięto limit 3 aktywnych rezerwacji!', 'error');
            } else {
                showMessage('Błąd podczas rezerwacji — ' + err.response?.status, 'error');
            }
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Czy na pewno chcesz anulować tę rezerwację?'))
            return;
        try {
            await bookingService.cancel(bookingId);
            showMessage('Rezerwacja została anulowana', 'success');
            fetchBookings();
        } catch (err) {
            showMessage('Błąd podczas anulowania rezerwacji', 'error');
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

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <span style={styles.navTitle}>🏥 MedApp</span>
                <div style={styles.navRight}>
                    <span style={styles.navUser}>
                        👤 {user?.firstName} {user?.lastName}
                    </span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Wyloguj
                    </button>
                </div>
            </nav>

            <div style={styles.content}>
                <h2 style={styles.pageTitle}>Panel Pacjenta</h2>

                {/* Komunikat */}
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
                            ...(activeTab === 'slots' ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab('slots')}
                    >
                        📅 Dostępne terminy
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'bookings' ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab('bookings')}
                    >
                        📋 Moje rezerwacje
                    </button>
                </div>

                {/* Dostępne sloty */}
                {activeTab === 'slots' && (
                    <div>
                        <h3 style={styles.sectionTitle}>
                            Dostępne terminy (najbliższe 30 dni)
                        </h3>
                        {loading ? (
                            <p style={styles.loading}>Ładowanie...</p>
                        ) : slots.length === 0 ? (
                            <div style={styles.emptyState}>
                                😔 Brak dostępnych terminów
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {slots.map(slot => (
                                    <div key={slot.id} style={styles.card}>
                                        <div style={styles.cardHeader}>
                                            <span style={styles.doctorName}>
                                                👨‍⚕️ Dr {slot.doctorFirstName} {slot.doctorLastName}
                                            </span>
                                            <span style={styles.specialization}>
                                                {slot.doctorSpecialization}
                                            </span>
                                        </div>
                                        <div style={styles.cardBody}>
                                            <p style={styles.cardInfo}>
                                                🕐 {formatDate(slot.startTime)} — {formatDate(slot.endTime)}
                                            </p>
                                            <p style={styles.cardInfo}>
                                                🚪 Gabinet: {slot.roomNumber}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleBook(slot)}
                                            style={styles.bookBtn}
                                        >
                                            Zarezerwuj
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Moje rezerwacje */}
                {activeTab === 'bookings' && (
                    <div>
                        <h3 style={styles.sectionTitle}>
                            Historia moich rezerwacji
                        </h3>
                        {loading ? (
                            <p style={styles.loading}>Ładowanie...</p>
                        ) : bookings.length === 0 ? (
                            <div style={styles.emptyState}>
                                😔 Nie masz jeszcze żadnych rezerwacji
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {bookings.map(booking => (
                                    <div key={booking.id} style={{
                                        ...styles.card,
                                        borderLeft: `4px solid ${
                                            booking.status === 'ACTIVE'
                                                ? '#48bb78' : '#fc8181'
                                        }`,
                                    }}>
                                        <div style={styles.cardHeader}>
                                            <span style={styles.doctorName}>
                                                Rezerwacja #{booking.id}
                                            </span>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: booking.status === 'ACTIVE'
                                                    ? '#f0fff4' : '#fff5f5',
                                                color: booking.status === 'ACTIVE'
                                                    ? '#276749' : '#c53030',
                                            }}>
                                                {booking.status === 'ACTIVE'
                                                    ? '✅ Aktywna' : '❌ Anulowana'}
                                            </span>
                                        </div>
                                        <div style={styles.cardBody}>
                                            <p style={styles.cardInfo}>
                                                🕐 {formatDate(booking.appointmentTime)}
                                            </p>
                                            <p style={styles.cardInfo}>
                                                📅 Utworzona: {formatDate(booking.createdAt)}
                                            </p>
                                        </div>
                                        {booking.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                style={styles.cancelBtn}
                                            >
                                                Anuluj rezerwację
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#ebf8ff',
    },
    navbar: {
        backgroundColor: '#2b6cb0',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navTitle: {
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    navUser: {
        color: '#bee3f8',
        fontSize: '14px',
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
    content: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px 16px',
    },
    pageTitle: {
        color: '#2b6cb0',
        fontSize: '24px',
        marginBottom: '24px',
    },
    message: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid',
        marginBottom: '24px',
        fontSize: '14px',
        fontWeight: '500',
    },
    tabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
    },
    tab: {
        padding: '10px 24px',
        borderRadius: '8px',
        border: '2px solid #bee3f8',
        backgroundColor: 'white',
        color: '#2b6cb0',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    activeTab: {
        backgroundColor: '#2b6cb0',
        color: 'white',
        borderColor: '#2b6cb0',
    },
    sectionTitle: {
        color: '#2d3748',
        fontSize: '18px',
        marginBottom: '16px',
    },
    loading: {
        color: '#718096',
        textAlign: 'center',
        padding: '32px',
    },
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
    doctorName: {
        fontWeight: '600',
        color: '#2d3748',
        fontSize: '15px',
    },
    specialization: {
        backgroundColor: '#ebf8ff',
        color: '#2b6cb0',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },
    cardBody: {
        marginBottom: '16px',
    },
    cardInfo: {
        color: '#718096',
        fontSize: '14px',
        margin: '4px 0',
    },
    bookBtn: {
        width: '100%',
        backgroundColor: '#2b6cb0',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    cancelBtn: {
        width: '100%',
        backgroundColor: '#fff5f5',
        color: '#c53030',
        border: '1px solid #fc8181',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    statusBadge: {
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },
};