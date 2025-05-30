import { EnvironmentOutlined, GlobalOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import MenuComponent from "../MenuComponent";
import { Button, Form, Input, message } from "antd";

import ContactServer from "../../redux/service/ContactUsService";

const ContactComponent = () => {
  const onFinish = async (values) => {
    ContactServer.contact(values)
  .then(() => {
    message.success("Message sent successfully!");
  })
  .catch((err) => {
    console.error("Error sending message:", err);
    message.error("Failed to send message.");
  });
  };
  return (
    <div>
      <div>
        <section
          className="mx-auto max-w-7xl p-4 flex flex-row justify-between items-center bg-cover bg-center"
          style={{
            backgroundImage: "url('./src/assets/banner.png')",
            height: "350px",
          }}
        ></section>
        <MenuComponent />
        <div className="mx-auto max-w-7xl ">
         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-3/4 mx-auto">
           {/* Contact Form */}
           <div className="bg-white p-8">
            <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: "Please enter a subject" }]}
              >
                <Input placeholder="Subject" />
              </Form.Item>
              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: "Please enter your message" }]}
              >
                <Input.TextArea rows={4} placeholder="Message" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-500 text-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Contact us</h2>
            <div className="flex items-center mb-4">
              <EnvironmentOutlined className="text-2xl mr-4" />
              <p>#583, Trea 3 Village, Sangkat Stung Meanchey 1, Khan Meanchey Phnom Penh, Phnom Penh, Cambodia</p>
            </div>
            <div className="flex items-center mb-4">
              <PhoneOutlined className="text-2xl mr-4" />
              <p>+855 96 643 4398</p>
            </div>
            <div className="flex items-center mb-4">
              <MailOutlined className="text-2xl mr-4" />
              <p>info@sadi.edu.kh</p>
            </div>
            <div className="flex items-center">
              <GlobalOutlined className="text-2xl mr-4" />
              <p>aga-institute.edu.kh</p>
            </div>
          </div>
         </div>
        </div>
      </div>
    </div>
  );
};

export default ContactComponent;
