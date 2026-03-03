import { ProductType } from "../utils/types/prosuctData.type";
import { UserDataType } from "../utils/types/userData.type";
import {
  addProduct,
  clearProducts,
  removeProductById,
  setProducts,
} from "./slices/productsSlice";
import {
  clearFilteredProducts,
  setFilteredProducts,
} from "./slices/filteredProductsSlice";
import {
  clearCurrentUser,
  patchCurrentUser,
  setCurrentUser,
} from "./slices/currentUserSlice";

export const productsActions = {
  setProducts: (products: ProductType[]) => setProducts(products),
  addProduct: (product: ProductType) => addProduct(product),
  removeProductById: (productId: ProductType["id"]) => removeProductById(productId),
  clearProducts: () => clearProducts(),
};

export const filteredProductsActions = {
  setFilteredProducts: (products: ProductType[]) => setFilteredProducts(products),
  clearFilteredProducts: () => clearFilteredProducts(),
};

export const currentUserActions = {
  setCurrentUser: (user: UserDataType) => setCurrentUser(user),
  patchCurrentUser: (payload: Partial<UserDataType>) => patchCurrentUser(payload),
  clearCurrentUser: () => clearCurrentUser(),
};
