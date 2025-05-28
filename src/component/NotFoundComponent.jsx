import { Link} from "react-router-dom";

const NotFound = () => {
  return (
    // page not found
    <section className="h-screen w-full flex flex-col justify-center items-center bg-[#292D77]">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">
        404
      </h1>
      <p className="bg-[#FF6A3D] px-2 text-md rounded rotate-12 absolute py-1 text-white">
        Page Not Found
      </p>
      <Link
        to="/"
        className="mt-5 relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring"
      >
        <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>
        <span className="relative block px-8 py-3 bg-[#292D77] border border-current">
          Go Home
        </span>
      </Link>
    </section>
  );
};

export default NotFound;