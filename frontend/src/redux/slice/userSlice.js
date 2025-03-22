import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunk for fetching user profile
export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (userId, { getState }) => {
    const { token } = getState().user
    try {
      const response = await axios.get(
        `http://localhost:9999/api/user/${userId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle token expiration
        dispatch(setLogout())
        throw new Error('Session expired. Please login again.')
      }
      throw error
    }
  }
)

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (formData, { getState }) => {
    const { token } = getState().user
    try {
      const response = await axios.put(
        `http://localhost:9999/api/user/${getState().user.user._id}/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle token expiration
        dispatch(setLogout())
        throw new Error('Session expired. Please login again.')
      }
      throw error
    }
  }
)

// Load state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('userState')
    if (serializedState === null) {
      return {
        user: null,
        token: null,
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Error loading auth state:', err)
    return {
      user: null,
      token: null,
    }
  }
}

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('userState', serializedState)
  } catch (err) {
    console.error('Error saving auth state:', err)
  }
}

const initialState = loadState()

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      saveState(state)
    },

    setLogout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('userState')
    },

    setTripList: (state, action) => {
      if (state.user) {
        state.user.tripList = action.payload
        saveState(state)
      }
    },

    setWishList: (state, action) => {
      if (state.user) {
        state.user.wishList = action.payload
        saveState(state)
      }
    },

    setPropertyList: (state, action) => {
      if (state.user) {
        state.user.propertyList = action.payload
        saveState(state)
      }
    },

    setReservationList: (state, action) => {
      if (state.user) {
        state.user.reservationList = action.payload
        saveState(state)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { 
          ...state.user, 
          ...action.payload,
          profileImagePath: action.payload.profileImagePath 
        }
        state.status = 'succeeded'
        saveState(state)
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const {
  setLogin,
  setLogout,
  setTripList,
  setWishList,
  setPropertyList,
  setReservationList
} = userSlice.actions

export default userSlice.reducer
