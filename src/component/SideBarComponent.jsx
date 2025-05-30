import Sider from "antd/es/layout/Sider";
import { Button, Menu, theme } from "antd";
import { RiFileListLine, RiMenuAddLine, RiUserSettingsLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { AuditOutlined, BookOutlined, FileImageOutlined, FileTextOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ShoppingCartOutlined, TagsOutlined, TruckOutlined } from "@ant-design/icons";
import { useState } from "react";

const SiderBarComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className=" bg-white rounded-r-lg​​">
      <div className="flex justify-end p-2">
        <Button
          type="primary"
          style={{ background: '#292D77', color: '#fff' }}
          onClick={toggleCollapsed}

        >
          {collapsed ? <MenuUnfoldOutlined className="flex justify-items-center justify-center items-center place-content-center" /> : <MenuFoldOutlined className="flex justify-items-center justify-center items-center place-content-center" />}
        </Button>
      </div>
      <Sider
        trigger={null}
        collapsible
        width={300}
        collapsedWidth={80}
        collapsed={collapsed}
        style={{ background: colorBgContainer}}
        className="shadow-lg h-[110vh]"
      >

        <Menu
          // onClick={onClick}
          style={{ borderRight: 'none',width: '[600px]' }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={[
            {
              key: '1',
              icon: <RiUserSettingsLine style={{ color: '#292D77', fontSize: '20px' }} />,
              label: <Link to="contact">Admin Dashboard</Link>,
            },
            {
              key: '9',
              icon: <BookOutlined style={{ color: '#292D77', fontSize: '20px' }} />,
              label:<Link to="list-book">Books</Link>,
              // children: [
              //   {
              //     key: '10',
              //     icon: <RiFileListLine style={{ color: '#292D77', fontSize: '20px' }} />,
              //     label: <Link to="list-book">List Books</Link>,
              //   },
              //   {
              //     key: '11',
              //     icon: <RiMenuAddLine style={{ color: '#292D77', fontSize: '20px' }} />,
              //     label: <Link to="add-Book">Create New Book</Link>,
              //   }
              // ],
            },
            {
              key: '12',
              icon: <AuditOutlined style={{ color: '#292D77', fontSize: '20px' }} />,
              label: <Link to="list-author">List Author</Link>,
              // children: [
              //   {
              //     key: '13',
              //     icon: <RiFileListLine style={{ color: '#292D77', fontSize: '20px' }} />,
              //     label: <Link to="list-author">List Author</Link>,
              //   },
              //   {
              //     key: '14',
              //     icon: <RiMenuAddLine style={{ color: '#292D77', fontSize: '20px' }} />,
              //     label: <Link to="add-author">Create Author</Link>,
              //   }
              // ],
            },
            {
              key: '15',
              icon: <TagsOutlined style={{ color: '#292D77', fontSize: '20px' }} />,
              label: <Link to="categorise">Category</Link>,
              // children: [
              //   {
              //     key: '16',
              //     icon: <RiFileListLine style={{ color: '#292D77', fontSize: '20px' }} />,
              //     label: <Link to="category-list">List Category</Link>,
              //   },
              //   {
              //     key: '17',
              //     icon: <RiMenuAddLine style={{ color: '#292D77', fontSize: '20px' }} />,
              //     label: <Link to="categorise">Create Category</Link>,
              //   }
              // ],
            },
            {
              key: '18',
              icon: <TruckOutlined style={{ color: '#292D77', fontSize: '20px' }} />,
              label: <Link to="media">មេឌៀ</Link>,
            },
            {
              key: '21',
              icon: <ShoppingCartOutlined style={{ color: '#292D77', fontSize: '20px' }} />,
              label: <Link to="staff">មន្ត្រីផ្នែកបណ្ណាល័យ</Link>,
            },
            {
              key: '22',
              icon: <FileImageOutlined style={{ color: '#292D77', fontSize: '20px' }} />,
              label: <Link to="slide">រូបភាពស្លាយ</Link>,
            },
            {
              key: '23',
              icon: <FileImageOutlined style={{ color: '#292D77', fontSize: '20px' }} />,
              label: <Link to="gallery">រូបភាព</Link>,
            },
          ]}
        />
      </Sider>

    </div>
  )
}

export default SiderBarComponent;