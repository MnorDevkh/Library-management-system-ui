import api from './api';

    const getAllGenres = async (page, size, sortBy)=> {
        const response = await api.get(`genres?page=${page}&size=${size}&sortBy=${sortBy}`);
        return response.data;
    }

    const getGenreById = async (id) => {
        const response = await api.get(`genres/${id}`);
        return response.data;
      };

    const createGenre = async (genre)=> {
        const response=  api.post(`genres`, genre);
        return response.data;
    }

    const updateGenre = async (id, genre) =>{
        return api.put(`genres/${id}`, genre);
    }

    const deleteGenre = async(id) =>{
        console.log(id);
        
        return api.delete(`genres/${id}`);
    }
const GenreService = {getAllGenres, createGenre, updateGenre, deleteGenre, getGenreById};
export default GenreService;