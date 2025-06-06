import { useEffect, useState } from "react";
import { Image, Button, message, Modal, Upload } from "antd"; // Import Ant Design components
import {
  FilePdfOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons"; // Import Ant Design icons
import ImageService from "../../redux/service/ImageService";
import { m } from "framer-motion";

const { confirm } = Modal;

const MediaComponent = () => {
  const [media, setMedia] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMedia(currentPage);
  }, [currentPage,media]);

  const fetchMedia = async (page) => {
    try {
      setLoading(true);
      const response = await ImageService.getListMedia(page, 10);

      if (
        response.data &&
        Array.isArray(response.data.images) &&
        response.data.images.length > 0
      ) {
        // Replace the media list with the new data
        setMedia(response.data.images);
        setTotalPages(response.data.totalPages || 0); // Ensure totalPages is set even if undefined
      } else {
        // If no data, clear the media list and show a message
        setMedia([]);
        message.info("No media found.");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      message.error("Failed to load media.");
    } finally {
      setLoading(false); // Ensure loading is stopped in both success and error cases
    }
  };
  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      const response = await ImageService.upload(file); // Upload the image
      message.success("Image uploaded successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image.");
    }
  };
  const handleLoadMore = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleDelete = (item) => {
    const fileName = item.split("/").pop();
    confirm({
      title: "Are you sure you want to delete this media?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await ImageService.deleteMedia(fileName);
          setMedia((prevMedia) =>
            prevMedia.filter((mediaItem) => mediaItem !== item)
          ); // Remove the deleted item from the list
          message.success("Media deleted successfully!");
        } catch (error) {
          console.error("Error deleting media:", error);
          message.error("Failed to delete media.");
        }
      },
    });
  };

  const isPdf = (url) => {
    return url.toLowerCase().endsWith(".pdf"); // Check if the file is a PDF
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {media.map((item, index) => (
          <div
            key={index}
            className="border p-2 rounded flex flex-col items-center relative"
          >
            {isPdf(item) ? (
              <div className="flex flex-col items-center">
                <FilePdfOutlined
                  style={{ fontSize: "48px", color: "#FF4D4F" }}
                />
                <a
                  href={item}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 mt-2"
                >
                  View PDF
                </a>
              </div>
            ) : (
              <Image
                src={item}
                alt={`Media ${index}`}
                className="w-full h-auto object-cover rounded"
                preview={{
                  mask: <span>Preview</span>,
                }}
              />
            )}
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(item)}
              className="absolute top-2 right-2"
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsModalOpen(true);
            fetchMedia(0); // Fetch the first page of media when modal opens
            setCurrentPage(0); // Reset current page
          }}
        >
          Add Media
        </Button>
      </div>
      <div className="flex justify-center mt-4">
        {currentPage < totalPages - 1 && (
          <Button
            onClick={handleLoadMore}
            loading={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load More
          </Button>
        )}
      </div>

      <Modal
        title="ជ្រើសរើសឯកសារមេឌៀ"
        width={1000}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          fetchMedia(0); // Re-fetch media when modal closes
          setCurrentPage(0); // Reset current page if needed
        }}
        footer={null}
      >
        <Upload
          beforeUpload={(file) => {
            handleImageUpload(file);
            return false;
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default MediaComponent;
