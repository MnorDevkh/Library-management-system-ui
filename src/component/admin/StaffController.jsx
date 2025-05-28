import { Button, Card, message, Modal } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import StaffService from "../../redux/service/StaffService";
import { setStaffs } from "../../redux/slices/StaffSlice";
import baseURL from "../../redux/service/url";
import { ExclamationCircleOutlined, UserAddOutlined } from "@ant-design/icons";


const { Meta } = Card;

const StaffController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const allStaff = useSelector((state) => state.staff.staffs);
  const { confirm } = Modal;

  const getAllStaff = async () => {
    try {
      const res = await StaffService.getAllStaff();
      dispatch(setStaffs(res));
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleDelete = (id) => {
    StaffService.deleteStaff(id)
      .then(() => {
        message.success("Staff deleted successfully!");
        getAllStaff(); // Refresh the staff list after deletion
      })
      .catch((error) => {
        console.error("Error deleting staff:", error);
        message.error("Failed to delete staff.");
      });
  };

  const showDeleteConfirm = (staffId) => {
    confirm({
      title: 'Are you sure you want to delete this author?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(staffId); // Call handleDelete to actually delete the author
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleUpdate = (id) => {
    navigate(`/admin/edit-staff/${id}`);
  };
  const addNew = () => {
    navigate('/admin/add-staff'); // Navigate to the add staff page
  }

  useEffect(() => {
    getAllStaff();
  }, [dispatch]);

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        <Button  onClick={addNew}  className=" flex ml-auto px-3 border border-primary-color hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 text-[12px] lg:text-sm hover:text-blue-600 justify-end">
        <UserAddOutlined /> បន្ថែមមន្ត្រី
        </Button>
        <h1 className="text-2xl font-bold mb-4 text-blue-500 text-center pb-10">
          មន្រីផ្នែកបណ្ណាល័យ
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(allStaff) && allStaff.length > 0 ? (
            allStaff.map((staff, index) => (
              <Card
                key={index}
                hoverable
                style={{ width: 240 }}
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
              >
                <Meta
                  title={
                    staff.firstName + " " + staff.lastName || "Unknown Staff"
                  }
                  description={
                    <div className="">
                      <div className="mt-2">
                      <p>
                        តួនាទី ៖ {staff.position || "No position available"}
                      </p>
                      <p>
                        ទូរស័ព្ទ ៖ {staff.phoneNumber || "No phone available"}
                      </p>
                      <p>អ៊ីមែល ៖ {staff.email || "No email available"}</p>
                    </div>
                      <div className="justify-end flex gap-4 mt-2">
                        <Button
                          className="text-red-500 hover:text-red-700 font-medium"
                          onClick={() => showDeleteConfirm(staff.id)}
                        >
                          លុប
                        </Button>
                        <Button
                          className="text-blue-500 hover:text-blue-700 font-medium"
                          onClick={() => handleUpdate(staff.id)}
                        >
                          កែប្រែ
                        </Button>
                      </div>
                    </div>
                  }
                />
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No staff data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffController;
