import api from "./api";

const getAllSearch = async (filter) => {
  try {
    const encodedFilter = encodeURIComponent(filter);
    const response = await api.get(`/search/all?filter=${encodedFilter}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

const SearchService = { getAllSearch };

export default SearchService;