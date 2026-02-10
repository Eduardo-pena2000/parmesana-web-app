import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            i => i.id === item.id && 
            i.size === item.size &&
            JSON.stringify(i.extras) === JSON.stringify(item.extras)
          );

          if (existingItem) {
            return {
              items: state.items.map(i =>
                i === existingItem
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              )
            };
          }

          return {
            items: [...state.items, { ...item, quantity: item.quantity || 1 }]
          };
        });
      },

      // Remove item from cart
      removeItem: (itemIndex) => {
        set((state) => ({
          items: state.items.filter((_, index) => index !== itemIndex)
        }));
      },

      // Update item quantity
      updateQuantity: (itemIndex, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemIndex);
          return;
        }

        set((state) => ({
          items: state.items.map((item, index) =>
            index === itemIndex ? { ...item, quantity } : item
          )
        }));
      },

      // Clear cart
      clearCart: () => set({ items: [] }),

      // Get cart total
      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          let itemPrice = parseFloat(item.basePrice);
          
          // Add size price if specified
          if (item.sizePrice) {
            itemPrice = parseFloat(item.sizePrice);
          }
          
          // Add extras
          if (item.extras && Array.isArray(item.extras)) {
            const extrasTotal = item.extras.reduce((sum, extra) => {
              return sum + parseFloat(extra.price || 0);
            }, 0);
            itemPrice += extrasTotal;
          }
          
          return total + (itemPrice * item.quantity);
        }, 0);
      },

      // Get item count
      getItemCount: () => {
        const items = get().items;
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      // Check if cart has items
      hasItems: () => get().items.length > 0
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage
    }
  )
);
