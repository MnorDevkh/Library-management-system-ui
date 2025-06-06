import { useState, useEffect } from "react";
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
import {
  PlusOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import AuthorService from "../../redux/service/AuthorService";
import ImageService from "../../redux/service/ImageService";
import { baseURLString } from "../../redux/service/url";

const UpdateAuthorComponent = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpenForCover, setIsModalOpenForCover] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [imagePath, setImagePath] = useState("");
  const navigate = useNavigate();
  const { authorId } = useParams();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const author = await AuthorService.getAuthorById(authorId);
        form.setFieldsValue(author.body);
        setImagePath(author.body.image);
      } catch (error) {
        console.error("Error fetching author:", error);
        message.error("Error fetching author!");
      }
    };

    fetchAuthor();
  }, [authorId, form]);


  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    setImageUrl("");
  };

  const onFinish = async (values) => {
    try {
      const authorData = { ...values, image: imagePath };
      await AuthorService.updateAuthor(authorId, authorData);
      message.success("Author updated successfully!");
      navigate("/admin/author");
    } catch (error) {
      console.error("Error updating author:", error);
      message.error("Error updating author!");
    }
  };

  const listAuthor = () => {
    navigate("/admin/author");
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

  const handleImageUpload = async (file) => {
    try {
      const response = await ImageService.upload(file);
      setImagePath(response.filePath);
      message.success("Image uploaded successfully!");
      setIsModalOpenForCover(false);
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
      <h1 className="text-xl p-2 font-semibold text-blue-500">Update Author</h1>
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
                rules={[
                  { required: true, message: "Please input the last name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="nationality"
                label="Nationality"
                rules={[
                  { required: true, message: "Please input the nationality!" },
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
                      type="primary"
                      htmlType="submit"
                      style={{ marginRight: 8, marginTop: 16 }}
                    >
                      Save Author
                    </Button>
                    <Button
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

export default UpdateAuthorComponent;
