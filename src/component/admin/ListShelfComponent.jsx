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
import { DeleteOutlined, PlusOutlined, ExclamationCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShelfService from "../../redux/service/Shelf";
import { setShelf } from "../../redux/slices/ShelfSlice";
import baseURL from "../../redux/service/url";

const { confirm } = Modal;

const ListShelfComponent = () => {
  const [selectionType] = useState("checkbox");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.shelf.shelves);
  const navigate = useNavigate();

  // Modal state
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState(null);

  const handleEdit = (shelfId) => {
    navigate(`/admin/update-shelf/${shelfId}`);
  };

  const handleView = (record) => {
    setSelectedShelf(record);
    setViewModalVisible(true);
  };

  const columns = (showDeleteConfirm) => [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Shelf Name",
      dataIndex: "bookshelfName",
      key: "shelfName",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Action",
      key: "operation",
      render: (record) => (
        <Space size="middle">
          <a className="text-blue-600" onClick={() => handleView(record)}>
            <EyeOutlined /> View
          </a>
          <a className="text-yellow-600" onClick={() => handleEdit(record.bookshelfId)}>
            Edit
          </a>
          <a className="text-red-600" onClick={() => showDeleteConfirm(record.bookshelfId)}>
            <DeleteOutlined /> Delete
          </a>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  const fetchData = async () => {
    try {
      const result = await ShelfService.getAllShelf(1, 10, "bookshelfId");
      dispatch(setShelf(result.data || []));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shelves:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleDelete = async (shelfId) => {
    try {
      message.success("Shelf deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting shelf:",shelfId, error);
      message.error("Error deleting shelf!");
    }
  };

  const showDeleteConfirm = (shelfId) => {
    confirm({
      title: 'Are you sure you want to delete this shelf?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(shelfId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const addNew = () => {
    navigate('/admin/add-shelf');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb
          items={[
            { title: 'Home' },
            { title: 'Shelves' }
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={addNew}>
          New Shelf
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-1 text-blue-500 text-center pb-2">
          Shelves
        </h1>
      </div>
      <Divider />
      <Table
        columns={columns(showDeleteConfirm)}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        dataSource={data}
        loading={loading}
        rowKey="shelfId"
      />

      {/* View Modal */}
      <Modal
        title="Shelf Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
        bodyStyle={{ maxHeight: 400, overflowY: "auto" }}
      >
        {selectedShelf && (
          <div>
            <p><strong>Shelf Name:</strong> {selectedShelf.bookshelfName}</p>
            <p><strong>Location:</strong> {selectedShelf.location}</p>
            <p>
                <p>
                  {selectedShelf.image ? (
                    <img
                      src={`${baseURL.defaults.baseURL}/uploads/images/${selectedShelf.image}`}
                      alt="Publisher"
                      style={{ width: 100, height: 100, marginTop: 8 }}
                    />
                  ) : (
                    "No Image"
                  )}
                </p>
              </p>
            {/* If shelf has books, show them in a table */}
            {selectedShelf.books && selectedShelf.books.length > 0 && (
              <>
                <Divider />
                <h3>Books</h3>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  <Table
                    dataSource={selectedShelf.books}
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
                        title: "Author",
                        dataIndex: "authorName",
                        key: "authorName",
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

export default ListShelfComponent;