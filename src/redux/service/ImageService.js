/* eslint-disable no-useless-catch */
import api from "./api";
import apiAuth from "./apiAuth";

const upload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Ensure the key matches the server's expected parameter name
    const response = await api.post(`/uploads/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getUrl = async (fileName) => {
  try {
    console.log(fileName);
    const response = await api.get(`/uploads/url/${fileName}`);
    
    
    console.log(response);
    
    return response;
  } catch (error) {
    throw error;
  }
}
const getListMedia = async (page, size) => {
  try {
    const response = await api.get(`/uploads/images/list?page=${page}&size=${size}`);
    console.log(response);
    
    return response;
  } catch (error) {
    throw error;
  }
}

const deleteMedia = async (filePath) => {
  try {
    const fileName = filePath.split("/").pop();
    console.log("Deleting file:", fileName);
    await api.delete(`/uploads/images/${fileName}`);
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};

const removeImage = async (id) => {
  try {
    await api.delete(`/image/${id}`);
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};

const removeImageList = async (idList) => {
  const query = idList.map(id => `idList=${id}`).join('&');
  console.log(query);

  try {
    await api.delete(`/image?${query}`);
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};

const addSlideshow = async (data) => {
  try {
    const response = await api.post(`/image`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getImageByType = async (type) => {
  try {
    const response = await apiAuth.get(`/image/${type}`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getpdf = async (fileName) => {
  try {
    const response = await apiAuth.get(`/uploads/pdf/${fileName}`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const ImageService = {
  upload,getUrl,getListMedia,deleteMedia,addSlideshow,getImageByType,getpdf,removeImage,removeImageList
};

export default ImageService;