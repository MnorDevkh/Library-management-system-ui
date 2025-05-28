/* eslint-disable no-useless-catch */

import api from "./api";

const getAllAuthors = async (page, size, sortBy) => {
  try {
    const response = await api.get(`/authors?page=${page}&size=${size}&sortBy=${sortBy}`);
    console.log(response);
    
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error; // You can rethrow the error if you want it to propagate to the calling code
  }
};

const getAuthorById = async (id) => {
  try {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error; // You can rethrow the error if you want it to propagate to the calling code
  }
};

const addAuthor = async (data) => {
  try {
    const response = await api.post(`/authors`, data);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error;
  }
};

const updateAuthor = async (id, data) => {
  try {
    const response = await api.put(`/authors/${id}`, data);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error;
  }
};
const deleteAuthor = async (id) => {
  try {
    const response = await api.delete(`/authors/${id}`);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error;
  }
}

const AuthorService = { getAllAuthors, getAuthorById, addAuthor, updateAuthor, deleteAuthor };
export default AuthorService;