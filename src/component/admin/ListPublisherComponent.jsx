import React, { useState, useEffect } from "react";
import {
  Divider,
  Space,
  Table,
  message,
  Button,
  Breadcrumb,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PublisherService from "../../redux/service/PublisherService";
import baseURL from "../../redux/service/url";

const columns = (showDeleteConfirm, handleUpdate, handleView) => [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Publisher Name",
    dataIndex: "publisherName",
    key: "publisherName",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email) => email || "No Email",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image) =>
      image ? (
        <img
          src={`${baseURL.defaults.baseURL}/uploads/images/${image}`}
          alt="Publisher"
          style={{ width: 50, height: 50 }}
        />
      ) : (
        "No Image"
      ),
  },
  {
    title: "Action",
    key: "action",
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
          onClick={() => showDeleteConfirm(record.publisherId)}
        >
          <DeleteOutlined /> Delete
        </a>
      </Space>
    ),
  },
];

const ListPublisherComponent = () => {
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    data: [],
    currentPage: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const navigate = useNavigate();

  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      const result = await PublisherService.getAllPublicher(
        page,
        pageSize,
        "publisherId"
      );
      setData({
        data: result.data,
        currentPage: result.page,
        totalItems: result.totalElements,
        pageSize: result.size,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching publishers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (publisherId) => {
    try {
      // await PublisherService.deletePublisher(publisherId); // Uncomment if delete API exists
      message.success("Publisher deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting publisher:", error);
      message.error("Error deleting publisher!");
    }
  };

  const handleUpdate = (publisher) => {
    navigate(`/admin/update-publisher/${publisher.publisherId}`);
  };

  const handleView = (publisher) => {
    setSelectedPublisher(publisher);
    setViewModalVisible(true);
  };

  const showDeleteConfirm = (publisherId) => {
    confirm({
      title: "Are you sure you want to delete this publisher?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(publisherId);
      },
      onCancel() {
        // Do nothing
      },
    });
  };

  const addNew = () => {
    navigate("/admin/add-publisher");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb items={[{ title: "Admin" }, { title: "Publisher" }]} />
        <Button type="primary" icon={<PlusOutlined />} onClick={addNew}>
          បន្ថែមអ្នកបោះពុម្ព
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-1 text-blue-500 text-center pb-2">
          បញ្ជីអ្នកបោះពុម្ព
        </h1>
      </div>
      <Divider />
      <Table
        columns={columns(showDeleteConfirm, handleUpdate, handleView)}
        dataSource={data.data}
        rowKey={(record) => record.publisherId}
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

      {/* View Modal */}
      <Modal
        title="Publisher Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
        bodyStyle={{ maxHeight: 500, overflowY: "auto" }} // Set modal height and scroll
      >
        {selectedPublisher && (
          <div>
            <p>
              <strong>Publisher Name:</strong> {selectedPublisher.publisherName}
            </p>
            <p>
              <strong>Address:</strong> {selectedPublisher.address}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedPublisher.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {selectedPublisher.email}
            </p>
            <p>
              {selectedPublisher.image ? (
                <img
                  src={`${baseURL.defaults.baseURL}/uploads/images/${selectedPublisher.image}`}
                  alt="Publisher"
                  style={{ width: 100, height: 100, marginTop: 8 }}
                />
              ) : (
                "No Image"
              )}
            </p>
            {selectedPublisher.books && selectedPublisher.books.length > 0 && (
              <>
                <Divider />
                <h3>Books</h3>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  <Table
                    dataSource={selectedPublisher.books}
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
                        dataIndex: "genre",
                        key: "genre",
                      },
                      {
                        title: "Author",
                        dataIndex: "author",
                        key: "author",
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

export default ListPublisherComponent;
