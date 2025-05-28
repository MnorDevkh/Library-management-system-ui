import { Link } from "react-router-dom";

const MenuComponent = () => {

  const itemspath = [
    { label: "ទំព័រដើម", path: "/" },
    { label: "អំពីបណ្ណាល័យ", path: "/about" },
    { label: "បទបញ្ជាផ្ទៃក្នុង", path: "/rules" },
    { label: "មន្រីផ្នែកបណ្ណាល័យ", path: "/staff" },
    { label: "កម្រងរូបភាព", path: "/gallery" },
    { label: "ទំនាក់ទំនង", path: "/contact" },
  ];
  return (
    <div>
      <section className="-mt-20 md:bg-white md:bg-opacity-70 dark:bg-slate-600 dark:bg-opacity-70" >
        <nav className="mx-auto max-w-7xl p-4 flex flex-row justify-end items-center">
          <div>
            <ul className="mx-auto hidden md:flex max-w-7xl justify-center gap-2 py-2">
              {itemspath.map((item) => (
                <li key={item.label}>
                  <Link to={item.path}>
                    <button className="px-3 border border-primary-color hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 text-[12px] lg:text-sm hover:text-blue-600">
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
  );
};

export default MenuComponent;
