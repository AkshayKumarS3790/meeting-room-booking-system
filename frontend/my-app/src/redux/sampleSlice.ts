import { createSlice } from "@reduxjs/toolkit";

const sampleSlice = createSlice({
  name: "sample",
  initialState: { value: 0 },
  reducers: {},
});

export default sampleSlice.reducer;
