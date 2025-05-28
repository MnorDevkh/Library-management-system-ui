import { useCallback, useEffect, useState } from "react";
import { Breadcrumb, Button, message, Modal, Space, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGenres } from "../../redux/slices/GenreSlice";
import GenreService from "../../redux/service/GenreService";
import baseURL from "../../redux/service/url";
const columns = (showDeleteConfirm, handleUpdate) => [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Cateogory Name",
    dataIndex: "genreName",
    key: "genreName",
  },
  {
    title: "Cateogory Name (Khmer)",
    dataIndex: "genreNameKh",
    key: "genreNameKh",
  },
  {
    title: "Authors",
    dataIndex: "authorDtos",
    key: "authors",
    render: (authors) =>
      Array.isArray(authors)
        ? authors
            .map((author) => `${author.firstName} ${author.lastName}`)
            .join(", ")
        : "No Authors",
  },
  {
    title: "Cover",
    dataIndex: "image",
    key: "image",
    render: (cover) =>
      cover ? (
        <img
          src={`${baseURL.defaults.baseURL}/uploads/images/${cover}`}
          alt="Book Cover"
          style={{ width: 50, height: 50 }}
        />
      ) : (
        "No Cover"
      ),
  },
  {
    title: "Action",
    key: "action",
    render: (record) => (
      <Space size="middle">
        <a className="text-yellow-600" onClick={() => handleUpdate(record)}>
          <EditOutlined /> Update
        </a>
        <a
          className="text-red-600"
          onClick={() => showDeleteConfirm(record.genreId)}
        >
          <DeleteOutlined /> Delete
        </a>
      </Space>
    ),
  },
];

const CategoriesComponent = () => {
  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const data = useSelector((state) => state.genre.genres);
  // const data = [
  //   {
  //     key: "1",
  //     firstName: "ខេន",
  //     lastName: "សុខា",
  //     age: 32,
  //     address: "New York No. 1 Lake Park",
  //     tags: ["nice", "developer"],
  //   },
  //   {
  //     key: "2",
  //     firstName: "Jim",
  //     lastName: "Green",
  //     age: 42,
  //     address: "London No. 1 Lake Park",
  //     tags: ["loser"],
  //   },
  //   {
  //     key: "3",
  //     firstName: "Joe",
  //     lastName: "Black",
  //     age: 32,
  //     address: "Sydney No. 1 Lake Park",
  //     tags: ["cool", "teacher"],
  //   },
  // ];

  const dispatch = useDispatch();

  const info = useCallback(
    (text) => {
      messageApi.open({
        type: "error",
        content: text,
      });
    },
    [messageApi]
  );

  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      const res = await GenreService.getAllGenres(page, pageSize, "genreId");
      console.log(res.data);

      dispatch(setGenres(res.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching genres:", error);
      info("Failed to fetch genres.");
    }
  };

  const handleDelete = async (genreId) => {
    try {
      await GenreService.deleteGenre(genreId);
      message.success("Category deleted successfully!");
      fetchData(); // Refresh the book list
    } catch (error) {
      console.error("Error deleting book:", error);
      message.error("Error deleting Category!");
    }
  };

  const handleUpdate = (genre) => {
    navigate(`/admin/update-category/${genre.genreId}`);
  };

  const showDeleteConfirm = (genreId) => {
    confirm({
      title: "Are you sure you want to delete this author?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(genreId);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const addNew = () => {
    navigate("/admin/add-category");
  }
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb items={[{ title: "Admin" }, { title: "បន្ថែមប្រភេទសៀវភៅ" }]} />
        <Button type="primary" icon={<PlusOutlined />} onClick={addNew}>
          បន្ថែមប្រភេទសៀវភៅ
        </Button>
      </div>
      <Table
        columns={columns(showDeleteConfirm, handleUpdate)}
        dataSource={data}
        rowKey={(record) => record.bookId}
        loading={loading}
        pagination={{
          current: data.currentPage,
          total: data.totalItems,
          pageSize: data.pageSize,
          onChange: (page, pageSize) => {
            setLoading(true);
            fetchData(page, pageSize);
          },
        }}
      />
    </>
  );
};

export default CategoriesComponent;
