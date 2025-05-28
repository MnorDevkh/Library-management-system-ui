// const getAllList = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file); // Ensure the key matches the server's expected parameter name
//       const response = await api.post(`/uploads/images`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };
//   e