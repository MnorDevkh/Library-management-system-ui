import { Button, Checkbox, Form, Input, message } from "antd";
import AuthService from "../../redux/service/authService";
import LoadingComponent from "../common/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
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
      type: "error",
      content: text,
    });
  };

  const signUp = async (values) => {
    setLoading(true);
    const data = {
      fistName: values.fistName,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
      role: "MEMBER",
    };
    console.log(values);

    AuthService.signupService(data)
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
            info("Invalid username or password");
          }, 2000);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        info("Invalid username or password");
      });
  };

  const onFinish = (values) => {
    signUp(values);
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
            ចុះឈ្មោះ
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
              name="fistName"
              rules={[
                {
                  required: true,
                  message: "Please input your fistName!",
                },
              ]}
            >
              <Input
                placeholder="fistName"
                className="border rounded p-2 w-96"
              />
            </Form.Item>
            <Form.Item
              name="lastname"
              rules={[
                {
                  required: true,
                  message: "Please input your lastname!",
                },
              ]}
            >
              <Input
                placeholder="lastname"
                className="border rounded p-2 w-96"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input a valid email!",
                },
              ]}
            >
              <Input placeholder="Email" className="border rounded p-2 w-96" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Password"
                className="border rounded p-2 w-96"
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm Password"
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
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <div>
            <p className="text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
