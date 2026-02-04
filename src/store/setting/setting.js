import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsMinutesRange,
  getSettings,
} from "../../services/mainServices";

export const fetchSetting = createAsyncThunk(
  "setting/fetchSetting",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getSettings();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error_msg || "Failed to load settings",
      );
    }
  },
);

export const fetchProductsMinutesRange = createAsyncThunk(
  "productsMinutesRange/fetchProductsMinutesRange",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProductsMinutesRange();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.error_msg || "Failed to load productsMinutesRange",
      );
    }
  },
);

const appSetting = createSlice({
  name: "setting",
  initialState: {
    setting: {},
    countries: [],
    productsMinutesRange: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.setting = action.payload;
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(fetchProductsMinutesRange.fulfilled, (state, action) => {
        state.productsMinutesRange = action.payload;
      });
  },
});

export default appSetting.reducer;
