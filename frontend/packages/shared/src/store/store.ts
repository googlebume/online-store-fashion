import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "./slices/productsSlice";
import { filteredProductsReducer } from "./slices/filteredProductsSlice";
import { currentUserReducer } from "./slices/currentUserSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    filteredProducts: filteredProductsReducer,
    currentUser: currentUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
