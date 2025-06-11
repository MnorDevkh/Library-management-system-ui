import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import BorrowService from "../../redux/service/borrowService";
import api from "../../redux/service/api";
import dayjs from "dayjs";
import userService from "../../redux/service/UserService";
import BookService from "../../redux/service/BookService";

const { Option } = Select;

const UpdateBorrowingComponent = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  // Fetch book and user data for selection
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await BookService.getAllBook(1, 100, "bookId");
        console.log("Books Response:", booksRes.data);
        if (booksRes.data) {
          booksRes.data.data = booksRes.data.map((book) => ({
            ...book,
            bookId: book.bookId || book.id, // Ensure bookId is set
          }));
        }
        setBooks(booksRes.data.data || []);
        const usersRes = (await userService.getAllusers(1, 100, "id")) || {};
        console.log("Users Response:", usersRes);

        if (usersRes.data) {
          usersRes.data.data = usersRes.data.map((user) => ({
            ...user,
            id: user.id || user.userId, // Ensure id is set
          }));
        }
        setUsers(usersRes.data.data || []);
      } catch {
        message.error("លែងអាចទាញយកព ត៌មានបានទេ");
      }
    };
    fetchData();
  }, []);

  // Fetch borrowing detail
  useEffect(() => {
    const fetchBorrowing = async () => {
      setLoading(true);
      try {
        const res = await BorrowService.getBorrowingById(id);
        const data = res.data || res;
        const values = {
          borrowDate: data.borrowDate ? dayjs(data.borrowDate) : null,
          dueDate: data.dueDate ? dayjs(data.dueDate) : null,
          returnDate: data.returnDate ? dayjs(data.returnDate) : null,
          fineAmount: data.fineAmount,
          status: data.status,
          borrowerId: data.borrower?.id,
          image: data.image,
          bookId: data.book?.bookId,
        };
        setInitialValues(values);
        form.setFieldsValue(values);
      } catch {
        message.error("មិនអាចទាញយកពត៌មានបានទេ");
      }
      setLoading(false);
    };
    if (id) fetchBorrowing();
    // eslint-disable-next-line
  }, [id]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const reqBody = {
        borrowDate: values.borrowDate.format("YYYY-MM-DD"),
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        returnDate: values.returnDate.format("YYYY-MM-DD"),
        fineAmount: Number(values.fineAmount || 0),
        status: values.status,
        borrowerId: values.borrowerId,
        image: values.image || "",
        bookId: values.bookId,
      };
      await BorrowService.updateBorrowing(id, reqBody);
      message.success("កែប្រែការខ្ចីសៀវភៅជោគជ័យ!");
      navigate("/admin/borrowings");
    } catch {
      message.error("កែប្រែមិនបានជោគជ័យ!");
    }
    setLoading(false);
  };

  if (loading && !initialValues) {
    return <Spin />;
  }

  return (
    <div className="max-w-5xl  pt-4">
      <h2 className="text-2xl font-bold pb-4 text-blue-600">
        កែប្រែការខ្ចីសៀវភៅ
      </h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="កាលបរិច្ឆេទខ្ចី"
              name="borrowDate"
              rules={[{ required: true, message: "ជ្រើសរើសកាលបរិច្ឆេទ!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label="កាលបរិច្ឆេទត្រូវដកជាមូល"
              name="dueDate"
              rules={[
                { required: true, message: "ជ្រើសរើសកាលបរិច្ឆេទដេញសុពលភាព!" },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="ស្ថានភាព" name="status" initialValue="BORROWED">
              <Select>
                <Option value="BORROWED">BORROWED</Option>
                <Option value="RETURNED">RETURNED</Option>
              </Select>
            </Form.Item>
            <Form.Item label="ប្រាក់ពិន័យ" name="fineAmount">
              <Input type="number" placeholder="ប្រាក់ពិន័យ (បើមាន)" />
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="កាលបរិច្ឆេទសងវិញ"
              name="returnDate"
              rules={[{ required: true, message: "ជ្រើសរើសកាលបរិច្ឆេទសងវិញ!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label="អ្នកខ្ចី"
              name="borrowerId"
              rules={[{ required: true, message: "ជ្រើសរើសអ្នកខ្ចី!" }]}
            >
              <Select placeholder="ជ្រើសរើសអ្នកខ្ចី">
                {users.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="សៀវភៅ"
              name="bookId"
              rules={[{ required: true, message: "ជ្រើសរើសសៀវភៅ!" }]}
            >
              <Select placeholder="ជ្រើសរើសសៀវភៅ">
                {books.map((b) => (
                  <Option key={b.bookId} value={b.bookId}>
                    {b.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="warning"
                onClick={() => navigate("/admin/borrowings")}

                loading={loading}
                className="w-full"
              >
                ឈប់កែប្រែ
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
              >
                បញ្ជូន
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateBorrowingComponent;
