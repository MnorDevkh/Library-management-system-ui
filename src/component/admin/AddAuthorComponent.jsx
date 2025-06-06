import { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Col,
  Row,
  Upload,
  Breadcrumb,
  Modal,
  Tabs,
  Spin,
  Image,
} from "antd";
import AuthorService from "../../redux/service/AuthorService";
import {
  PlusOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ImageService from "../../redux/service/ImageService";
import { useNavigate } from "react-router-dom";
import { baseURLString } from "../../redux/service/url";

const AddAuthorComponent = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpenForCover, setIsModalOpenForCover] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    setImageUrl("");
  };

  const onFinish = async (values) => {
    console.log(imagePath);

    try {
      const authorData = { ...values, image: imagePath };
      console.log("Author data:", authorData);
      await AuthorService.addAuthor(authorData);
      message.success("Author added successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error adding author:", error);
      message.error("Error adding author!");
    }
  };
  const fetchMedia = async (page) => {
    console.log("baseURLString", baseURLString);
    
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

  const listAuthor = () => {
    navigate("/admin/author");
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb items={[{ title: "Home" }, { title: "Authors" }]} />
        <Button
          type="primary"
          icon={<UnorderedListOutlined />}
          onClick={listAuthor}
        >
          List Author
        </Button>
      </div>
      <h1 className="text-2xl font-semibold text-blue-500">Add Author</h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please input the first name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input the last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nationality"
            label="Nationality"
            rules={[
              {
                required: true,
                message: "Please input the nationality!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bio"
            label="Bio"
            rules={[{ required: true, message: "Please input the bio!" }]}
          >
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
          </Form.Item>
          <Form.Item>
            <Row justify="end">
              <Col>
                <Button
                  htmlType="submit"
                  className="text-blue-600"
                  style={{ marginRight: 8, marginTop: 16 }}
                >
                  Save
                </Button>
                <Button
                  htmlType="button"
                  className="text-red-400"
                  onClick={handleReset}
                  style={{ marginTop: 16 }}
                >
                  Reset
                </Button>
              </Col>
            </Row>
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
  );
};

export default AddAuthorComponent;
