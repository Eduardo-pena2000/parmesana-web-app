import api from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  getUserOrders: async (filters = {}) => {
    const response = await api.get('/orders', {
      params: filters
    });
    return response.data;
  },

  // Get order by ID
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Rate order
  rateOrder: async (orderId, rating, review) => {
    const response = await api.put(`/orders/${orderId}/rate`, { rating, review });
    return response.data;
  },

  // Get order statistics
  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  }
};
