import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Account {
  name: string | undefined,
  username: string | undefined,
  email: string | undefined,
  dateOfBirth: string | undefined,
  phone: string | undefined
}

const initialState: Account = {
  name: undefined,
  username: undefined,
  email: undefined,
  dateOfBirth: undefined,
  phone: undefined
}

export const accountSlice = createSlice({
  name: "account-details",
  initialState,
  reducers: {
    nameChanged: (state, action: PayloadAction<string | undefined>) => {
      state.name = action.payload
    },
    usernameChanged: (state, action: PayloadAction<string | undefined>) => {
      state.username = action.payload
    },
    emailChanged: (state, action: PayloadAction<string | undefined>) => {
      state.email = action.payload
    },
    dobChanged: (state, action: PayloadAction<string | undefined>) => {
      state.dateOfBirth = action.payload
    },
    phoneChanged: (state, action: PayloadAction<string | undefined>) => {
      state.phone = action.payload
    },
  }
})

export const { nameChanged, usernameChanged, emailChanged, dobChanged, phoneChanged } = accountSlice.actions;
export default accountSlice.reducer;

export const selectAccount = (state: any) => ({
  name: state.accountData.name,
  username: state.accountData.username,
  email: state.accountData.email,
  dateOfBirth: state.accountData.dateOfBirth,
  phone: state.accountData.phone
})
