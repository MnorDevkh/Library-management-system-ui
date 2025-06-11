import { useEffect, useState } from "react";
import {
  Table,
  Divider,
  Breadcrumb,
  Button,
  Space,
  Modal,
  message,
  Descriptions,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BorrowService from "../../redux/service/borrowService";
import { setBorrowings } from "../../redux/slices/borrowSlice";

const columns = (showDeleteConfirm, handleUpdate, handleView) => [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "ឈ្មោះអ្នកខ្ចី",
    dataIndex: "borrower",
    key: "borrower",
    render: (borrower) =>
      borrower
        ? `${borrower.firstName || ""} ${borrower.lastName || ""}`.trim()
        : "",
  },
  {
    title: "សៀវភៅ",
    dataIndex: ["book", "title"],
    key: "bookTitle",
    render: (text, record) => record.book?.title || "",
  },
  {
    title: "ឈ្មោះបុគ្គលិក",
    dataIndex: "staff",
    key: "staff",
    render: (staff) =>
      staff ? `${staff.firstName || ""} ${staff.lastName || ""}`.trim() : "",
  },
  {
    title: "ថ្ងៃខ្ចី",
    dataIndex: "borrowDate",
    key: "borrowDate",
  },
  {
    title: "ថ្ងៃផុតកំណត់",
    dataIndex: "dueDate",
    key: "dueDate",
  },
  {
    title: "ថ្ងៃត្រឡប់",
    dataIndex: "returnDate",
    key: "returnDate",
  },
  {
    title: "ស្ថានភាព",
    dataIndex: "status",
    key: "status",
  },
   {
    title: "សំណងទឹកប្រាក់",
    dataIndex: "fineAmount",
    key: "fineAmount",
  },
  {
    title: "សកម្ម",
    key: "action",
    render: (record) => (
      <Space size="middle">
        <Button type="link" onClick={() => handleView(record.borrowingID)}>
          View
        </Button>
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const result = await BorrowService.getAllBorrowings(
        page,
        size,
        "borrowingID"
      );
      dispatch(setBorrowings(result.data));
      console.log("Borrowings Data:", result.data);
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
  const handleView = async (borrowingID) => {
    try {
      const res = await BorrowService.getBorrowingById(borrowingID);
      setViewData(res.data);
      setViewModalOpen(true);
    } catch {
      message.error("មិនអាចទាញយកពត៌មានបានទេ");
    }
  };
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
        <Breadcrumb items={[{ title: "Admin" }, { title: "Borrowings" }]} />
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
        columns={columns(showDeleteConfirm, handleUpdate, handleView)}
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

      <Modal
        open={viewModalOpen}
        title="Borrowing Detail"
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={700}
      >
        {viewData && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Borrow Date">
              {viewData.borrowDate}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {viewData.dueDate}
            </Descriptions.Item>
            <Descriptions.Item label="Return Date">
              {viewData.returnDate}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {viewData.status}
            </Descriptions.Item>
            <Descriptions.Item label="Fine Amount">
              {viewData.fineAmount ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Borrower">
              {viewData.borrower
                ? `${viewData.borrower.firstName} ${viewData.borrower.lastName} (${viewData.borrower.email})`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Staff">
              {viewData.staff
                ? `${viewData.staff.firstName} ${viewData.staff.lastName} (${viewData.staff.email})`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Book">
              {viewData.book
                ? `${viewData.book.title} (ISBN: ${viewData.book.isbn})`
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default BorrowComponent;
