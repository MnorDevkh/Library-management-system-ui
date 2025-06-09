import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/BookSlice";
import shelfReducer from "./slices/ShelfSlice";
import genreReducer from "./slices/GenreSlice";
import authorReducer from "./slices/AuthorSlice";
import publisherReducer from "./slices/PublisherSlice";
import  staffReducer  from "./slices/StaffSlice";
import borrowReducer from "./slices/borrowSlice";

const store= configureStore({
    reducer: {
        auth: authReducer,
        book: bookReducer,
        shelf: shelfReducer,
        genre: genreReducer,
        author: authorReducer,
        publicsher: publisherReducer,
        staff: staffReducer,
        borrow: borrowReducer,
        // user: userReducer,
    }
})
export default store