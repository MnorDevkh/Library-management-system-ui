import Sider from "antd/es/layout/Sider";
import { Button, Menu, theme } from "antd";
import { RiUserSettingsLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import {
  AuditOutlined,
  BookOutlined,
  FileImageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const SiderBarComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Get user role from localStorage
  const token = localStorage.getItem("token");
  const user_role = localStorage.getItem("user_role");

  // Menu items for admin
  const adminMenu = [
    {
      key: "1",
      icon: (
        <FileImageOutlined style={{ color: "#292D77", fontSize: "20px" }} />
      ),
      label: <span>គ្រប់គ្រង់ ការអានលើ វេបសាយ</span>,
      children: [
        {
          key: "2-1",
          label: <Link to="list-ebook">បញ្ជីសៀវភៅ អេឡិចត្រូនិច</Link>,
        },
        {
          key: "2-2",
          label: <Link to="borrowings">តារាងខ្ចីសៀវភៅ</Link>,
        },
      ],
    },
    {
      key: "2",
      icon: (
        <FileImageOutlined style={{ color: "#292D77", fontSize: "20px" }} />
      ),
      label: <span>គ្រប់គ្រងក្នុងបណ្ណាល័យ</span>,
      children: [
        {
          key: "1-2",
          icon: <BookOutlined style={{ color: "#292D77", fontSize: "20px" }} />,
          label: <Link to="books">សៀវភៅ</Link>,
        },
        {
          key: "1-3",
          icon: <BookOutlined style={{ color: "#292D77", fontSize: "20px" }} />,
          label: <Link to="publisher">អ្នកបោះពុម្ពផ្សាយ</Link>,
        },
        {
          key: "1-5",
          icon: (
            <AuditOutlined style={{ color: "#292D77", fontSize: "20px" }} />
          ),
          label: <Link to="author">អ្នកនិពន្ធ</Link>,
        },
        {
          key: "1-6",
          icon: <TagsOutlined style={{ color: "#292D77", fontSize: "20px" }} />,
          label: <Link to="categorise">ប្រភេទសៀវភៅ</Link>,
        },
        {
          key: "1-7",
          icon: <TagsOutlined style={{ color: "#292D77", fontSize: "20px" }} />,
          label: <Link to="shelf">ធ្នើរដាកសៀវភៅ</Link>,
        },
        {
          key: "1-8",
          icon: (
            <TruckOutlined style={{ color: "#292D77", fontSize: "20px" }} />
          ),
          label: <Link to="media">មេឌៀ</Link>,
        },
        {
          key: "1-9",
          icon: (
            <ShoppingCartOutlined
              style={{ color: "#292D77", fontSize: "20px" }}
            />
          ),
          label: <Link to="staff">មន្ត្រីផ្នែកបណ្ណាល័យ</Link>,
        },
        {
          key: "1-10",
          icon: (
            <FileImageOutlined style={{ color: "#292D77", fontSize: "20px" }} />
          ),
          label: <Link to="slide">រូបភាពស្លាយ</Link>,
        },
        {
          key: "1-11",
          icon: (
            <FileImageOutlined style={{ color: "#292D77", fontSize: "20px" }} />
          ),
          label: <Link to="gallery">រូបភាព</Link>,
        },
      ],
    },
    {
      key: "1-1",
      icon: (
        <RiUserSettingsLine style={{ color: "#292D77", fontSize: "20px" }} />
      ),
      label: <Link to="contact">ទំនាក់ទំនង</Link>,
    },
    {
      key: "1-4",
      icon: <BookOutlined style={{ color: "#292D77", fontSize: "20px" }} />,
      label: <Link to="user-list">អ្នកប្រើប្រាស់</Link>,
    },
  ];

  // Menu items for member
  const memberMenu = [
    {
      key: "1",
      icon: <BookOutlined style={{ color: "#292D77", fontSize: "20px" }} />,
      label: <Link to="books">សៀវភៅ</Link>,
    },
    {
      key: "23",
      icon: (
        <FileImageOutlined style={{ color: "#292D77", fontSize: "20px" }} />
      ),
      label: <Link to="gallery">រូបភាព</Link>,
    },
    {
      key: "2-2",
      icon: (
        <FileImageOutlined style={{ color: "#292D77", fontSize: "20px" }} />
      ),
      label: <Link to="borrowings">តារាងខ្ចីសៀវភៅ</Link>,
    },
  ];

  // Choose menu based on user_role
  let menuItems = [];
  if (token && user_role === "ADMIN") {
    menuItems = adminMenu;
  } else if (token && user_role === "MEMBER") {
    menuItems = memberMenu;
  }

  return (
    <div className="bg-white rounded-r-lg​​">
      <div className="flex justify-end p-2">
        <Button
          type="primary"
          style={{ background: "#292D77", color: "#fff" }}
          onClick={toggleCollapsed}
        >
          {collapsed ? (
            <MenuUnfoldOutlined className="flex justify-items-center justify-center items-center place-content-center" />
          ) : (
            <MenuFoldOutlined className="flex justify-items-center justify-center items-center place-content-center" />
          )}
        </Button>
      </div>
      <Sider
        trigger={null}
        collapsible
        width={300}
        collapsedWidth={80}
        collapsed={collapsed}
        style={{ background: colorBgContainer }}
        className="shadow-lg h-[110vh]"
      >
        <Menu
          style={{ borderRight: "none", width: "[600px]" }}
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
    </div>
  );
};

export default SiderBarComponent;
