/* eslint-disable no-useless-catch */

import api from "./api";

const getAllPublicher = async (page,size,sortBy) => {
    try {
      const response = await api.get(`/publishers?page=${page}&size=${size}&sortBy=${sortBy}`);
      return response.data;
    } catch (error) {
      // Handle the error here
      throw error; // You can rethrow the error if you want it to propagate to the calling code
    }
  };

const updatePublisher = async (publisherId, payload) => {
  try {
    const response = await api.put(`/publishers/${publisherId}`, payload);
    return response.data;
  } catch (error) {
    throw error; // Handle the error here
  }
};

const getPublisherById = async (publisherId) => {
  try {
    const response = await api.get(`/publishers/${publisherId}`);
    return response.data;
  } catch (error) {
    throw error; // Handle the error here
  }
};
const addPublisher = async (payload) => {
  try {
    const response = await api.post("/publishers", payload);
    return response.data;
  } catch (error) {
    throw error; // Handle the error here
  }
};
const PublisherService = { getAllPublicher,updatePublisher,getPublisherById,addPublisher };
export default PublisherService;