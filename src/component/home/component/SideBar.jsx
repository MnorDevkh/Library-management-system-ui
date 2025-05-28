import { BookOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GenreService from "../../../redux/service/GenreService";

const SiderBar = () => {
  const [genres, setGenres] = useState([]); // State to store genres
  const isDarkMode = document.documentElement.classList.contains("dark"); // Determine dark mode

  // Fetch genres from the API
  const fetchGenres = async () => {
    try {
      const response = await GenreService.getAllGenres(1, 100, "genreId");
      setGenres(response.data); // Set genres from API response
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <>
    <div className="flex justify-between items-center p-2 bg-gray-200 dark:bg-gray-800 rounded-t-lg">
    ប្រភេទសៀវភៅ
    </div>
    <div className="m-2 flex md:block md:overflow-auto overflow-scroll rounded-r-lg text-sm justify-start dark:text-white whitespace-nowrap">
      {genres.map((genre) => (
        <li key={genre.genreId} className="p-2 flex justify-start items-center">
          <Link to={`/genre/${genre.genreName}`}>
            <button className="text-black dark:text-white flex items-center gap-2">
              <BookOutlined
                style={{
                  color: isDarkMode ? "#FFFFFF" : "#292D77",
                  fontSize: "20px",
                }}
              />
              {genre.genreNameKh || genre.genreName}
            </button>
          </Link>
        </li>
      ))}
    </div>
    </>
  );
};

export default SiderBar;