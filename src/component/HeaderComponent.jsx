import { useCallback, useState } from "react";
import { Button, Drawer, Image, Menu, Space } from "antd";
import { BarsOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { ModeToggleAfterLogin } from "./ModeToggleAfterLogin";
import { Link } from "react-router-dom";
import AuthButtons from "./common/AuthButtons";

const HeaderComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showLoading = useCallback(() => {
    setOpen(true);
  }, []);


  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
    // Add your search logic here
  };
  const itemspath = [
    { label: "ទំព័រដើម", path: "/" },
    { label: "អំពីបណ្ណាល័យ", path: "/about" },
    { label: "បទបញ្ជាផ្ទៃក្នុង", path: "/rules" },
    { label: "មន្រីផ្នែកបណ្ណាល័យ", path: "/staff" },
    { label: "កម្រងរូបភាព", path: "/gallery" },
    { label: "ទំនាក់ទំនង", path: "/contact" },
  ];

  return (
    <header>
      <section className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <section className="flex items-center gap-2">
          <Image
            src="/assets/ailogo.png"
            alt="Library Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </section>

        <section className="relative hidden md:flex max-w-md flex-1 items-center px-4">
          <input
            type="text"
            placeholder="Search books by name"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full bg-transparent h-full rounded-tl-[5px] text-sm lg:text-md focus:text-gray-500 rounded-bl-[5px] pl-2 focus:outline-none pr-4 border focus:ring-0 px-0 py-2 dark:text-primary-color-text"
          />
          <button
            className="border border-primary-color border-rounded- h-[35px] rounded-r-[5px] "
            onClick={handleSearch}
          >
            <div className="bg-primary-color text-white h-full flex rounded-r-[4px] items-center px-2">
              <SearchOutlined className="h-7" />
            </div>
          </button>
        </section>

        <section className="flex items-center gap-2">
          <button className="md:hidden" onClick={handleSearch}>
            <SearchOutlined className="h-7 text-primary-color dark:text-white" />
          </button>
          <div className="hidden md:flex">
            <ModeToggleAfterLogin />
          </div>
          <div className="hidden md:flex gap-2">
            <AuthButtons />
          </div>

          <div className="block md:hidden">
            <Button type="primary" onClick={showLoading}>
              <BarsOutlined />
            </Button>
          </div>
          <Drawer
            closable
            destroyOnClose
            width={250}
            title={
              <p className="text-primary-color dark:text-white">Menu</p> // Title adapts to dark mode
            }
            placement="right"
            open={open}
            loading={loading}
            onClose={() => setOpen(false)}
            extra={
              <Space>
                <ModeToggleAfterLogin />
              </Space>
            }
            className="dark:bg-slate-600 dark:text-white"
          >
            <div>
              <div>
                <section className="md:bg-white md:bg-opacity-70 dark:bg-slate-600 dark:bg-opacity-70">
                  <nav className="mx-auto max-w-7xl flex flex-row justify-start items-center">
                    <div>
                      <ul className="p-4 md:flex max-w-7xl gap-2">
                        {itemspath.map((item) => (
                          <li key={item.label}>
                            <Link to={item.path}>
                              <button className="border-primary-color hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 text-[12px] lg:text-sm hover:text-blue-600">
                                {item.label}
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                </section>
              </div>
              <div className="absolute bottom-4 right-4">
                <AuthButtons />
              </div>
            </div>
          </Drawer>
        </section>
      </section>
      <hr />
    </header>
  );
};

export default HeaderComponent;
