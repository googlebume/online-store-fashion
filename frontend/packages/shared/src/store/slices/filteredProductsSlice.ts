import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../utils/types/prosuctData.type";

type FilteredProductsState = {
  filteredProducts: ProductType[];
  /** Якщо true — показуємо `filteredProducts` навіть коли масив порожній (нема збігів). Інакше показуємо повний `products`. */
  filtersActive: boolean;
};

const initialState: FilteredProductsState = {
  filteredProducts: [],
  filtersActive: false,
};

const filteredProductsSlice = createSlice({
  name: "filteredProducts",
  initialState,
  reducers: {
    setFilteredProducts(state, action: PayloadAction<ProductType[]>) {
      state.filteredProducts = action.payload;
    },
    setFiltersActive(state, action: PayloadAction<boolean>) {
      state.filtersActive = action.payload;
    },
    clearFilteredProducts(state) {
      state.filteredProducts = [];
      state.filtersActive = false;
    },
  },
});

export const { setFilteredProducts, setFiltersActive, clearFilteredProducts } =
  filteredProductsSlice.actions;
export const filteredProductsReducer = filteredProductsSlice.reducer;
