import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../utils/types/prosuctData.type";

type ProductsState = {
  products: ProductType[];
};

const initialState: ProductsState = {
  products: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<ProductType[]>) {
      state.products = action.payload;
    },
    addProduct(state, action: PayloadAction<ProductType>) {
      state.products.push(action.payload);
    },
    removeProductById(state, action: PayloadAction<ProductType["id"]>) {
      state.products = state.products.filter((item) => item.id !== action.payload);
    },
    clearProducts(state) {
      state.products = [];
    },
  },
});

export const { setProducts, addProduct, removeProductById, clearProducts } =
  productsSlice.actions;
export const productsReducer = productsSlice.reducer;
