import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookList from "./component/CardComponent";
import { Carousel, message } from "antd";
import BookService from "../../redux/service/BookService";
import { useDispatch, useSelector } from "react-redux";
import { setAllBook } from "../../redux/slices/BookSlice";
import baseURL, { baseURLString } from "../../redux/service/url";
import ImageService from "../../redux/service/ImageService";
import MenuComponent from "../MenuComponent";
import SiderBar from "./component/SideBar";
import { DoubleRightOutlined } from "@ant-design/icons";

const GenreBookComponent = () => {
  const { genreName } = useParams(); // Get genreName from the URL
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [books, setBooks] = useState([]); // State for books
  const dispatch = useDispatch();

  // Fetch slideshow images
  const fetchSlideshow = async () => {
    try {
      const response = await ImageService.getImageByType("Slideshow");
      const images = response.map((slide) => ({
        id: slide.id,
        src: `${baseURLString}/uploads/images/${slide.fileName}`,
        alt: `Slideshow Image ${slide.id}`,
      }));
      setSlideshowImages(images);
    } catch (error) {
      console.error("Error fetching slideshow:", error);
      message.error("Failed to load slideshow images.");
    }
  };

  // Fetch books by genre
  const fetchBooksByGenre = async () => {
    try {
      const result = await BookService.getBooksByGenre(genreName, 1, 10, "bookId", "EBOOK");
      console.log(result.data.pdfBook);
      
      const transformedBooks = result.data.map((book) => ({
        title: book.title,
        author: book.authorDtos
          ? book.authorDtos.map((author) => `${author.firstName} ${author.lastName}`).join(", ")
          : "Unknown Author",
        category: genreName,
        coverUrl: book.cover
          ? `${baseURL.defaults.baseURL}/uploads/images/${book.cover}`
          : "/assets/images/image.png",
        description: book.description,
        pdfBook: book.pdfBook,
      }));
      setBooks(transformedBooks);
    } catch (error) {
      console.error("Error fetching books by genre:", error);
      message.error("Failed to load books for this genre.");
    }
  };

  useEffect(() => {
    fetchSlideshow();
  }, []);

  useEffect(() => {
    fetchBooksByGenre();
  }, [genreName]); // Refetch books when genreName changes

  return (
    <main className="mx-auto max-w-7xl">
      <section
        className="mx-auto max-w-7xl p-4 flex flex-row justify-between items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/banner.png')",
          height: "350px",
        }}
      ></section>
      <MenuComponent />
      <div className="grid mt-14 md:mt-0 grid-cols-6 gap-4">
        <div className="col-span-6 pb-2 md:col-span-1">
          <SiderBar />
        </div>
        <div className="col-span-6 md:col-span-5">
          <div>
            <p className="md:mt-5 px-3 text-lg hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 text-[12px] hover:text-blue-600">
              សៀវភៅពេញនិយម
            </p>
          </div>
          <hr />
          <BookList books={books} />
          <div className="flex justify-end">
            <button className="ml-10 px-3 border border-primary-color hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 text-[12px] lg:text-sm hover:text-blue-600">
              សៀវភៅទាំងអស់ <DoubleRightOutlined />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6">
          <div>
            <p className="mt-5 text-lg px-3 hover:bg-primary-color/5 hover:text-primary-color/90 dark:border-white text-primary-color dark:text-white rounded-[4px] py-2 hover:text-blue-600">
              សកម្មភាពថ្មីៗ
            </p>
          </div>
          <hr className="mt-2" />
          <div>
            <Carousel autoplay>
              {slideshowImages.map((image) => (
                <div key={image.id}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="flex justify-end"></div>
        </div>
      </div>
    </main>
  );
};

export default GenreBookComponent;