import { create } from 'zustand';
import { authService } from '../services/auth';

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al iniciar sesión',
        isLoading: false
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al registrarse',
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
    }
  },

  updateUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData }
    }));
    localStorage.setItem('user', JSON.stringify({ ...useAuthStore.getState().user, ...userData }));
  },

  clearError: () => set({ error: null })
}));
