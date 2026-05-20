import axios from 'axios';

const API_URL = '';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
};

export const doctorService = {
    getAll: () => api.get('/api/doctors'),
    getById: (id) => api.get(`/api/doctors/${id}`),
    add: (data) => api.post('/api/doctors', data),
    getBySpecialization: (spec) =>
        api.get(`/api/doctors/specialization/${spec}`),
};

export const slotService = {
    getAvailable: () => api.get('/api/slots/available'),
    getByDoctor: (doctorId) =>
        api.get(`/api/slots/doctor/${doctorId}`),
    add: (data) => api.post('/api/slots', data),
};

export const bookingService = {
    // UPROSZCZONE: Interceptor sam doda token, nie musisz go tu wyciągać!
    create: (data) => api.post('/api/bookings', data),
    getMyBookings: () => api.get('/api/bookings/my'),
    cancel: (id) => api.delete(`/api/bookings/${id}`),
};

export default api;