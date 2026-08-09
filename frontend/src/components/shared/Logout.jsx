import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

import { logoutUser } from "../../api/auth.api";
import { logout } from "../../redux/slices/authSlice";

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();

            dispatch(logout());

            navigate("/auth", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="
                w-full
                flex items-center gap-3
                px-4 py-2
                text-sm
                text-red-400
                hover:bg-red-500/10
                hover:text-red-300
                transition
                duration-200
                text-left
                shadow-2xl
                shadow-black
            "
        >
            <IoLogOutOutline className="text-xl" />

            <span>
                Logout
            </span>
        </button>
    );
}

export default Logout;