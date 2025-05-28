import { Link, Outlet } from "react-router-dom";
import SiderBarComponent from "../component/SideBarComponent";
import { Image, Layout } from "antd";

const AdminLayoutComponent = () => {
  return (
    <>
      <div className="font-koho bg-[#292D77] z-40 sticky top-0 shadow-lg">
        <Link to="/">
          <div className="flex ml-6 py-4 items-center text-white">
            <Image
              src="./src/assets/ailogo.png"
              alt="Library Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </Link>
      </div>
      <div className="w-full max-w-full pt-4 flex">
        <SiderBarComponent />
        <div className="px-5 w-full max-w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayoutComponent;
