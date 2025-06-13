/* eslint-disable no-useless-catch */
import api from "./api";
import apiAuth from "./apiAuth";

const getAllBook = async (page, size, sortBy,type) => {
  try {
    const response = await apiAuth.get(`/books?page=${page}&size=${size}&sortBy=${sortBy}&bookType=${type}`);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error; // You can rethrow the error if you want it to propagate to the calling code
  }
};

const addBook = async (data) => {
  try {
    console.log("Adding book with data:", data);
    
    const response = await api.post(`/books`, data);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error;
  }
};

const deleteBook = async (id) => {
  try {
    const response = await apiAuth.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const updateBook = async (id, data) => {
  try {
    const response = await apiAuth.put(`/books/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}
const getBookById = async (id) => {
  try {
    const response = await apiAuth.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
const addAuthor = async (data) => {
  try {
    const response = await api.post(`/authors`, data);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error;
  }
};
const getBooksByGenre = async (genre, page = 1, size = 10, sortBy = "bookId", type) => {
  try {
    const response = await apiAuth.get(`/books/genre?genre=${genre}&page=${page}&size=${size}&sortBy=${sortBy}&bookType=${type}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const BookService = { addBook, getAllBook, deleteBook, addAuthor,updateBook, getBookById,getBooksByGenre };
export default BookService;