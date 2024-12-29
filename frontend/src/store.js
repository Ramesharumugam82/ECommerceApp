import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./features/productsSlice";
import productReducer from "./features/productSlice";
import cartReducer from './features/cartSlice';
import loginReducer from "./features/login_Slice";
import registerReducer from "./features/register_Slice";
import updateReducer from "./features/updateSlice"; // Updated import for updateSlice
import profileReducer from "./features/profileSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    product: productReducer,
    cart: cartReducer,
    login: loginReducer,
    register: registerReducer,
    update: updateReducer, // Updated to use updateSlice
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check if needed for non-serializable data like JWT
    }),
});

export default store;
