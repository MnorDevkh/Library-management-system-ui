import  { useEffect, useState } from "react";
import { Table, Divider, Breadcrumb, Button, Space, Modal, message } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BorrowService from "../../redux/service/borrowService";
import { setBorrowings } from "../../redux/slices/borrowSlice";

const columns = (showDeleteConfirm, handleUpdate) => [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Borrow Date",
    dataIndex: "borrowDate",
    key: "borrowDate",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
  },
  {
    title: "Return Date",
    dataIndex: "returnDate",
    key: "returnDate",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Borrower",
    dataIndex: "borrower",
    key: "borrower",
    render: (borrower) =>
      borrower
        ? `${borrower.firstName || ""} ${borrower.lastName || ""}`.trim()
        : "",
  },
  {
    title: "Staff",
    dataIndex: "staff",
    key: "staff",
    render: (staff) =>
      staff
        ? `${staff.firstName || ""} ${staff.lastName || ""}`.trim()
        : "",
  },
  {
    title: "Book Title",
    dataIndex: ["book", "title"],
    key: "bookTitle",
    render: (text, record) => record.book?.title || "",
  },
  {
    title: "Action",
    key: "action",
    render: (record) => (
      <Space size="middle">
        <a className="text-yellow-600" onClick={() => handleUpdate(record)}>
          Update
        </a>
        <a
          className="text-red-600"
          onClick={() => showDeleteConfirm(record.borrowingID)}
        >
          <DeleteOutlined /> Delete
        </a>
      </Space>
    ),
  },
];

const BorrowComponent = () => {
  const { confirm } = Modal;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const borrowingsData = useSelector((state) => state.borrow.borrowings);
  console.log("Borrowings from Redux:", borrowingsData);
  
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const result = await BorrowService.getAllBorrowings(page, size, "borrowingID");
      dispatch(setBorrowings(result.data));
      console.log("Borrowings Data:", result.data)
      setBorrowings(result.data);
      
      setPagination({
        current: result.page,
        pageSize: result.size,
        total: result.totalElements,
      });
    } catch (error) {
      message.error("Error fetching borrowings!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [dispatch]);

  const handleDelete = async (borrowingID) => {
    try {
      await BorrowService.deleteBorrowing(borrowingID);
      message.success("Borrowing deleted successfully!");
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Error deleting borrowing!");
    }
  };

  const handleUpdate = (record) => {
    navigate(`/admin/update-borrowing/${record.borrowingID}`);
  };

  const showDeleteConfirm = (borrowingID) => {
    confirm({
      title: "Are you sure you want to delete this borrowing?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(borrowingID);
      },
    });
  };

  const addNew = () => {
    navigate("/admin/add-borrowing");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb
          items={[
            { title: "Admin" },
            { title: "Borrowings" },
          ]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={addNew}>
          បន្ថែមការខ្ចីសៀវភៅ
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-1 text-blue-500 text-center pb-2">
          ការខ្ចីសៀវភៅ
        </h1>
      </div>
      <Divider />
      <Table
        columns={columns(showDeleteConfirm, handleUpdate)}
        dataSource={borrowingsData}
        rowKey={(record) => record.borrowingID}
        loading={loading}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => {
            fetchData(page, pageSize);
          },
        }}
      />
    </div>
  );
};

export default BorrowComponent;