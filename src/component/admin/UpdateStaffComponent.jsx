import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, message, Image, Modal, Tabs, Spin } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import StaffService from "../../redux/service/StaffService";
import ImageService from "../../redux/service/ImageService";
import { baseURLString } from "../../redux/service/url";

const UpdateStaffComponent = () => {
  const { staffId } = useParams(); // Get the staff ID from the URL
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpenForCover, setIsModalOpenForCover] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch staff details by ID
  const fetchStaffDetails = async () => {
    try {
      setLoading(true);
      const staff = await StaffService.getStaffById(staffId); // Add a method in StaffService to fetch staff by ID
      form.setFieldsValue({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phoneNumber: staff.phoneNumber,
        position: staff.position,
      });
      setImagePath(staff.coverImg); // Set the image path for the cover image
      setLoading(false);
    } catch (error) {
      console.error("Error fetching staff details:", error);
      message.error("Failed to fetch staff details.");
      setLoading(false);
    }
  };

  // Handle form submission
  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const updatedStaff = {
        ...values,
        coverImg: imagePath || "", // Handle uploaded image
      };
      await StaffService.updateStaff(staffId, updatedStaff); // Update staff by ID
      message.success("Staff updated successfully!");
      navigate("/admin/staff"); // Navigate back to the staff list
    } catch (error) {
      console.error("Error updating staff:", error);
      message.error("Failed to update staff.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDetails();
  }, [staffId]);

  const fetchMedia = async (page) => {
    try {
      setLoading(true);
      if (page === 0) {
        setMediaLibrary([]);
      }
      const response = await ImageService.getListMedia(page, 10);

      if (response.data && response.data.images.length > 0) {
        // Filter out PDF files
        const nonPdfFiles = response.data.images.filter(
          (file) => !file.toLowerCase().endsWith(".pdf")
        );

        if (nonPdfFiles.length > 0) {
          setMediaLibrary((prevMedia) => [...prevMedia, ...nonPdfFiles]);
          setTotalPages(response.data.totalPages);
        } else {
          message.info("No non-PDF media available.");
        }
      } else {
        message.info("No media available.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching media:", error);
      message.error("Failed to load media.");
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      const response = await ImageService.upload(file);
      setImagePath(response.filePath);
      console.log(response);
      message.success("Image uploaded successfully!");
      setIsModalOpenForCover(false); // Close m
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image.");
    }
  };

  const toggleImageSelection = (filePath) => {
    setSelectedImages(filePath);
  };
  const handleShowMore = () => {
    if (currentPage < totalPages - 1) {
      fetchMedia(currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const handleAddFromLibrary = () => {
    if (selectedImages.length > 0) {
      setIsModalOpenForCover(false);
      message.success("Slideshow updated successfully!");
      const fileName = selectedImages.split("/").pop();
      console.log("Selected file name:", fileName);
      setImagePath(fileName);
    } else {
      message.warning(
        "Please select at least one image from the media library."
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-blue-500">Update Staff</h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            position: "",
          }}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter the phone number" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: "Please enter the position" }]}
          >
            <Input placeholder="Enter position" />
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Staff
            </Button>
            <Button
              type="default"
              className="ml-4"
              onClick={() => navigate("/admin/staff")}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
        <div className="mt-4">
          <div
            className="rounded-lg border-2 border-dashed border-gray-300 p-4 flex justify-center items-center"
            style={{ cursor: "pointer" }}
          >
            {imagePath ? (
              <div>
                <Image
                  width={200}
                  src={baseURLString + "/uploads/images/" + imagePath}
                />
                <div className="flex justify-center items-center mt-2">
                  <Button
                    type="primary"
                    danger
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setImagePath(""); // Clear the image path
                      message.info("Image removed.");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsModalOpenForCover(true);
                    fetchMedia(0);
                    setCurrentPage(0);
                  }}
                >
                  Add Cover Book
                </Button>
              </div>
            )}
          </div>
        </div>
        <Modal
          title="Add Image to Cover"
          width={1000}
          visible={isModalOpenForCover}
          onCancel={() => setIsModalOpenForCover(false)}
          footer={null}
        >
          <Tabs defaultActiveKey="1">
            {/* Upload Files Tab */}
            <Tabs.TabPane tab="Upload Files" key="1">
              <Upload
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("You can only upload image files!");
                  }
                  return isImage || Upload.LIST_IGNORE;
                }}
                customRequest={({ file }) => handleImageUpload(file)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Tabs.TabPane>

            {/* Media Library Tab for Cover */}
            <Tabs.TabPane tab="Media Library" key="2">
              <Spin spinning={loading}>
                <div className="grid grid-cols-6 gap-4">
                  {mediaLibrary.length > 0 ? (
                    mediaLibrary.map((image, index) => (
                      <div
                        key={index}
                        className={`p-2 border rounded-lg relative ${
                          selectedImages.includes(image)
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => toggleImageSelection(image)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={image}
                          alt={`Media ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div>No media available</div>
                  )}
                </div>
                {currentPage < totalPages - 1 && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={handleShowMore} loading={loading}>
                      Show More
                    </Button>
                  </div>
                )}
              </Spin>
              <Button
                type="primary"
                className="mt-4"
                onClick={handleAddFromLibrary}
              >
                Add Selected Images
              </Button>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    </div>
  );
};

export default UpdateStaffComponent;
