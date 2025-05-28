import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authors: [],
    authorById: [],
    authorImport: [],
    purchaseById: []
    };
const AuthorSlice = createSlice({
    name: "author",
    initialState,
    reducers: {
        setAuthors: (state, action) => {
            state.authors = action.payload;
        },
        setAuthorById: (state, action) => {
            state.authorById = action.payload;
        },
        setAuthorImport: (state, action) => {
            state.authorImport = action.payload;
        },
        setPurchaseById: (state, action) => {
            state.purchaseById = action.payload;
        },
    },
});
export const{ setAuthors, setAuthorById, setAuthorImport, setPurchaseById } = AuthorSlice.actions;
export default AuthorSlice.reducer;