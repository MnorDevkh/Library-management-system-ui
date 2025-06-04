 /* eslint-disable no-useless-catch */
import api from "./api";
import apiAuth from "./apiAuth";

const getAllShelf = async (page,size,sortBy) => {
  try {
    const response = await apiAuth.get(`/bookshelf?page=${page}&size=${size}&sortBy=${sortBy}`);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error; // You can rethrow the error if you want it to propagate to the calling code
  }
};


const getShelfbyId = async (id) => {
  try {  
    const response = await apiAuth.get(`/bookshelf/${id}`);
    return response.data;
  } catch (error) {
    // Handle the error here
    throw error; // You can rethrow the error if you want it to propagate to the calling code
  }
};

const addShelf = async (data) => {
    try {
      const response = await api.post(`/bookshelf`, data);
      return response.data;
    } catch (error) {
      // Handle the error here
      throw error;
    }
  };
  const updateShelf = async (id, data) => {
  try {
    const response = await apiAuth.put(`/bookshelf/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const deleteBook = async (id) => {
  try {
    const response = await apiAuth.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}




const ShelfService = {addShelf,getAllShelf,deleteBook, getShelfbyId,updateShelf};
export default ShelfService;