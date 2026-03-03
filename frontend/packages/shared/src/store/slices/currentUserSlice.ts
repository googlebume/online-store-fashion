import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDataType } from "../../utils/types/userData.type";

type CurrentUserState = {
  currentUser: UserDataType | null;
};

const initialState: CurrentUserState = {
  currentUser: null,
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserDataType>) {
      state.currentUser = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
    patchCurrentUser(state, action: PayloadAction<Partial<UserDataType>>) {
      if (!state.currentUser) {
        return;
      }
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
  },
});

export const { setCurrentUser, clearCurrentUser, patchCurrentUser } =
  currentUserSlice.actions;
export const currentUserReducer = currentUserSlice.reducer;
