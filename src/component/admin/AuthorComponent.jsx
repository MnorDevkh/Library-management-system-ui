import { useState, useEffect } from "react";
import {
  Divider,
  Space,
  Table,
  message,
  Breadcrumb,
  Button,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthorService from "../../redux/service/AuthorService";
import { setAllBook } from "../../redux/slices/BookSlice";
import baseURL from "../../redux/service/url";

const { confirm } = Modal;

const columns = (showDeleteConfirm, handleUpdate, handleView) => [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "FirstName",
    dataIndex: "firstName",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "LastName",
    dataIndex: "lastName",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Bio",
    dataIndex: "bio",
  },
  {
    title: "Nationality",
    dataIndex: "nationality",
  },
  {
    title: "Action",
    key: "operation",
    render: (record) => (
      <Space size="middle">
        <a className="text-blue-600" onClick={() => handleView(record)}>
          <EyeOutlined /> View
        </a>
        <a className="text-yellow-600" onClick={() => handleUpdate(record)}>
          <EditOutlined /> Update
        </a>
        <a
          className="text-red-600"
          onClick={() => showDeleteConfirm(record.authorId)}
        >
          <DeleteOutlined /> Delete
        </a>
      </Space>
    ),
  },
];

const AuthorComponent = () => {
  const [selectionType] = useState("checkbox");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.book.allBook);
  const navigate = useNavigate();

  // Modal state
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  const fetchData = async () => {
    try {
      const result = await AuthorService.getAllAuthors(1, 10, "authorId");
      dispatch(setAllBook(result));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching authors:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleDelete = async (authorId) => {
    try {
      await AuthorService.deleteAuthor(authorId);
      message.success("Author deleted successfully!");
      fetchData(); // Refresh the author list
    } catch (error) {
      console.error("Error deleting author:", error); // Handle the error here
      message.error("Error deleting author!"); // Show error message
    }
  };

  const showDeleteConfirm = (authorId) => {
    confirm({
      title: "Are you sure you want to delete this author?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(authorId); // Call handleDelete to actually delete the author
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleUpdate = (author) => {
    navigate(`/admin/update-author/${author.authorId}`);
  };

  const handleView = (author) => {
    setSelectedAuthor(author);
    setViewModalVisible(true);
  };

  const addNew = () => {
    navigate("/admin/add-author");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb items={[{ title: "Home" }, { title: "Authors" }]} />
        <Button type="primary" icon={<PlusOutlined />} onClick={addNew}>
          New Author
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-1 text-blue-500 text-center pb-2">
          Authors
        </h1>
      </div>
      <Divider />
      <Table
        columns={columns(showDeleteConfirm, handleUpdate, handleView)}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        dataSource={data.data}
        loading={loading}
      />

      {/* View Modal */}
      <Modal
        title="Author Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
        bodyStyle={{ maxHeight: 500, overflowY: "auto" }}
      >
        {selectedAuthor && (
          <div className="flex items-center">
            <div>
              <p>
                <strong>First Name:</strong> {selectedAuthor.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedAuthor.lastName}
              </p>
              <p>
                <strong>Bio:</strong> {selectedAuthor.bio}
              </p>
              <p>
                <strong>Nationality:</strong> {selectedAuthor.nationality}
              </p>
            </div>
            <div className="ml-4">
              <p>
                <p>
                  {selectedAuthor.image ? (
                    <img
                      src={`${baseURL.defaults.baseURL}/uploads/images/${selectedAuthor.image}`}
                      alt="Publisher"
                      style={{ width: 100, height: 100, marginTop: 8 }}
                    />
                  ) : (
                    "No Image"
                  )}
                </p>
              </p>
            </div>

            {selectedAuthor.books && selectedAuthor.books.length > 0 && (
              <>
                <Divider />
                <h3>Books</h3>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  <Table
                    dataSource={selectedAuthor.books}
                    rowKey={(record) => record.bookId}
                    pagination={false}
                    size="small"
                    columns={[
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
                        title: "Genre",
                        dataIndex: "genreName",
                        key: "genreName",
                      },
                      {
                        title: "Publisher",
                        dataIndex: "publisherName",
                        key: "publisherName",
                      },
                    ]}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuthorComponent;
