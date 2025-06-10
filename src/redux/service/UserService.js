import api from './api';

    const getAllusers = async (page, size, sortBy,role)=> {
        if(role) {
            const response = await api.get(`user?pageNo=${page}&pageSize=${size}&sortBy=${sortBy}&role=${role}`);
            return response.data;
        }
        const response = await api.get(`user?pageNo=${page}&pageSize=${size}&sortBy=${sortBy}`);
        return response.data;
    }

    const getuserById = async (id) => {
        const response = await api.get(`users/${id}`);
        return response.data;
      };

    const createuser = async (user)=> {
        const response=  api.post(`users`, user);
        return response.data;
    }

    const updateuser = async (id, user) =>{
        return api.put(`users/${id}`, user);
    }

    const deleteuser = async(id) =>{
        console.log(id);
        
        return api.delete(`users/${id}`);
    }
const userService = {getAllusers, createuser, updateuser, deleteuser, getuserById};
export default userService;