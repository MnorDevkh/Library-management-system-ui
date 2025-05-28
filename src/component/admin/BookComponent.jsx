import React, { useState, useEffect } from "react";
import { Divider, Space, Table, message, Button, Breadcrumb, Modal } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookService from "../../redux/service/BookService";
import { setAllBook } from "../../redux/slices/BookSlice";
import baseURL from "../../redux/service/url";

const columns = (showDeleteConfirm, handleUpdate) => [
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
        columns={columns(showDeleteConfirm, handleUpdate)}
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
    </div>
  );
};

export default BookComponent;