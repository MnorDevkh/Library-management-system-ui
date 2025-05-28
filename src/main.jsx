import store from "./redux/store.js";
import React from "react";
import RouterComponentPublic from "./routes/Public.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";

const themeConfig = {
  token: {
    fontFamily: "'KoHo', 'Kantumruy', sans-serif",
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>
        <ConfigProvider theme={themeConfig}>
          <BrowserRouter>
            <RouterComponentPublic />
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
