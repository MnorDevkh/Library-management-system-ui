import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import BorrowService from "../../redux/service/borrowService";
import api from "../../redux/service/api";

const { Option } = Select;

const AddBorrowComponent = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch book and user data for selection
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming Book API is /books?page=1&size=100 and User API is /users?page=1&size=100
        const booksRes = await api.get("/books?page=1&size=100");
        setBooks(booksRes.data.data || []);

        const usersRes = await api.get("/users?page=1&size=100");
        setUsers(usersRes.data.data || []);
      } catch {
        message.error("លែងអាចទាញយកព ត៌មានបានទេ");
      }
    };
    fetchData();
  }, []);

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
      await BorrowService.addBorrowing(reqBody);
      message.success("បញ្ចូលការខ្ចីសៀវភៅថ្មីជោគជ័យ!");
      navigate("/admin/borrowings");
    } catch {
      message.error("បញ្ចូលលទ្ធផលមិនជោគជ័យ!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto pt-4">
      <h2 className="text-2xl font-bold pb-4 text-blue-600">បង្កើតការខ្ចីសៀវភៅថ្មី</h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="កាលបរិច្ឆេទខ្ចី" name="borrowDate" rules={[{ required: true, message: "ជ្រើសរើសកាលបរិច្ឆេទ!" }]}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item label="កាលបរិច្ឆេទត្រូវដកជាមូល" name="dueDate" rules={[{ required: true, message: "ជ្រើសរើសកាលបរិច្ឆេទដេញសុពលភាព!" }]}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item label="កាលបរិច្ឆេទសងវិញ" name="returnDate" rules={[{ required: true, message: "ជ្រើសរើសកាលបរិច្ឆេទសងវិញ!" }]}>
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item label="អ្នកខ្ចី" name="borrowerId" rules={[{ required: true, message: "ជ្រើសរើសអ្នកខ្ចី!" }]}>
          <Select placeholder="ជ្រើសរើសអ្នកខ្ចី">
            {users.map((u) =>
              <Option key={u.id} value={u.id}>{u.firstName} {u.lastName}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="សៀវភៅ" name="bookId" rules={[{ required: true, message: "ជ្រើសរើសសៀវភៅ!" }]}>
          <Select placeholder="ជ្រើសរើសសៀវភៅ">
            {books.map((b) =>
              <Option key={b.bookId} value={b.bookId}>{b.title}</Option>)}
          </Select>
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
        <Form.Item label="រូបភាព (ជាជំរៅ)" name="image">
          <Input placeholder="URL រូបភាព" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="w-full">
            បញ្ជូន
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddBorrowComponent;