import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publishers: [],
  publisherById: [],
  publisherImport: [],
  purchaseById: []
};
const PublisherSlice = createSlice({
  name: "publisher",
  initialState,
  reducers: {
    setPublishers: (state, action) => {
      state.publishers = action.payload;
    },
    setPublisherById: (state, action) => {
      state.publisherById = action.payload;
    },
    setPublisherImport: (state, action) => {
      state.publisherImport = action.payload;
    },
    setPurchaseById: (state, action) => {
      state.purchaseById = action.payload;
    },
  },
});
export const{ setPublishers, setPublisherById, setPublisherImport, setPurchaseById } = PublisherSlice.actions;
export default PublisherSlice.reducer;