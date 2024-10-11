import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const RequiredAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth.access_token
            ? <Outlet />
            : <Navigate to="/user/login" state={{ from: location }} replace />
    )
}


export default RequiredAuth;