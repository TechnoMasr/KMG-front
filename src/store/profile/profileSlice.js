import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile, logoutUser } from "../../services/authServices";

export const getProfileAct = createAsyncThunk(
  "profile/getProfileAct",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfile();

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load profile",
      );
    }
  },
);

export const logoutAct = createAsyncThunk(
  "profile/logoutAct",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutUser();

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load profile",
      );
    }
  },
);

const initialState = {
  profile: null,
  loading: true,
  logOutLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },

    finishLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileAct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAct.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfileAct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // log out
      .addCase(logoutAct.pending, (state) => {
        state.logOutLoading = true;
        state.error = null;
      })
      .addCase(logoutAct.fulfilled, (state) => {
        state.logOutLoading = false;
        state.profile = null;
      })
      .addCase(logoutAct.rejected, (state, action) => {
        state.logOutLoading = false;
        state.profile = null;
        state.error = action.payload;
      });
  },
});

export const { addProfile, clearProfile, finishLoading } = profileSlice.actions;
export default profileSlice.reducer;
