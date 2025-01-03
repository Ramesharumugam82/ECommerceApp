import { createSlice } from '@reduxjs/toolkit';

const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
};

const loadShippingAddressFromLocalStorage = () => {
    const savedAddress = localStorage.getItem('shippingAddress');
    return savedAddress ? JSON.parse(savedAddress) : {};
};

const saveCartToLocalStorage = (cartItems) => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartItemsUpdated'));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCartFromLocalStorage(), // Load initial state from local storage
        shippingAddress: loadShippingAddressFromLocalStorage(), // Load shipping address from local storage
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
            saveCartToLocalStorage(state.items); // Save to local storage
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id); // Remove item from cart
            saveCartToLocalStorage(state.items); // Save to local storage
        },
        updateCartItemQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find((x) => x.id === id);
            if (existingItem) {
                existingItem.quantity = quantity; // Update quantity
                if (existingItem.quantity <= 0) {
                    state.items = state.items.filter((item) => item.id !== id); // Remove item if quantity is 0 or less
                }
            }
            saveCartToLocalStorage(state.items); // Save to local storage
        },
        clearCart: (state) => {
            state.items = []; // Clear the cart
            localStorage.removeItem('cartItems'); // Remove from local storage
            window.dispatchEvent(new Event('cartItemsUpdated'));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload; // Save shipping address
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload)); // Save to local storage
        },
    },
});

// Export actions and reducer
export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart, saveShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;