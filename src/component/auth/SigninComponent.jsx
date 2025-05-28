import { Button, Checkbox, Form, Input } from "antd";
import AuthService from "../../redux/service/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { message } from "antd";
import LoadingComponent from "../common/LoadingComponent";

const SignIn = () => {
  const setLocalStorageItems = (data) => {
    localStorage.setItem("token", data.body.token);
    localStorage.setItem("userId", data.body.id);
    localStorage.setItem("user_role", data.body.role);
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const info = (text) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };

  const login = async (values) => {
    setLoading(true);
    console.log(values);
    AuthService.signInService(values) 
      .then((res) => {
        if (res.data.body.status != false) {
          setLocalStorageItems(res.data);
          const token = localStorage.getItem("token");
          setTimeout(() => {
            setLoading(false);
            if (token) {
              navigate(-1);
            }
          }, 2000);
        } else {
          setTimeout(() => {
            setLoading(false);
            info(res.data.body.message);
          }, 2000);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onFinish = (values) => {
    login(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      {loading && <LoadingComponent />}
      <div className="flex justify-center items-center h-screen">
        <div className="p-14 bg-slate-200 rounded-md shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-blue-500 text-center pb-10">
            Sign In
          </h1>
          <Form
            name="basic"
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                placeholder="email"
                className="border rounded p-2 w-96"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                className="border rounded p-2 w-96"
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-96"
              >
                Log In
              </Button>
            </Form.Item>
          </Form>
          <div>
            <p className="text-center mt-4">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-blue-500">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn
