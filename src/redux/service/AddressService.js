const baseUrl = "https//pumi.onrender.com/pumi/";

const fetchProvince = async () => {
  try {
    const url = baseUrl + "provinces"; // Corrected URL construction
    console.log(url);

    const response = await fetch('pumi.onrender.com/pumi/provinces');
    console.log(response);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch province data: ${response.status} ${response.statusText}`); // Improved error message
    }
    const data = await response.json();
    return data.items; // Assuming the data structure has an 'items' array
  } catch (error) {
    console.error('Error fetching province data:', error);
    throw error;
  }
};

const fetchDistrict = async (provinceId) => { // provinceId is used later if it's needed for filtering.
  try {
    const url = baseUrl + `districts?province_id=${provinceId}`; // Corrected URL construction
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch district data: ${response.status} ${response.statusText}`); // Improved error message
    }
    const data = await response.json();

    // Filter the districts based on the provinceId, if needed.
    if (provinceId) {
      const filteredData = data.items.filter(district => district.province_id === provinceId);
      return filteredData;
    }

    return data.items; // Assuming the data structure has an 'items' array
  } catch (error) {
    console.error('Error fetching district data:', error);
    throw error;
  }
};

const AddressService = { fetchProvince, fetchDistrict }; // Corrected export

export default AddressService;