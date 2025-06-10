import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const user_role = localStorage.getItem('user_role'); // Assuming you have a role attribute in your token or stored in localStorage

  if (token && user_role) {
    return <Outlet />;
  } else {
    // Redirect to the sign-in page if the user is not logged in
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;