import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Upload,
  Breadcrumb,
  Modal,
  Tabs,
  Spin,
  Image,
  message,
} from "antd";
import {
  PlusOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ImageService from "../../redux/service/ImageService";
import { useNavigate, useParams } from "react-router-dom";
import { baseURLString } from "../../redux/service/url";
import PublisherService from "../../redux/service/PublisherService";
import { setPublisherById } from "../../redux/slices/PublisherSlice";
import { useDispatch, useSelector } from "react-redux";

const UpdatePublisherComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpenForCover, setIsModalOpenForCover] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector((state) => state.publicsher.publisherById);


  useEffect(() => {
    const fetchPublisher = async () => {
      try {
        setLoading(true);
        PublisherService.getPublisherById(id)
          .then((response) => {
            return dispatch(setPublisherById(response.data));
          })
          .catch((e) => {
            // Assuming data is the publisher object
            message.error("Failed to fetch publisher data: " + e.message);
          });
      } catch (error) {
        setLoading(false);
        message.error("Failed to load publisher data.");
      }
    };
    fetchPublisher();
  }, [id, form, dispatch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        publisherName: data.publisherName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        email: data.email,
      });
      setImagePath(data.image || "");
      setLoading(false);
    }
  }, [data, form]);
  useEffect(() => {
    if (isModalOpenForCover) {
      setMediaLibrary([]);
      fetchMedia(0);
      setCurrentPage(0);
    }
  }, [isModalOpenForCover]);

  const handleReset = () => {
    form.resetFields();
    setImagePath("");
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const data = {
        publisherName: values.publisherName,
        address: values.address,
        phoneNumber: values.phoneNumber,
        email: values.email,
        image: imagePath,
      };
         console.log("Update response:", data);
      PublisherService.updatePublisher(id, data);
        message.success("Publisher updated successfully!");
        navigate("/admin/publisher");
    } catch (error) {
      console.error("Error updating publisher:", error);
      message.error("Error updating publisher!");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async (page) => {
    try {
      setLoading(true);
      const response = await ImageService.getListMedia(page, 10);
      if (response.data && response.data.images.length > 0) {
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
      setLoading(false);
      console.error("Error fetching media:", error);
      message.error("Failed to load media.");
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      const response = await ImageService.upload(file);
      setImagePath(response.filePath);
      message.success("Image uploaded successfully!");
      setIsModalOpenForCover(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (filePath) => {
    setSelectedImages([filePath]);
  };

  const handleAddFromLibrary = () => {
    if (selectedImages.length > 0) {
      setIsModalOpenForCover(false);
      const fileName = selectedImages[0].split("/").pop();
      setImagePath(fileName);
      message.success("Image selected successfully!");
    } else {
      message.warning("Please select an image from the media library.");
    }
  };

  const handleShowMore = () => {
    if (currentPage < totalPages - 1) {
      fetchMedia(currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const listPublishers = () => {
    navigate("/admin/publisher");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb items={[{ title: "Home" }, { title: "Publisher" }]} />
        <Button
          type="primary"
          icon={<UnorderedListOutlined />}
          onClick={listPublishers}
        >
          List Publisher
        </Button>
      </div>
      <h1 className="text-2xl font-semibold text-yellow-500">
        Update Publisher
      </h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="publisherName"
            label="Publisher Name"
            rules={[
              { required: true, message: "Please input the publisher name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Row justify="end">
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ marginRight: 8, marginTop: 16 }}
                >
                  Save
                </Button>
                <Button
                  type="default"
                  htmlType="button"
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
                      setImagePath("");
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
                  }}
                >
                  Add Image
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        title="Add Image"
        width={1000}
        open={isModalOpenForCover}
        onCancel={() => setIsModalOpenForCover(false)}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Upload Files" key="1">
            <Upload
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
              customRequest={({ file }) => handleImageUpload(file)}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Tabs.TabPane>
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
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && toggleImageSelection(image)
                      }
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
              Add Selected Image
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default UpdatePublisherComponent;
