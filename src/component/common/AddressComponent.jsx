import React, { useEffect, useState } from 'react';
import AddressService from '../../redux/service/AddressService';
import { Select, Spin } from 'antd';

const { Option } = Select;

const AddressComponent = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    const getProvinces = async () => {
      try {
        const data = await AddressService.fetchProvince();
        setProvinces(data || []); // Ensure data is an array
        setLoadingProvinces(false);
      } catch (error) {
        setError(error.message);
        setLoadingProvinces(false);
      }
    };

    getProvinces();
  }, []);

  const handleProvinceChange = async (provinceId) => {
    setLoadingDistricts(true);
    try {
      const data = await AddressService.fetchDistrict(provinceId);
      setDistricts(data || []); // Ensure data is an array
      setLoadingDistricts(false);
    } catch (error) {
      setError(error.message);
      setLoadingDistricts(false);
    }
  };

  if (loadingProvinces) {
    return <div>Loading provinces...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Address Data</h1>
      <Select
        placeholder="Select a province"
        style={{ width: 200 }}
        onChange={handleProvinceChange}
      >
        {provinces.map((province) => (
          <Option key={province.code} value={province.code}>
            {province.name_en}
          </Option>
        ))}
      </Select>
      {loadingDistricts ? (
        <Spin />
      ) : (
        <ul>
          {districts.map((district, index) => (
            <li key={index}>{district.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressComponent;