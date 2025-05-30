import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuComponent from "../MenuComponent";
import { Card, Drawer } from "antd";
import StaffService from "../../redux/service/StaffService";
import { setStaffs } from "../../redux/slices/StaffSlice";
import baseURL from "../../redux/service/url";

const { Meta } = Card;

const StaffComponent = () => {
  const dispatch = useDispatch();
  const allStaff = useSelector((state) => state.staff.staffs);
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const getAllStaff = async () => {
    try {
      const res = await StaffService.getAllStaff();
      dispatch(setStaffs(res));
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const showDrawer = (staff) => {
    setSelectedStaff(staff); // Set the selected staff details
    setOpen(true); // Open the drawer
  };

  const closeDrawer = () => {
    setOpen(false); // Close the drawer
    setSelectedStaff(null); // Clear the selected staff details
  };

  useEffect(() => {
    getAllStaff();
  }, [dispatch]);

  return (
    <div>
      <section
        className="mx-auto max-w-7xl p-4 flex flex-row justify-between items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/banner.png')",
          height: "350px",
        }}
      ></section>
      <MenuComponent />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-500 text-center pb-10">
          មន្រីផ្នែកបណ្ណាល័យ
        </h1>
        {allStaff && allStaff.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {allStaff.map((staff, index) => (
              <Card
                key={index}
                hoverable
                style={{
                  width: "80%",
                }}
                cover={
                  <img
                    alt={staff.name || "Staff Image"}
                    src={
                      staff.coverImg
                        ? `${baseURL.defaults.baseURL}/uploads/images/${staff.coverImg}`
                        : "/src/assets/images/image.png"
                    }
                    style={{
                      width: "100%",
                      height: "250px",
                    }}
                  />
                }
                onClick={() => showDrawer(staff)} // Open drawer on card click
              >
                <Meta
                  title={staff.firstName && staff.lastName ? `${staff.firstName} ${staff.lastName}` : "Unknown Staff"}
                  description={
                    <div className="mt-2">
                      <p>តួនាទី ៖ {staff.position || "No position available"}</p>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No staff data available.</p>
        )}
      </div>

      {/* Drawer for staff details */}
      <Drawer
        title="Staff Details"
        placement="right"
        width={400}
        onClose={closeDrawer}
        open={open}
      >
        {selectedStaff ? (
          <div className="pl-10 flex flex-col  leading-8">
            <img
              alt={selectedStaff.name || "Staff Image"}
              src={
                selectedStaff.coverImg
                  ? `${baseURL.defaults.baseURL}/uploads/images/${selectedStaff.coverImg}`
                  : "/src/assets/images/image.png"
              }
              style={{
                width: "170px",
                height: "200px",
                marginBottom: "16px",
                borderRadius: "6px",
              }}
            />
            <p>
              <strong>Full Name:</strong> {selectedStaff.firstName}{" "}
              {selectedStaff.lastName}
            </p>
            <p>
              <strong>Position:</strong> {selectedStaff.position || "No position available"}
            </p>
            <p>
              <strong>Phone:</strong> {selectedStaff.phoneNumber || "No phone available"}
            </p>
            <p>
              <strong>Email:</strong> {selectedStaff.email || "No email available"}
            </p>
          </div>
        ) : (
          <p>Loading staff details...</p>
        )}
      </Drawer>
    </div>
  );
};

export default StaffComponent;