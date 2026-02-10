export const FALLBACK_MENU = {
    categories: [
        { id: 1, name: 'Pizzas', slug: 'pizzas', icon: '🍕' },
        { id: 2, name: 'Hamburguesas', slug: 'hamburguesas', icon: '🍔' },
        { id: 3, name: 'Bebidas', slug: 'bebidas', icon: '🥤' }
    ],
    menuItems: [
        {
            id: 101,
            name: 'Pizza Pepperoni (Demo)',
            description: 'Clásica pizza de pepperoni con doble queso. (Modo Offline)',
            price: 180,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000',
            categoryId: 1,
            isAvailable: true
        },
        {
            id: 102,
            name: 'Hamburguesa Doble (Demo)',
            description: 'Carne angus, tocino y queso cheddar. (Modo Offline)',
            price: 150,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800',
            categoryId: 2,
            isAvailable: true
        },
        {
            id: 103,
            name: 'Coca Cola (Demo)',
            description: 'Refresco de cola bien frío. (Modo Offline)',
            price: 35,
            image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800',
            categoryId: 3,
            isAvailable: true
        }
    ]
};
