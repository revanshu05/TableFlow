import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ allowedRoles }) {
    const {
        isAuthenticated,
        loading,
        user
    } = useSelector((state) => state.auth);

    console.log("Protected Route:", isAuthenticated, loading);

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    if(!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if(
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ){
        if(user?.role === "admin") return <Navigate to="/" replace />;

        if(user?.role === "waiter") return <Navigate to="/orders" replace />;

        if(user?.role === "cashier") return <Navigate to="/billing" replace />;

        if(user?.role === "kitchen") return <Navigate to="/kitchen" replace />;

        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;