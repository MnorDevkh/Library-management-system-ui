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
import { DeleteOutlined, EditOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthorService from "../../redux/service/AuthorService";
import { setAllBook } from "../../redux/slices/BookSlice";

const { confirm } = Modal;

const columns = (showDeleteConfirm, handleUpdate) => [
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
        <a className="text-yellow-600" onClick={() => handleUpdate(record)}><EditOutlined /> Update</a>
        <a className="text-red-600" onClick={() => showDeleteConfirm(record.authorId)}><DeleteOutlined /> Delete</a>
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
      title: 'Are you sure you want to delete this author?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(authorId); // Call handleDelete to actually delete the author
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  
  const handleUpdate = (author) => {
    navigate(`/admin/update-author/${author.authorId}`);
  };

  const addNew = () => {
    navigate('/admin/add-author');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb
          items={[
            { title: 'Home' },
            { title: 'Authors' }
          ]}
        />
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
        columns={columns(showDeleteConfirm, handleUpdate)}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        dataSource={data.data}
        loading={loading}
      />
    </div>
  );
};

export default AuthorComponent;