import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../utils/types/prosuctData.type";

type FilteredProductsState = {
  filteredProducts: ProductType[];
};

const initialState: FilteredProductsState = {
  filteredProducts: [],
};

const filteredProductsSlice = createSlice({
  name: "filteredProducts",
  initialState,
  reducers: {
    setFilteredProducts(state, action: PayloadAction<ProductType[]>) {
      state.filteredProducts = action.payload;
    },
    clearFilteredProducts(state) {
      state.filteredProducts = [];
    },
  },
});

export const { setFilteredProducts, clearFilteredProducts } =
  filteredProductsSlice.actions;
export const filteredProductsReducer = filteredProductsSlice.reducer;
