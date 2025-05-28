import { Link, Outlet } from "react-router-dom";

import { Layout } from "antd";
// import logo from "../../assets/images/Monument Book logo.png"
import SiderBarComponent from "../SideBarComponent";
const AdminComponent = () => {
  return (
    <>
      <div className="bg-[#292D77] z-40 sticky top-0 shadow-lg">
        <Link to="/">
          <div className="flex ml-6 py-4 items-center text-white">
            {/* <img className="w-12 mr-5" src={logo} alt="logo" /> */}

          </div>
        </Link>
      </div>
      <Layout className="max-w-full pt-4">
        <SiderBarComponent />
        <Layout className="px-5">
          <Outlet />
        </Layout>
      </Layout>
    </>
  );
};

export default AdminComponent;