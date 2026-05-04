import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to a default page based on role if they try to access an unauthorized route
        return <Navigate to={user.role === "admin" ? "/admin/students" : "/student/courses"} replace />;
    }

    return children;
}

export default ProtectedRoute;
