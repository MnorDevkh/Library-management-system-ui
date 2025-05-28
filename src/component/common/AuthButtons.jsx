import { DashboardOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const AuthButtons = () => {
  const token = localStorage.getItem("token");

  return (
    <>
      {token ? (
        // If the user is logged in (token exists)
        <div className="flex gap-2">
          <Link to="/admin" className="text-primary-color dark:text-white">
            <button className="px-3 flex gap-2 border border-primary-color hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 text-[12px] lg:text-sm hover:text-blue-600">
              <DashboardOutlined />
             ចូលផ្ទាំងគ្រប់គ្រង
            </button>
          </Link>
          <button
            className="px-3 flex gap-2 border border-primary-color hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 text-[12px] lg:text-sm hover:text-blue-600"
            onClick={() => {
              localStorage.removeItem("token"); // Clear the token
              window.location.href = "/login"; // Redirect to login page
            }}
          >
            <LogoutOutlined />
            ចេញ
          </button>
        </div>
      ) : (
        // If the user is not logged in (no token)
        <div className="flex gap-2">
          <Link to="/login">
            <button className="border w-20 h-8 border-primary-color duration-150 hover:bg-primary-color/10 hover:border-primary-color/90 dark:border-white text-primary-color dark:text-white rounded">
              ចូលគណនី
            </button>
          </Link>
          <Link to="/register">
            <button className="border border-primary-color dark:border-primary-color w-20 h-8 rounded hover:bg-primary-color/90 bg-primary-color">
              ចុះឈ្មោះ
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthButtons;
