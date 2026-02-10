import api from './api';

export const menuService = {
  // Get all categories
  getCategories: async (includeItems = false) => {
    const response = await api.get('/menu/categories', {
      params: { includeItems }
    });
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/menu/categories/${slug}`);
    return response.data;
  },

  // Get all menu items
  getMenuItems: async (filters = {}) => {
    const response = await api.get('/menu/items', {
      params: filters
    });
    return response.data;
  },

  // Get menu item by slug
  getMenuItem: async (slug) => {
    const response = await api.get(`/menu/items/${slug}`);
    return response.data;
  },

  // Get popular items
  getPopularItems: async (limit = 6) => {
    const response = await api.get('/menu/popular', {
      params: { limit }
    });
    return response.data;
  },

  // Get featured items
  getFeaturedItems: async (limit = 4) => {
    const response = await api.get('/menu/featured', {
      params: { limit }
    });
    return response.data;
  },

  // Search menu
  searchMenu: async (query) => {
    const response = await api.get('/menu/search', {
      params: { q: query }
    });
    return response.data;
  }
};
