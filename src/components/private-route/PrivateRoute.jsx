import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

const PrivateRoute = ({ role }) => {
  const { authenticated, user } = useContext(AuthContext);

  let allowed = authenticated;
  allowed = role ? user.role === role && authenticated : allowed;

  return allowed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
