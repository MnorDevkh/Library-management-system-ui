import { useEffect, useState } from "react";
import { Spin, message, Modal, Button } from "antd";
import MenuComponent from "../MenuComponent";
import ImageService from "../../redux/service/ImageService";
import { baseURLString } from "../../redux/service/url";

const ImageGalleryComponent = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  // Fetch images for display
  const fetchImage = async () => {
    setLoading(true);
    try {
      const response = await ImageService.getImageByType("Image");
      setImages(
        response.map((slide) => ({
          id: slide.id,
          fileName: slide.fileName,
          filePath: `${baseURLString}/uploads/images/${slide.fileName}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching Image:", error);
      message.error("Failed to load images.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImage();
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const handleImageClick = (img) => {
    setModalImg(img);
    setModalOpen(true);
  };

  return (
    <main className="mx-auto max-w-7xl">
      <section
        className="mx-auto max-w-7xl p-4 flex flex-row justify-between items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/banner.png')",
          height: "350px",
        }}
      ></section>
      <MenuComponent />
      <h4 className="text-2xl font-bold mb-4">កម្រងរូបភាព</h4>
      {loading ? (
        <Spin />
      ) : (
        <div>
          <div
            className="masonry-gallery"
            style={{
              columnCount: 4,
              columnGap: "16px",
              maxWidth: 1400,
              margin: "0 auto",
            }}
          >
            {images.map((img, idx) => (
              <div key={img.id || idx} style={{ breakInside: "avoid", marginBottom: 16 }}>
                <img
                  src={img.filePath}
                  alt={`Gallery ${idx}`}
                  style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "12px",
                    marginBottom: 0,
                    transition: "transform 0.2s",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(img)}
                  onError={(e) => {
                    if (!e.target.dataset.fallback) {
                      e.target.src = "/no-image.png";
                      e.target.dataset.fallback = "true";
                    }
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}

      >
        {modalImg && (
          <img
            src={modalImg.filePath}
            alt={modalImg.fileName}
          />
        )}
      </Modal>
    </main>
  );
};

export default ImageGalleryComponent;