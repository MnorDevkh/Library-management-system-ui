/* eslint-disable no-useless-catch */

import api from "./api";

// Get all borrowings with pagination and sorting
const getAllBorrowings = async (page = 1, size = 10, sortBy = "borrowingId") => {
  try {
    const response = await api.get(`/borrowings?page=${page}&size=${size}&sortBy=${sortBy}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get borrowing by ID
const getBorrowingById = async (borrowingId) => {
  try {
    const response = await api.get(`/borrowings/${borrowingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new borrowing
const addBorrowing = async (payload) => {
  try {
    const response = await api.post("/borrowings", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a borrowing
const updateBorrowing = async (borrowingId, payload) => {
  try {
    const response = await api.put(`/borrowings?id=${borrowingId}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a borrowing
const deleteBorrowing = async (borrowingId) => {
  try {
    const response = await api.delete(`/borrowings/${borrowingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const BorrowService = {
  getAllBorrowings,
  getBorrowingById,
  addBorrowing,
  updateBorrowing,
  deleteBorrowing,
};

export default BorrowService;