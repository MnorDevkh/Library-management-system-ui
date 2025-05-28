import React from 'react';

import { useEffect, useState } from "react";
import { Modal, Tabs, Upload, Button, message, Spin } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ImageService from "../../redux/service/ImageService";
import { baseURLString } from "../../redux/service/url";

const ImageListAdminComponent = () => {
  const [slides, setSlides] = useState([]); // Store slideshow images
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [mediaLibrary, setMediaLibrary] = useState([]); // Store media library images
  const [selectedImages, setSelectedImages] = useState([]); // Array of selected images
  const [loading, setLoading] = useState(false); // Loading state for fetching media
  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const [totalPages, setTotalPages] = useState(0); // Total pages for pagination

  // Fetch slideshow images
  const fetchSlideshow = async () => {
    try {
      const response = await ImageService.getImageByType("Slideshow"); // Fetch slideshow images
      console.log(response);
      
      setSlides(response.map((slide) => `${baseURLString}/uploads/images/${slide.fileName}`));
    } catch (error) {
      console.error("Error fetching slideshow:", error);
      message.error("Failed to load slideshow images.");
    }
  };

  // Fetch media library images
  const fetchMedia = async (page) => {
    try {
      setLoading(true);
      const response = await ImageService.getListMedia(page, 10); // Fetch 10 media items per page
      setMediaLibrary((prevMedia) => [...prevMedia, ...response.data.images]); // Append new media to the media library
      setTotalPages(response.data.totalPages); // Update total pages
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
      const response = await ImageService.upload(file); // Upload the image
      console.log(response);
      
      const uploadedImage = {
        fileName: response.filePath,
        type: "Slideshow",
      };
// Add uploaded image to slides
      handleAddFromLibrary(); // Add image to slideshow
      message.success("Image uploaded successfully!");
      setIsModalOpen(false); // Close modal
      await ImageService.addSlideshow([uploadedImage]); // Refresh slideshow images
      setSlides((prevSlides) => [
        ...prevSlides,
        `${baseURLString}/uploads/images/${response.fileName}`,
      ]);
  
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image.");
    }
  };

  // Handle adding images from the media library
  const handleAddFromLibrary = () => {
    if (selectedImages.length > 0) {
      const requestBody = selectedImages.map((image) => ({
        fileName: image.split("/").pop(),
        type: "Slideshow",
      }));
      setIsModalOpen(false);
      ImageService.addSlideshow(requestBody)
        .then(() => {
          message.success("Slideshow updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating slideshow:", error);
          message.error("Failed to update slideshow.");
        });
    } else {
      message.warning(
        "Please select at least one image from the media library."
      );
    }
  };

  // Handle selecting/deselecting an image
  const toggleImageSelection = (filePath) => {
    if (selectedImages.includes(filePath)) {
      // If the image is already selected, remove it
      setSelectedImages(selectedImages.filter((image) => image !== filePath));
    } else {
      // Otherwise, add it to the selected images
      setSelectedImages([...selectedImages, filePath]);
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
    fetchSlideshow(); // Fetch slideshow images on component mount
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Slide Show Admin Component</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-gray-200 p-4 rounded-lg shadow-md flex justify-center items-center"
          >
            <img
              src={`${slide}`}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
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
          Add New Slide
        </Button>
      </div>

      {/* Modal for adding images */}
      <Modal
        title="Add Image to Slideshow"
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
                    {slides.includes(image) && (
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


export default ImageListAdminComponent;