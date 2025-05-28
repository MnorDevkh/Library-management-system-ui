import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Upload,
  Breadcrumb,
  Tabs,
  Spin,
  Modal,
  Image,
} from "antd";

import {
  CheckCircleOutlined,
  FilePdfOutlined,
  LoginOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ImageService from "../../redux/service/ImageService";
import BookService from "../../redux/service/BookService";
import LoadingComponent from "../common/LoadingComponent";
import { setShelf, ShelfSlice } from "../../redux/slices/ShelfSlice";
import GenreService from "../../redux/service/GenreService";
import { setGenres } from "../../redux/slices/GenreSlice";
import AuthorService from "../../redux/service/AuthorService";
import PublisherService from "../../redux/service/PublisherService";
import { setAuthors } from "../../redux/slices/AuthorSlice";
import ShelfService from "../../redux/service/Shelf";
import { setPublishers } from "../../redux/slices/PublisherSlice";
import { baseURLString } from "../../redux/service/url";
import { i } from "framer-motion/client";
const isPdf = (filePath) => filePath.toLowerCase().endsWith(".pdf");
const { TextArea } = Input;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const UpdateBookComponent = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [slides, setSlides] = useState([]);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpenForPDF, setIsModalOpenForPDF] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const bookshelves = useSelector((state) => state.shelf.shelves);
  const genres = useSelector((state) => state.genre.genres);
  const authors = useSelector((state) => state.author.authors);
  const publishers = useSelector((state) => state.publicsher.publishers);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPdf, setSelectedPdf] = useState([]);
  const [pdfFileList, setPdfFileList] = useState([]);
  const [isModalOpenForCover, setIsModalOpenForCover] = useState(false);
  const [pdfPath, setPdfPath] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const book = await BookService.getBookById(bookId);
        const bookData = book.data;
        console.log("Book data:", bookData);

        form.setFieldsValue({
          title: bookData?.title ?? "",
          isbn: bookData?.isbn ?? "",
          description: bookData?.description ?? "",
          publicationYear: bookData?.publicationYear ?? "",
          language: bookData?.language ?? "",
          totalCopies: bookData?.totalCopies ?? 0,
          availableCopies: bookData?.availableCopies ?? 0,
          authors: bookData?.authorDtos?.map((author) => author.id) ?? [],
          genreId: bookData?.genreDTO?.genreId ?? null,
          publisherId: bookData?.publisherDto?.publisherId ?? null,
          bookshelfId: bookData?.bookshelf?.bookshelfId ?? null,
        });
        setImagePath(bookData.cover);
        setPdfPath(bookData.pdfBook);

        if (bookData.cover) {
          try {
            const response = await ImageService.getUrl(bookData.cover);
            console.log("Image fetched:", response.data.url);
            setImagePath(response.data.url);
            setFileList([
              {
                uid: "-1",
                name: "cover",
                status: "done",
                url: response.data.url,
              },
            ]);
          } catch (error) {
            console.error("Error fetching image:", error);
            message.error("Error fetching image!");
          }
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        message.error("Error fetching book!");
      }
    };

    fetchBook();
  }, [bookId, form]);

  const info = useCallback(
    (text) => {
      messageApi.open({
        type: "error",
        content: text,
      });
    },
    [messageApi]
  );

  useEffect(() => {
    const getBookshelves = async () => {
      try {
        const res = await ShelfService.getAllShelf(1, 100, "bookshelfId");
        dispatch(setShelf(res.data));
      } catch (error) {
        console.error("Error fetching bookshelves:", error);
        info("Failed to fetch bookshelves.");
      }
    };

    const fetchGenre = async () => {
      try {
        const res = await GenreService.getAllGenres(1, 100, "genreId");
        console.log(res.data);
        dispatch(setGenres(res.data));
      } catch (error) {
        console.error("Error fetching genres:", error);
        info("Failed to fetch genres.");
      }
    };

    const fetchAuthors = async () => {
      try {
        const res = await AuthorService.getAllAuthors(1, 100, "authorId");

        dispatch(setAuthors(res.data));
      } catch (error) {
        console.error("Error fetching authors:", error);
        info("Failed to fetch authors.");
      }
    };

    const fetchPublishers = async () => {
      try {
        const res = await PublisherService.getAllPublicher(
          1,
          100,
          "publisherId"
        );
        dispatch(setPublishers(res.data));
      } catch (error) {
        console.error("Error fetching publishers:", error);
        info("Failed to fetch publishers.");
      }
    };


    getBookshelves();
    fetchGenre();
    fetchAuthors();
    fetchPublishers();
  }, [dispatch, info]);

  const onFinish = async (values) => {
    try {
      const coverFile = imagePath.split("/").pop(); // Extract the file name from the URL
      setLoading(true);
      const bookData = {
        ...values,
        cover: coverFile,
        pdfBook: pdfPath,
      };
      console.log("Book data to update:", bookData);
      
      
      await BookService.updateBook(bookId, bookData);
      setLoading(false);
      message.success("Book updated successfully!");
      navigate("/admin/list-book");
    } catch (error) {
      setLoading(false);
      console.error("Error updating book:", error);
      message.error("Failed to update book.");
    }
  };

  const listBook = () => {
    navigate("/admin/list-book");
  };
  const fetchMedia = async (page) => {
    try {
      setLoading(true);
      if (page === 0) {
        setMediaLibrary([]); // Clear the media library for the first page
      }
      const response = await ImageService.getListMedia(page, 10);

      if (response.data && response.data.images.length > 0) {
        // Filter out PDF files
        const nonPdfFiles = response.data.images.filter(
          (file) => !file.toLowerCase().endsWith(".pdf")
        );

        if (nonPdfFiles.length > 0) {
          setMediaLibrary((prevMedia) => [...prevMedia, ...nonPdfFiles]); // Update the media library with non-PDF files
          setTotalPages(response.data.totalPages); // Update total pages
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
  const fetchPdf = async (page) => {
    try {
      setLoading(true);
      if (page === 0) {
        setPdfFileList([]);
      }
      const response = await ImageService.getListMedia(page, 10);

      if (response.data && response.data.images.length > 0) {
        // Filter the response to include only PDF files
        const pdfFiles = response.data.images.filter((file) =>
          file.toLowerCase().endsWith(".pdf")
        );

        if (pdfFiles.length > 0) {
          setPdfFileList((prevMedia) => [...prevMedia, ...pdfFiles]);
          setTotalPages(response.data.totalPages);
        } else {
          message.info("No PDF files available.");
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
      console.log(response);
      
      setImagePath(response.filePath);
      console.log(response);
      message.success("Image uploaded successfully!");
      setIsModalOpenForCover(false); // Close m
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image.");
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
  const handleAddFromLibraryPdf = () => {
    if (selectedPdf.length > 0) {
      setIsModalOpenForPDF(false);
      message.success("Slideshow updated successfully!");
      const fileName = selectedPdf.split("/").pop();
      console.log("Selected file name:", fileName);
      setPdfPath(fileName);
    } else {
      message.warning(
        "Please select at least one image from the media library."
      );
    }
  };
  const toggleImageSelection = (filePath) => {
    setSelectedImages(filePath);
  };
  const toggleImageSelectionPdf = (filePath) => {
    console.log(filePath);
    setSelectedPdf(filePath);
  };
  const handleShowMore = () => {
    if (currentPage < totalPages - 1) {
      fetchMedia(currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const handleShowMorePdf = () => {
    if (currentPage < totalPages - 1) {
      fetchPdf(currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePdfUpload = async (pdffilePath) => {
    try {
      // Validate if the file is a PDF
      if (!pdffilePath.name.toLowerCase().endsWith(".pdf")) {
        message.error("Only PDF files are allowed!");
        return;
      }
      const response = await ImageService.upload(pdffilePath);
      if (response.filePath.toLowerCase().endsWith(".pdf")) {
        setPdfPath(response.filePath);
        console.log("PDF uploaded:", response);
        message.success("PDF uploaded successfully!");
        setIsModalOpenForPDF(false);
      } else {
        message.error("Uploaded file is not a valid PDF.");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      message.error("Failed to upload PDF.");
    }
  };

  return (
    <>
      {contextHolder}
      {loading && <LoadingComponent />}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Breadcrumb items={[{ title: "Home" }, { title: "Books" }]} />
          <Button
            type="primary"
            icon={<UnorderedListOutlined />}
            onClick={listBook}
          >
            List Book
          </Button>
        </div>
        <h1 className="text-2xl font-semibold text-blue-500">Update Book</h1>
        <div className="grid grid-cols-2 gap-4 p-4">
        <Form
          form={form}
          layout="vertical"
          style={{
            maxWidth: 1200,
          }}
          initialValues={{
            layout: "vertical",
          }}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please input title" }]}
              >
                <Input placeholder="Please input title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ISBN"
                name="isbn"
                rules={[{ required: true, message: "Please input ISBN" }]}
              >
                <Input placeholder="Please input ISBN" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input description" },
                ]}
              >
                <TextArea rows={4} placeholder="Please input description" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Publication Year"
                name="publicationYear"
                rules={[
                  { required: true, message: "Please input publication year" },
                ]}
              >
                <InputNumber
                  placeholder="Please input publication year"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Language"
                name="language"
                rules={[{ required: true, message: "Please input language" }]}
              >
                <Input placeholder="Please input language" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Total Copies"
                name="totalCopies"
                rules={[
                  { required: true, message: "Please input total copies" },
                ]}
              >
                <InputNumber
                  placeholder="Please input total copies"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Available Copies"
                name="availableCopies"
                rules={[
                  { required: true, message: "Please input available copies" },
                ]}
              >
                <InputNumber
                  placeholder="Please input available copies"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Authors"
                name="authors"
                rules={[{ required: true, message: "Please input authors" }]}
              >
                <Select mode="multiple" placeholder="Please select authors">
                  {authors.map((author) => (
                    <Select.Option
                      key={author.authorId}
                      value={author.authorId}
                    >
                      {author.firstName} {author.lastName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Genre"
                name="genreId"
                rules={[{ required: true, message: "Please select genre" }]}
              >
                <Select placeholder="Please select genre">
                  {genres.map((genre) => (
                    <Select.Option key={genre.genreId} value={genre.genreId}>
                      {genre.genreName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Publisher"
                name="publisherId"
                rules={[{ required: true, message: "Please select publisher" }]}
              >
                <Select placeholder="Please select publisher">
                  {publishers.map((publisher) => (
                    <Select.Option
                      key={publisher.publisherId}
                      value={publisher.publisherId}
                    >
                      {publisher.publisherName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Bookshelf"
                name="bookshelfId"
                rules={[{ required: true, message: "Please select bookshelf" }]}
              >
                <Select placeholder="Please select bookshelf">
                  {bookshelves.map((shelf) => (
                    <Select.Option
                      key={shelf.bookshelfId}
                      value={shelf.bookshelfId}
                    >
                      {shelf.bookshelfName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="mt-4">
            <div
              className="rounded-lg border-2 border-dashed border-gray-300 p-4 flex justify-center items-center"
              style={{ cursor: "pointer" }}
            >
              {pdfPath ? (
                <div>
                  <FilePdfOutlined
                    style={{ fontSize: "48px", color: "#FF4D4F" }}
                  />
                  <div className="flex justify-center items-center mt-2">
                    <Button
                      type="primary"
                      danger
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setPdfPath("");
                        message.info("PDF removed.");
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
                      setIsModalOpenForPDF(true);
                      fetchPdf(0);
                      setCurrentPage(0);
                    }}
                  >
                    Add PDF Book
                  </Button>

                  <div className="mt-4">
                    <div className="grid grid-cols-6 gap-4">
                      {pdfFileList.length > 0 ? (
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
                      ) : (
                        pdfFileList.map((pdf, index) => {
                          const fileName = pdf.split("/").pop(); // Extract file name
                          return (
                            <div
                              key={index}
                              className="p-2 border rounded-lg text-center hover:border-blue-500 transition"
                              onClick={() => setPdfPath(pdf)} // Select PDF
                              style={{ cursor: "pointer" }}
                            >
                              <FilePdfOutlined
                                style={{ fontSize: "48px", color: "#FF4D4F" }}
                              />
                              <a
                                href={pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 block mt-2 text-sm truncate"
                                title={fileName}
                              >
                                {fileName}
                              </a>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
        {/* Modal for adding images */}
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

      <Modal
        title="Add File to Book"
        width={1000}
        visible={isModalOpenForPDF}
        onCancel={() => setIsModalOpenForPDF(false)}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          {/* Upload Files Tab */}
          <Tabs.TabPane tab="Upload Files" key="1">
            <Upload
              beforeUpload={(file) => {
                const isPdf = file.type === "application/pdf";
                if (!isPdf) {
                  message.error("You can only upload PDF files!");
                }
                return isPdf || Upload.LIST_IGNORE;
              }}
              customRequest={({ file }) => handlePdfUpload(file)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload PDF</Button>
            </Upload>
          </Tabs.TabPane>
          {/* Media Library Tab for PDF */}
          <Tabs.TabPane tab="Media Library" key="2">
            <Spin spinning={loading}>
              <div className="grid grid-cols-6 gap-4">
                {pdfFileList.length > 0 ? (
                  pdfFileList.map((pdf, index) => {
                    // Extract the file name from the URL
                    const fileName = pdf.split("/").pop();

                    return isPdf(pdf) ? (
                      <div key={index} className="flex flex-col items-center">
                        <FilePdfOutlined
                          style={{ fontSize: "48px", color: "#FF4D4F" }}
                          onClick={() => toggleImageSelectionPdf(fileName)}
                        />
                        <a
                          href={pdf} // Link to the PDF file
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 mt-2"
                        >
                          {fileName}
                        </a>
                      </div>
                    ) : (
                      <Image
                        key={index}
                        src={pdf} // Image source
                        alt={`Media ${index}`} // Alt text for accessibility
                        className="w-full h-auto object-cover rounded"
                        preview={{
                          mask: <span>Preview</span>, // Custom preview mask
                        }}
                      />
                    );
                  })
                ) : (
                  <div>No media available</div>
                )}
              </div>
              {currentPage < totalPages - 1 && (
                <div className="flex justify-center mt-4">
                  <Button onClick={handleShowMorePdf} loading={loading}>
                    Show More
                  </Button>
                </div>
              )}
            </Spin>
            <Button
              type="primary"
              className="mt-4"
              onClick={handleAddFromLibraryPdf}
            >
              Add Selected Files
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      </div>
    </>
  );
};

export default UpdateBookComponent;
