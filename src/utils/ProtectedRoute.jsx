import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role = null }) => {
  const user = useSelector((state) => state.auth.user);

  let isAuthorized = false;

  switch (role) {
    case "admin":
      isAuthorized = user?.is_superuser;
      break;
    case "procurement_officer":
    case "vendor":
      isAuthorized = user.user_role === role;
      break;
    default:
      isAuthorized = user !== null;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/accounts/login/" />;
};

export default ProtectedRoute;
