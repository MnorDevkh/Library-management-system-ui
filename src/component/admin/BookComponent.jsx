import React, { useState, useEffect } from "react";
import { Divider, Space, Table, message, Button, Breadcrumb, Modal, Descriptions } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookService from "../../redux/service/BookService";
import { setAllBook } from "../../redux/slices/BookSlice";
import baseURL from "../../redux/service/url";

const columns = (showDeleteConfirm, handleUpdate, handleView) => [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "ISBN",
    dataIndex: "isbn",
    key: "isbn",
  },
  {
    title: "Authors",
    dataIndex: "authorDtos",
    key: "authors",
    render: (authors) =>
      Array.isArray(authors)
        ? authors.map((author) => `${author.firstName} ${author.lastName}`).join(", ")
        : "No Authors",
  },
  {
    title: "Cover",
    dataIndex: "cover",
    key: "cover",
    render: (cover) => (
      cover ? <img src={`${baseURL.defaults.baseURL}/uploads/images/${cover}`} alt="Book Cover" style={{ width: 50, height: 50 }} /> : "No Cover"
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (record) => (
      <Space size="middle">
        <Button icon={<EyeOutlined />} onClick={() => handleView(record.bookId)}>
          View
        </Button>
        <a className="text-yellow-600" onClick={() => handleUpdate(record)}>
          <EditOutlined /> Update
        </a>
        <a className="text-red-600" onClick={() => showDeleteConfirm(record.bookId)}>
          <DeleteOutlined /> Delete
        </a>
      </Space>
    ),
  },
];

const BookComponent = () => {
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.book.allBook);
  const navigate = useNavigate();

  // View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      const result = await BookService.getAllBook(page, pageSize, "bookId");
      dispatch(setAllBook({
        data: result.data,
        currentPage: result.page,
        totalItems: result.totalElements,
        pageSize: result.size,
      }));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleDelete = async (bookId) => {
    try {
      await BookService.deleteBook(bookId);
      message.success("Book deleted successfully!");
      fetchData(); // Refresh the book list
    } catch (error) {
      console.error("Error deleting book:", error);
      message.error("Error deleting book!");
    }
  };

  const handleUpdate = (book) => {
    navigate(`/admin/update-book/${book.bookId}`);
  };

  const showDeleteConfirm = (bookId) => {
    confirm({
      title: 'Are you sure you want to delete this author?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(bookId); // Call handleDelete to actually delete the author
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  };

  // View handler
  const handleView = async (bookId) => {
    
    try {
      // Replace this with your actual service call to get bookshelf/book detail by ID
      const res = await BookService.getBookById(bookId); 
      console.log("View Data:", res.data);
      
      setViewData(res.data);
      setViewModalOpen(true);
    } catch (error) {
      message.error("មិនអាចទាញយកពត៌មានបានទេ");
    }
  };

  const addNew = () => {
    navigate('/admin/add-book');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb
          items={[
            { title: 'Admin' },
            { title: 'Book' }
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={addNew}>
          បន្ថែមសៀវភៅ
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-1 text-blue-500 text-center pb-2">
          សៀវភៅ
        </h1>
      </div>
      <Divider />
      <Table
        columns={columns(showDeleteConfirm, handleUpdate, handleView)}
        dataSource={data.data}
        rowKey={(record) => record.bookId}
        loading={loading}
        pagination={{
          current: data.currentPage,
          total: data.totalItems,
          pageSize: data.pageSize,
          onChange: (page, pageSize) => {
            setLoading(true);
            fetchData(page, pageSize);
          },
        }}
      />
<Modal
  open={viewModalOpen}
  title="Book Detail"
  onCancel={() => setViewModalOpen(false)}
  footer={null}
  width={800}
>
  {viewData && (
    <Descriptions bordered column={1} size="small">
      <Descriptions.Item label="Title">{viewData.title}</Descriptions.Item>
      <Descriptions.Item label="ISBN">{viewData.isbn}</Descriptions.Item>
      <Descriptions.Item label="Description">{viewData.description}</Descriptions.Item>
      <Descriptions.Item label="Publication Year">{viewData.publicationYear}</Descriptions.Item>
      <Descriptions.Item label="Language">{viewData.language}</Descriptions.Item>
      <Descriptions.Item label="Total Copies">{viewData.totalCopies}</Descriptions.Item>
      <Descriptions.Item label="Available Copies">{viewData.availableCopies}</Descriptions.Item>
      <Descriptions.Item label="Date">{viewData.date}</Descriptions.Item>
      <Descriptions.Item label="Cover">
        {viewData.cover ? (
          <img
            src={
              viewData.cover.startsWith("http")
                ? viewData.cover
                : `${baseURL.defaults.baseURL}/uploads/images/${viewData.cover}`
            }
            alt="Book Cover"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : "No Cover"}
      </Descriptions.Item>
      <Descriptions.Item label="Authors">
        {Array.isArray(viewData.authorDtos)
          ? viewData.authorDtos.map(a => `${a.firstName} ${a.lastName}`).join(", ")
          : "No Authors"}
      </Descriptions.Item>
      <Descriptions.Item label="Genre">
        {viewData.genreDTO
          ? viewData.genreDTO.genreName
          : "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Publisher">
        {viewData.publisherDto
          ? viewData.publisherDto.publisherName
          : "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Bookshelf">
        {viewData.bookshelf
          ? `${viewData.bookshelf.bookshelfName} (${viewData.bookshelf.location})`
          : "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Bookshelf Image">
        {viewData.bookshelf && viewData.bookshelf.image ? (
          <img
            src={
              viewData.bookshelf.image.startsWith("http")
                ? viewData.bookshelf.image
                : `${baseURL.defaults.baseURL}/uploads/images/${viewData.bookshelf.image}`
            }
            alt="Bookshelf"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : "No Image"}
      </Descriptions.Item>
    </Descriptions>
  )}
</Modal>
    </div>
  );
};

export default BookComponent;