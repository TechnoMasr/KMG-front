import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import settingReducer from "./setting/setting";
import languageReducer from "./languageSlice/languageSlice";
import modalsReducer from "./modals/modalsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    setting: settingReducer,
    language: languageReducer,
    modals: modalsReducer,
  },
});
