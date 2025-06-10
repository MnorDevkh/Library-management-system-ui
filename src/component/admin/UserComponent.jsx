import React, { useEffect, useState } from "react";
import { Table, Tabs, Button, Space, Modal, message, Tag, Breadcrumb, Descriptions } from "antd";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../redux/service/UserService";
import { setAllUsers } from "../../redux/slices/UserSlice";
import { PlusOutlined, ExclamationCircleOutlined, EyeOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const roleTabs = [
  { key: "ALL", label: "ទាំងអស់" },
  { key: "ADMIN", label: "អ្នកគ្រប់គ្រង" },
  { key: "STAFF", label: "បុគ្គលិក" },
  { key: "MEMBER", label: "សមាជិក" },
];

const BorrowDetailTable = ({ borrowings }) => (
  <Table
    columns={[
      { title: "ID", dataIndex: "borrowingID", key: "borrowingID" },
      { title: "Borrow Date", dataIndex: "borrowDate", key: "borrowDate" },
      { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
      { title: "Return Date", dataIndex: "returnDate", key: "returnDate" },
      { title: "Status", dataIndex: "status", key: "status" },
      {
        title: "Book Title",
        dataIndex: ["book", "title"],
        key: "bookTitle",
        render: (text, record) => record.book?.title || "",
      },
      {
        title: "Staff",
        dataIndex: ["staff", "firstName"],
        key: "staff",
        render: (text, record) =>
          record.staff
            ? `${record.staff.firstName || ""} ${record.staff.lastName || ""}`.trim()
            : "",
      },
      {
        title: "Fine Amount",
        dataIndex: "fineAmount",
        key: "fineAmount",
      },
    ]}
    dataSource={borrowings}
    rowKey="borrowingID"
    pagination={false}
    size="small"
  />
);

const columns = (showDeleteConfirm, handleEdit, handleView) => [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role) => {
      let color = "blue";
      if (role === "ADMIN") color = "red";
      else if (role === "STAFF") color = "orange";
      else if (role === "MEMBER") color = "green";
      return <Tag color={color}>{role}</Tag>;
    },
  },
  {
    title: "Action",
    key: "action",
    render: (record) => (
      <Space>
        <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
          View
        </Button>
        <Button type="link" onClick={() => handleEdit(record.id)}>
          Edit
        </Button>
        <Button type="link" danger onClick={() => showDeleteConfirm(record.id)}>
          Delete
        </Button>
      </Space>
    ),
  },
];

const UserComponent = () => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.user.allUsers);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("ALL");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal state for borrow detail
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (roleKey = role, page = 1, size = 10) => {
    setLoading(true);
    try {
      let data;
      if (roleKey === "ALL") {
        data = await UserService.getAllusers(page, size, "id");
      } else {
        data = await UserService.getAllusers(page, size, "id", roleKey);
      }
      // Support both .content and .data for array, and .totalElements for total
      const usersArr = data.content || data.data || [];
      dispatch(setAllUsers(usersArr));
      setPagination({
        current: data.page || page,
        pageSize: data.size || size,
        total: data.totalElements || usersArr.length,
      });
    } catch {
      message.error("មិនអាចទាញយកទិន្នន័យអ្នកប្រើបានទេ");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(role, 1, pagination.pageSize);
    // eslint-disable-next-line
  }, [role]);

  const handleEdit = (id) => {
    message.info(`Edit user ${id}`);
    // Implement navigation to edit page if needed
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "តើអ្នកពិតជាចង់លុបអ្នកប្រើនេះមែនទេ?",
      icon: <ExclamationCircleOutlined />,
      okText: "បាទ/ចាស",
      okType: "danger",
      cancelText: "ទេ",
      onOk: async () => {
        try {
          await UserService.deleteuser(id);
          message.success("លុបបានជោគជ័យ");
          fetchUsers(role, pagination.current, pagination.pageSize);
        } catch {
          message.error("លុបមិនបានជោគជ័យ");
        }
      },
    });
  };

  const handleTableChange = (pageObj) => {
    fetchUsers(role, pageObj.current, pageObj.pageSize);
  };

  // View borrow detail popup
  const handleView = (user) => {
    setSelectedUser(user);
    setBorrowModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb
          items={[
            { title: "Admin" },
            { title: "User" },
          ]}
        />
        {/* <Button type="primary" icon={<PlusOutlined />}>
          បន្ថែមអ្នកប្រើ
        </Button> */}
      </div>
      <h2 className="text-2xl font-bold mb-4">បញ្ជីអ្នកប្រើប្រាស់</h2>
      <Tabs
        activeKey={role}
        onChange={setRole}
        items={roleTabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
        }))}
      />
      <Table
        columns={columns(showDeleteConfirm, handleEdit, handleView)}
        dataSource={usersData}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
        }}
      />

      <Modal
        open={borrowModalOpen}
        title="Borrowing Detail"
        onCancel={() => setBorrowModalOpen(false)}
        footer={null}
        width={900}
      >
        {selectedUser && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="User">{selectedUser.firstName} {selectedUser.lastName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Role">{selectedUser.role}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedUser.address || "-"}</Descriptions.Item>
            </Descriptions>
            <div className="mt-4">
              <h3 className="font-bold mb-2">Borrowing List</h3>
              <BorrowDetailTable borrowings={selectedUser.borrowingResponses || []} />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default UserComponent;