import { Modal, Form, Input, InputNumber, Select, Upload, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const UpdateBookModal = ({ visible, onOk, onCancel, book, form }) => {
  return (
    <Modal title="Update Book" visible={visible} onOk={onOk} onCancel={onCancel} className="modal" width={1200}>
      <Form form={form} layout="vertical" initialValues={book}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the title!" }]}>
              <Input placeholder="Please input title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="isbn" label="ISBN" rules={[{ required: true, message: "Please input the ISBN!" }]}>
              <Input placeholder="Please input ISBN" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
              <TextArea rows={4} placeholder="Please input description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="publicationYear" label="Publication Year" rules={[{ required: true, message: "Please input the publication year!" }]}>
              <InputNumber placeholder="Please input publication year" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="language" label="Language" rules={[{ required: true, message: "Please input the language!" }]}>
              <Input placeholder="Please input language" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="totalCopies" label="Total Copies" rules={[{ required: true, message: "Please input the total copies!" }]}>
              <InputNumber placeholder="Please input total copies" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="availableCopies" label="Available Copies" rules={[{ required: true, message: "Please input the available copies!" }]}>
              <InputNumber placeholder="Please input available copies" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="authors" label="Authors" rules={[{ required: true, message: "Please select authors" }]}>
              <Select mode="multiple" placeholder="Please select authors">
                {/* Add options for authors here */}
                <Select.Option value={1}>Author 1</Select.Option>
                <Select.Option value={2}>Author 2</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="genreId" label="Genre" rules={[{ required: true, message: "Please select genre" }]}>
              <Select placeholder="Please select genre">
                {/* Add options for genres here */}
                <Select.Option value={1}>Genre 1</Select.Option>
                <Select.Option value={2}>Genre 2</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="publisherId" label="Publisher" rules={[{ required: true, message: "Please select publisher" }]}>
              <Select placeholder="Please select publisher">
                {/* Add options for publishers here */}
                <Select.Option value={1}>Publisher 1</Select.Option>
                <Select.Option value={2}>Publisher 2</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="bookshelf" label="Bookshelf" rules={[{ required: true, message: "Please input bookshelf" }]}>
              <InputNumber placeholder="Please input bookshelf" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Upload" valuePropName="fileList">
              <Upload listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateBookModal;