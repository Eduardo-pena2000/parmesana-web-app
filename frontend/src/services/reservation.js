import api from './api';

export const reservationService = {
    // Create a new reservation
    create: async (reservationData) => {
        const response = await api.post('/reservations', reservationData);
        return response.data;
    },

    // Get user's reservations
    getMyReservations: async () => {
        const response = await api.get('/reservations/my-reservations');
        return response.data;
    }
};
