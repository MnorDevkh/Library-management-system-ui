import apiAuth from "./apiAuth";

const getAllStaff = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiAuth.get(`/staff`);
      return response.data;
    } catch (error) {
      throw error; 
    }
  };

const deleteStaff = async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiAuth.delete(`/staff/${id}`);
      return response.data;
    } catch (error) {
      throw error; 
    }
  }
  const addStaff = async (staff) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await apiAuth.post(`/staff`, staff);
      return response.data;
    } catch (error) {
      throw error; 
    }
  }
  const updateStaff = async (id, staff) => {
    console.log(staff);
    console.log(id); 
    const response = await apiAuth.put(`/staff/${id}`, staff);
    return response.data;
  } 
  const getStaffById = async (id) => {
      const response = await apiAuth.get(`/staff/${id}`);
      return response.data;
  }

  
const StaffService = {getAllStaff, deleteStaff, addStaff, updateStaff,getStaffById};
export default StaffService;