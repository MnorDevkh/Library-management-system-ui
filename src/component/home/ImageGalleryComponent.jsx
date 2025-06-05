import { useEffect, useState } from "react";
import { Spin, message, Modal } from "antd";
import MenuComponent from "../MenuComponent";


const baseURL = import.meta.env.VITE_REACT_APP_API_URL +"/uploads/images/";

const ImageGalleryComponent = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/image/Image")
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch(() => {
        message.error("Failed to load images.");
        setLoading(false);
      });
  }, []);

  // Prevent background scroll when modal is open
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
      <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
      {loading ? (
        <Spin />
      ) : (
        <div
          className="masonry-gallery"
          style={{
            columnCount: 4,
            columnGap: "16px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {images.map((img) => (
            <div key={img.id}>
              <img
                src={baseURL + img.fileName}
                alt={img.fileName}
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
                    e.target.src = "/no-image.png"; // Use a local fallback image in your public folder
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
      )}

      <Modal
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        centered
        width={800}
        bodyStyle={{ textAlign: "center", background: "#222" }}
      >
        {modalImg && (
          <img
            src={baseURL + modalImg.fileName}
            alt={modalImg.fileName}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              borderRadius: "12px",
              background: "#222",
            }}
          />
        )}
      </Modal>
    </main>
  );
};

export default ImageGalleryComponent;
