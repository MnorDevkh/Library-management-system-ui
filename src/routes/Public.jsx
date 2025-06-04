import { Route, Routes } from "react-router-dom";
import SignIn from "../component/auth/SigninComponent.jsx";
import SignUp from "../component/auth/SignupComponent.jsx";
import AddressComponent from "../component/common/AddressComponent.jsx";
import LayoutComponent from "../layout/index.jsx";
import NotFound from "../component/NotFoundComponent.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import BookComponent from "../component/admin/BookComponent.jsx";
import AddBookComponent from "../component/admin/AddBookComponent.jsx";
import AuthorComponent from "../component/admin/AuthorComponent.jsx";
import HomeComponent from "../component/home/HomeComponent.jsx";
import AboutComponent from "../component/about/AboutComponent.jsx";
import AddAuthorComponent from "../component/admin/AddAuthorComponent.jsx";
import App from "../component/App.jsx";
import UpdateAuthorComponent from "../component/admin/UpdateAuthorComponent.jsx";
import UpdateBookComponent from "../component/admin/UpdateBookComponent.jsx";
import ReadPDFBookComponent from "../component/home/ReadPDFBookComponent.jsx";
import RuleComponent from "../component/home/RuleComponent.jsx";
import StaffComponent from "../component/home/StaffComponent.jsx";
import StaffController from "../component/admin/StaffController.jsx";
import ContactComponent from "../component/home/ContactComponent.jsx";
import AdminLayoutComponent from "../layout/AdminLayoutComponent.jsx";
import CategoriesComponent from "../component/admin/CategoriesComponent.jsx";
import UpdateStaffComponent from "../component/admin/UpdateStaffComponent.jsx";
import AddStaffComponent from "../component/admin/AddStaffComponent.jsx";
import SlideShowAdminComponent from "../component/admin/SlideShowAdminComponent.jsx";
import GeneralBook from "../component/home/GeneralBook.jsx";
import GeneralBookEnglish from "../component/home/GeneralBookEnglish.jsx";
import GenreBookComponent from "../component/home/GenreBookComponent.jsx";
import GalleryAdminComponent from "../component/admin/GalleryAdminComponent.jsx";
import AddCategoryComponent from "../component/admin/AddCategoryComponent.jsx";
import UpdateCategoryComponent from "../component/admin/UpdateCategoryComponent.jsx";
import GetContact from "../component/admin/GetContect.jsx";
import AddShelfComponent from "../component/admin/AddShelfComponent.jsx";
import ListShelfComponent from "../component/admin/ListShelfComponent.jsx";
import ListPublisherComponent from "../component/admin/ListPublisherComponent.jsx";
import AddPublisherComponent from "../component/admin/AddPublisherComponent.jsx";
import UpdatePublisherComponent from "../component/admin/UpdatePublisherComponent.jsx";
import UpdateShelfComponent from "../component/admin/UpdateShiftComponent.jsx";
import ImageGalleryComponent from "../component/home/ImageGalleryComponent.jsx";

const RouterComponentPublic = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/address" element={<AddressComponent />} />
      <Route path="*" element={<NotFound URL="/" />} />
      <Route element={<LayoutComponent />}>
        <Route index path="/" element={<HomeComponent />} />
        <Route path="/general" element={<GeneralBook />} />
        <Route path="/general-english" element={<GeneralBookEnglish />} />
        <Route path="/about" element={<AboutComponent />} />
        <Route path="/rules" element={<RuleComponent />} />
        <Route path="/staff" element={<StaffComponent />} />
        <Route path="/read" element={<ReadPDFBookComponent />} />
        <Route path="/rule" element={<RuleComponent />} />
        <Route path="/gallery" element={<ImageGalleryComponent />} />
        <Route path="/contact" element={<ContactComponent />} />
        <Route path="/app" element={<App />} />
        {/* Dynamic Route for Genres */}
        <Route path="/genre/:genreName" element={<GenreBookComponent />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute
            isLogged={!!localStorage.getItem("token")}
            isAdmin={!!localStorage.getItem("STAFF")}
          />
        }
      >
        <Route path="/admin" element={<AdminLayoutComponent />}>
          <Route path="book" element={<BookComponent />} />
          <Route path="add-book" element={<AddBookComponent />} />
          <Route path="author" element={<AuthorComponent />} />
          <Route path="add-author" element={<AddAuthorComponent />} />
          <Route path="categorise" element={<CategoriesComponent />} />
          <Route path="add-Category" element={<AddCategoryComponent />} />
          <Route
            path="update-category/:categoryId"
            element={<UpdateCategoryComponent />}
          />
          <Route
            path="update-author/:authorId"
            element={<UpdateAuthorComponent />}
          />
          <Route path="update-book/:bookId" element={<UpdateBookComponent />} />
          <Route path="update-book/:bookId" element={<UpdateBookComponent />} />
          <Route path="staff" element={<StaffController />} />
          <Route path="add-staff" element={<AddStaffComponent />} />
          <Route
            path="edit-staff/:staffId"
            element={<UpdateStaffComponent />}
          />
          <Route path="slide" element={<SlideShowAdminComponent />} />
          <Route path="contact" element={<GetContact />} />
          <Route path="gallery" element={<GalleryAdminComponent />} />
          {/*  shelf */}
          <Route path="shelf" element={<ListShelfComponent />} />
          <Route path="add-shelf" element={<AddShelfComponent />} />
          <Route
            path="update-shelf/:id"
            element={<UpdateShelfComponent />}
          />

          {/*  publisher */}
          <Route path="publisher" element={<ListPublisherComponent />} />
          <Route path="add-publisher" element={<AddPublisherComponent />} />
          <Route
            path="update-publisher/:id"
            element={<UpdatePublisherComponent />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default RouterComponentPublic;
