import { useCallback, useEffect, useState } from "react";
import { Breadcrumb, Button, message, Modal, Space, Table, Divider } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGenres } from "../../redux/slices/GenreSlice";
import GenreService from "../../redux/service/GenreService";
import baseURL from "../../redux/service/url";

const columns = (showDeleteConfirm, handleUpdate, handleView) => [
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
        <a className="text-blue-600" onClick={() => handleView(record)}>
          <EyeOutlined /> View
        </a>
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
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const data = useSelector((state) => state.genre.genres);
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
      fetchData();
    } catch (error) {
      console.error("Error deleting book:", error);
      message.error("Error deleting Category!");
    }
  };

  const handleUpdate = (genre) => {
    navigate(`/admin/update-category/${genre.genreId}`);
  };

  const handleView = (genre) => {
    setSelectedCategory(genre);
    setViewModalVisible(true);
  };

  const showDeleteConfirm = (genreId) => {
    confirm({
      title: "Are you sure you want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(genreId);
      },
      onCancel() {
        // Do nothing
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addNew = () => {
    navigate("/admin/add-category");
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb items={[{ title: "Admin" }, { title: "បន្ថែមប្រភេទសៀវភៅ" }]} />
        <Button type="primary" icon={<PlusOutlined />} onClick={addNew}>
          បន្ថែមប្រភេទសៀវភៅ
        </Button>
      </div>
      <Table
        columns={columns(showDeleteConfirm, handleUpdate, handleView)}
        dataSource={data}
        rowKey={(record) => record.genreId}
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

      {/* View Modal */}
      <Modal
        title="Category Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
        bodyStyle={{ maxHeight: 500, overflowY: "auto" }}
      >
        {selectedCategory && (
          <div>
            <p>
              <strong>Category Name:</strong> {selectedCategory.genreName}
            </p>
            <p>
              <strong>Category Name (Khmer):</strong> {selectedCategory.genreNameKh}
            </p>
            <p>
              {selectedCategory.image ? (
                <img
                  src={`${baseURL.defaults.baseURL}/uploads/images/${selectedCategory.image}`}
                  alt="Cover"
                  style={{ width: 100, height: 100, marginTop: 8 }}
                />
              ) : (
                "No Cover"
              )}
            </p>
            {selectedCategory.books && selectedCategory.books.length > 0 && (
              <>
                <Divider />
                <h3>Books</h3>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  <Table
                    dataSource={selectedCategory.books}
                    rowKey={(record) => record.bookId}
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "No",
                        dataIndex: "index",
                        key: "index",
                        render: (text, record, index) => index + 1,
                      },
                      {
                        title: "Title",
                        dataIndex: "title",
                        key: "title",
                      },
                      {
                        title: "Publisher",
                        dataIndex: "publisherName",
                        key: "publisherName",
                      },
                      {
                        title: "Author",
                        dataIndex: "authorName",
                        key: "authorName",
                      },
                    ]}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default CategoriesComponent;