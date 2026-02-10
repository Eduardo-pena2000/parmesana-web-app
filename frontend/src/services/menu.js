import api from './api';
import { FALLBACK_MENU } from '../data/fallbackMenu';
import toast from 'react-hot-toast';

const handleRequest = async (requestFn, fallbackData) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error('API Error, using fallback data:', error);
    // Only show toast if it's a network error or server error to avoid spamming on 404s
    if (!error.response || error.response.status >= 500) {
      toast.error('Modo Offline: Mostrando menú de respaldo', {
        id: 'offline-mode',
        duration: 4000,
        icon: '📡'
      });
    }
    // Return mock data structure matching API response
    return { success: true, ...fallbackData };
  }
};

export const menuService = {
  // Get all categories
  getCategories: async (includeItems = false) => {
    return handleRequest(
      () => api.get('/menu/categories', { params: { includeItems } }),
      { categories: FALLBACK_MENU.categories }
    );
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await api.get(`/menu/categories/${slug}`);
      return response.data;
    } catch (error) {
      const category = FALLBACK_MENU.categories.find(c => c.slug === slug);
      const items = FALLBACK_MENU.menuItems.filter(i => i.categoryId === (category?.id || 1));

      if (!category) return { success: false, message: 'Category not found' };

      return {
        success: true,
        category: category,
        menuItems: items
      };
    }
  },

  // Get all menu items
  getMenuItems: async (filters = {}) => {
    return handleRequest(
      () => api.get('/menu/items', { params: filters }),
      { menuItems: FALLBACK_MENU.menuItems }
    );
  },

  // Get menu item by slug
  getMenuItem: async (slug) => {
    try {
      const response = await api.get(`/menu/items/${slug}`);
      return response.data;
    } catch (error) {
      // Create a fake slug match or return first item
      const item = FALLBACK_MENU.menuItems[0];
      return { success: true, menuItem: item };
    }
  },

  // Get popular items
  getPopularItems: async (limit = 6) => {
    return handleRequest(
      () => api.get('/menu/popular', { params: { limit } }),
      { menuItems: FALLBACK_MENU.menuItems.slice(0, limit) }
    );
  },

  // Get featured items
  getFeaturedItems: async (limit = 4) => {
    return handleRequest(
      () => api.get('/menu/featured', { params: { limit } }),
      { menuItems: FALLBACK_MENU.menuItems.slice(0, limit) }
    );
  },

  // Search menu
  searchMenu: async (query) => {
    try {
      const response = await api.get('/menu/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      const lowerQ = query.toLowerCase();
      const filtered = FALLBACK_MENU.menuItems.filter(i =>
        i.name.toLowerCase().includes(lowerQ) ||
        i.description.toLowerCase().includes(lowerQ)
      );
      return { success: true, menuItems: filtered };
    }
  }
};
