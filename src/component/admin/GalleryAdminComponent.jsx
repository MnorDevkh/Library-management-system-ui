import { useEffect, useState } from "react";
import { Modal, Tabs, Upload, Button, message, Spin } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import ImageService from "../../redux/service/ImageService";
import { baseURLString } from "../../redux/service/url";

const GalleryAdminComponent = () => {
  const [slides, setSlides] = useState([]); // Store Image images
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState([]); // Store media library images
  const [selectedImages, setSelectedImages] = useState([]); // Array of selected images
  const [selectedSlidesToDelete, setSelectedSlidesToDelete] = useState([]); // Slides selected for deletion
  const [loading, setLoading] = useState(false); // Loading state for fetching media
  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const [totalPages, setTotalPages] = useState(0); // Total pages for pagination

  // Fetch Image images
  const fetchImage = async () => {
    try {
      const response = await ImageService.getImageByType("Image"); // Fetch Image images
      setSlides(
        response.map((slide) => ({
          id: slide.id, // Use id for deletion
          filePath: `${baseURLString}/uploads/images/${slide.fileName}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching Image:", error);
      message.error("Failed to load Image images.");
    }
  };
  // Fetch media library images
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
      const response = await ImageService.upload(file); // Upload the image
      const uploadedImage = {
        fileName: response.filePath,
        type: "Image",
      };
      await ImageService.addImage([uploadedImage]); // Add image to Image
      setSlides((prevSlides) => [
        ...prevSlides,
        `${baseURLString}/uploads/images/${response.filePath}`,
      ]);
      message.success("Image uploaded successfully!");
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image.");
    }
  };

  const handleAddFromLibrary = () => {
    if (selectedImages.length > 0) {
      // Filter out images already in the Image
      const newImages = selectedImages.filter(
        (image) => !slides.some((slide) => slide.filePath === image)
      );
  
      if (newImages.length === 0) {
        message.warning("All selected images are already in the Image.");
        return;
      }
  
      const requestBody = newImages.map((image) => ({
        fileName: image.split("/").pop(),
        type: "Image",
      }));
  
      ImageService.addImage(requestBody)
        .then(() => {
          setSlides((prevSlides) => [
            ...prevSlides,
            ...newImages.map((image) => ({
              id: Math.random().toString(36).substr(2, 9), // Temporary ID
              filePath: `${baseURLString}/uploads/images/${image.split("/").pop()}`,
            })),
          ]);
          message.success("Image updated successfully!");
          setIsModalOpen(false);
          setSelectedImages([]); // Clear selected images
        })
        .catch((error) => {
          console.error("Error updating Image:", error);
          message.error("Failed to update Image.");
        });
    } else {
      message.warning("Please select at least one image from the media library.");
    }
  };

  const toggleImageSelection = (filePath) => {
    // Prevent selecting images already in the Image
    if (slides.some((slide) => slide.filePath === filePath)) {
      message.warning("This image is already in the Image.");
      return;
    }
  
    if (selectedImages.includes(filePath)) {
      setSelectedImages(selectedImages.filter((image) => image !== filePath));
    } else {
      setSelectedImages([...selectedImages, filePath]);
    }
  };

  const toggleSlideSelectionForDeletion = (id) => {
    if (selectedSlidesToDelete.includes(id)) {
      setSelectedSlidesToDelete(
        selectedSlidesToDelete.filter((slideId) => slideId !== id)
      );
    } else {
      setSelectedSlidesToDelete([...selectedSlidesToDelete, id]);
    }
  };

  const handleDeleteSlide = async (id) => {
    try {
      await ImageService.removeImage(id);
      setSlides(slides.filter((slide) => slide.id !== id));
      message.success("Slide deleted successfully!");
    } catch (error) {
      console.error("Error deleting slide:", error);
      message.error("Failed to delete slide.");
    }
  };
  const handleDeleteSelectedSlides = async () => {
    try {
      const idsToDelete = selectedSlidesToDelete;
      console.log(idsToDelete);

      await ImageService.removeImageList(idsToDelete);
      setSlides(slides.filter((slide) => !idsToDelete.includes(slide.id)));
      setSelectedSlidesToDelete([]);
      message.success("Selected slides deleted successfully!");
    } catch (error) {
      console.error("Error deleting selected slides:", error);
      message.error("Failed to delete selected slides.");
    }
  };

  // Handle "Show More" button click
  const handleShowMore = () => {
    if (currentPage < totalPages - 1) {
      fetchMedia(currentPage + 1); // Fetch the next page
      setCurrentPage((prevPage) => prevPage + 1); // Update the current page
    }
  };

  useEffect(() => {
    fetchImage(); // Fetch Image images on component mount
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Image</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="bg-gray-200 p-4 rounded-lg shadow-md flex flex-col justify-center items-center relative"
          >
            <img
              src={slide.filePath}
              alt={`Slide ${slide.id}`}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteSlide(slide.id)}
              ></Button>
              <div
                className={`bg-white ${
                  selectedSlidesToDelete.includes(slide.id)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                onClick={() => toggleSlideSelectionForDeletion(slide.id)}
                style={{
                  cursor: "pointer",
                  display: "flex", // Use flexbox
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically
                  width: "30px", // Optional: Set a fixed width
                  height: "30px", // Optional: Set a fixed height
                  borderRadius: "50%", // Optional: Make it circular
                }}
              >
                {selectedSlidesToDelete.includes(slide.id) ? (
                  <CheckCircleFilled className="text-blue-800" />
                ) : (
                  <CheckCircleOutlined className="text-blue-800" />
                )}
              </div>
            </div>
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
          Add New Slide
        </Button>
        {selectedSlidesToDelete.length > 0 && (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteSelectedSlides}
            style={{ marginLeft: "16px" }}
          >
            Delete Selected
          </Button>
        )}
      </div>
      {/* Modal for adding images */}
      <Modal
        title="Add Image to Image"
        width={1000}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          {/* Upload Files Tab */}
          <Tabs.TabPane tab="Upload Files" key="1">
            <Upload
              beforeUpload={(file) => {
                handleImageUpload(file); // Handle image upload
                return false; // Prevent automatic upload
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Tabs.TabPane>

          {/* Media Library Tab */}
          <Tabs.TabPane tab="Media Library" key="2">
            <Spin spinning={loading}>
              <div className="grid grid-cols-6 gap-4">
                {mediaLibrary.map((image, index) => (
                  <div
                    key={index}
                    className={`p-2 border rounded-lg relative ${
                      selectedImages.includes(image)
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => toggleImageSelection(image)} // Toggle image selection
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={image} // Use the correct filePath property
                      alt={`Media ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    {slides.some((slide) => slide.filePath === image) && (
                      <CheckCircleOutlined
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          fontSize: "20px",
                          color: "green",
                        }}
                      />
                    )}
                  </div>
                ))}
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

export default GalleryAdminComponent;
