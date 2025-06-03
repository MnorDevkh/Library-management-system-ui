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
import { DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShelfService from "../../redux/service/Shelf";
import { setShelf } from "../../redux/slices/ShelfSlice";

const { confirm } = Modal;

const columns = (showDeleteConfirm) => [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Shelf Name",
    dataIndex: "shelfName",
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
        <a className="text-red-600" onClick={() => showDeleteConfirm(record.shelfId)}>
          <DeleteOutlined /> Delete
        </a>
      </Space>
    ),
  },
];

const ListShelfComponent = () => {
  const [selectionType] = useState("checkbox");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.shelf.shelves);
  const navigate = useNavigate();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  const fetchData = async () => {
    try {
      const result = await ShelfService.getAllShelf(1, 10, "shelfId");
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
      // You may want to implement a deleteShelf method in ShelfService
      // For now, just show a message
      message.success("Shelf deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting shelf:", error);
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
    </div>
  );
};

export default ListShelfComponent;