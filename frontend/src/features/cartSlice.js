// src/features/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCartFromLocalStorage(), // Load initial state from local storage
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find((x) => x.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity; // Update quantity if item exists
            } else {
                state.items.push(item); // Add new item to cart
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items)); // Save to local storage
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id); // Remove item from cart
            localStorage.setItem('cartItems', JSON.stringify(state.items)); // Save to local storage
        },
        updateCartItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find((x) => x.id === id);
            if (existingItem) {
                existingItem.quantity += quantity; // Update quantity
                if (existingItem.quantity <= 0) {
                    state.items = state.items.filter((item) => item.id !== id); // Remove item if quantity is 0 or less
                }
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items)); // Save to local storage
        },
        clearCart: (state) => {
            state.items = []; // Clear the cart
            localStorage.removeItem('cartItems'); // Remove from local storage
        },
    },
});

// Export actions and reducer
export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;