// import { Button } from "antd";
import { Carousel, message } from "antd";
import MenuComponent from "../MenuComponent.jsx";
import SiderBar from "./component/SideBar.jsx";
import BookList from "./component/CardComponent.jsx";
import { DoubleRightOutlined } from "@ant-design/icons";
import baseURL, { baseURLString } from "../../redux/service/url.js";
import { useEffect, useState } from "react";
import ImageService from "../../redux/service/ImageService.js";
import { setAllBook } from "../../redux/slices/BookSlice.js";
import BookService from "../../redux/service/BookService.js";
import { useDispatch, useSelector } from "react-redux";

const HomeComponent = () => {
  const [slideshowImages, setSlideshowImages] = useState([]); // State for slideshow images
  const dispatch = useDispatch();
  
  const data = useSelector((state) => state.book.allBook);

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
  useEffect(() => {
    fetchSlideshow();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await BookService.getAllBook(1, 9, "bookId");
        dispatch(setAllBook(result));
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const books =data?.data?.map((book) => ({
      title: book.title,
      author: book.authorDtos
        .map((author) => `${author.firstName} ${author.lastName}`)
        .join(", "),
      category: book.genreDTO?.genreName || "Uncategorized",
      coverUrl: book.cover
        ? `${baseURL.defaults.baseURL}/uploads/images/${book.cover}`
        : "/src/assets/images/image.png",
      description: book.description,
      pdfBook: book.pdfBook,
    })) || [];

  return (
    <main className="mx-auto max-w-7xl">
      <section
        className="mx-auto max-w-7xl p-4 flex flex-row justify-between items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('./src/assets/banner.png')",
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
          <BookList books={books}/>
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
            {/* slideshow */}
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

export default HomeComponent;
