import { Image } from "antd";
import { ArrowDownOutlined, ReadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
export default function BookList({ books }) {
  BookList.propTypes = {
    books: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        author: PropTypes.string,
        category: PropTypes.string,
        coverUrl: PropTypes.string,
        description: PropTypes.string,
        pdfBook: PropTypes.string,
      })
    ).isRequired,
  };

  const navigate = useNavigate();
  const handleRead = (filename,title,description) => {
    navigate(`/read?filename=${encodeURIComponent(filename)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`);
  };

  console.log(books);
  
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-y-10 lg:gap-4 pl-10 pt-10">
      {books.map((book, index) => {
        const { title, author, category, coverUrl, description, pdfBook } = book;
        return (
          <div
            key={`${index}`}
            className="bg-primary-color/10 dark:bg-primary-color/5 rounded relative border-none hover:duration-150 hover:shadow-lg group"
          >
            <div className="grid grid-cols-7 gap-6 lg:gap-12 sm:px-4 lg:px-2">
              <div className="col-span-3 mt-3">
                <Image
                  src={coverUrl || "/placeholder.svg"}
                  alt={title || "Book cover"}
                  width={110}
                  height={160}
                  className="absolute top-[-20px] md:top-[-14px] lg:top-[-10px] rounded object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="-ml-6 col-span-4">
                <h3 className="text-lg line-clamp-2 font-semibold">
                  {title || "Untitled"}
                </h3>
                <p className="text-sm mt-1 font-semibold text-gray-600 dark:text-white">
                  Author: {author || "Unknown Author"}
                </p>
                <p className="mt-1 font-semibold text-sm text-gray-500 dark:text-white">
                  Category: {category || "Uncategorized"}
                </p>
                <p className="mt-1 font-semibold text-sm text-gray-500 dark:text-white">
                  description: {description || "Uncategorized"}
                </p>
                <div className="flex flex-row gap-2 mt-2">
                  <button
                    className="text-sm px-1 border border-primary-color hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 lg:text-sm hover:text-blue-600"
                    onClick={() => handleRead(pdfBook, title, description)}
                  >
                    អាន <ReadOutlined />
                  </button>
                  <button className="text-sm px-1 border border-primary-color hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 lg:text-sm hover:text-blue-600">
                    ទាញយក <ArrowDownOutlined />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
