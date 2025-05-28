import { Spin } from "antd";

const LoadingComponent = () => {
  return (
      <div className="flex justify-center items-center w-full h-screen fixed top-0 left-0 right-0 z-[1000] bg-white bg-opacity-40 text-primary">
        <Spin size="large" />
      </div>
  );
};

export default LoadingComponent;
