export { store } from "./store";
export type { RootState, AppDispatch } from "./store";
export { productsActions, filteredProductsActions, currentUserActions } from "./actionCreators";
export {
  setProducts,
  addProduct,
  removeProductById,
  clearProducts,
} from "./slices/productsSlice";
export {
  setFilteredProducts,
  clearFilteredProducts,
} from "./slices/filteredProductsSlice";
export {
  setCurrentUser,
  clearCurrentUser,
  patchCurrentUser,
} from "./slices/currentUserSlice";
