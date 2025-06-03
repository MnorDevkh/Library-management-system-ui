import { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Upload,
  Modal,
  Tabs,
  Spin,
  Image,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ShelfService from "../../redux/service/Shelf";
import { useDispatch, useSelector } from "react-redux";
import { setShelf } from "../../redux/slices/ShelfSlice";
import { baseURLString } from "../../redux/service/url";
import ImageService from "../../redux/service/ImageService";
import LoadingComponent from "../common/LoadingComponent";

const AddShelfComponent = () => {
  const [isModalOpenForCover, setIsModalOpenForCover] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const shelves = useSelector((state) => state.shelf.shelves);

  const handleReset = () => {
    form.resetFields();
    setImageUrl("");
  };

  const info = (text) => {
    messageApi.open({
      type: "info",
      content: text,
    });
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
      const fileName = selectedImages.split("/").pop();
      setImagePath(fileName);
      message.success("Image selected successfully!");
    } else {
      message.warning("Please select an image from the media library.");
    }
  };

  const handleImageUpload = (info) => {
      // Assume your backend returns the image URL in response
      console.log(info);
      
      setImageUrl(info.file.response?.url || "");
      message.success(`${info.file.name} file uploaded successfully`);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        bookshelfName: values.bookshelfName,
        location: values.location,
        image: imageUrl,
      };
      const newShelf = await ShelfService.addShelf(payload);
      info("Shelf added successfully!");
      dispatch(setShelf([...shelves, newShelf]));
      handleReset();
    } catch (error) {
      console.error("Error adding shelf:", error);
      messageApi.error("Error adding shelf!");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async (page) => {
    try {
      setLoading(true);
      if (page === 0) {
        setMediaLibrary([]);
      }
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
      console.error("Error fetching media:", error);
      message.error("Failed to load media.");
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      {loading && <LoadingComponent />}
      <div className="grid grid-cols-2 gap-4 p-4">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="bookshelfName"
            label="Shelf Name"
            rules={[
              { required: true, message: "Please input the shelf name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[
              { required: true, message: "Please input the shelf location!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Row justify="end">
              <Col>
                <Button
                  htmlType="submit"
                  className="text-blue-600"
                  loading={loading}
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
                    fetchMedia(0);
                    setCurrentPage(0);
                  }}
                >
                  Add Cover Image
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
                Add Selected Image
              </Button>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    </>
  );
};

export default AddShelfComponent;
