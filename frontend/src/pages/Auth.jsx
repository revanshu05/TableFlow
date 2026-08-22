import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import logo from "../images/Dark_LOGO.png";

import { loginUser } from "../api/auth.api";
import { setCredentials } from "../redux/slices/authSlice";

function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await loginUser({
                email,
                password,
            });

            const user = response.data.data;
            const role = user.user.role;

            console.log("logged in user: ", user);
            console.log("User role: ", role);

            dispatch(setCredentials(user));

            switch (role) {

                case "admin":
                    navigate("/");
                    break;

                case "waiter":
                    navigate("/orders");
                    break;

                case "cashier":
                    navigate("/billing");
                    break;

                case "kitchen":
                    navigate("/kitchen");
                    break;

                default:
                    navigate("/");
            }

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to login. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#171719] text-white flex">

            {/* Left Section */}
            <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden bg-[#111113]">

                {/* Background glow */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col justify-between w-full p-14">

                    {/* Logo */}
                    <div className="flex items-center">
                        <img src={logo} alt="Logo" className="h-20"
                            onClick={() => navigate("/")}/>
                    </div>

                    {/* Main message */}
                    <div className="max-w-lg">

                        <p className="text-orange-400 font-semibold mb-4 text-xl">
                            RESTAURANT POS SYSTEM
                        </p>

                        <h2 className="text-5xl font-bold leading-tight">
                            Restaurant operations,
                            <span className="text-orange-400">
                                {" "}simplified.
                            </span>
                        </h2>

                        <p className="mt-6 text-lg text-gray-400 leading-relaxed">
                            Manage tables, orders, kitchen flow, billing,
                            and payments from one unified platform.
                        </p>

                        <div className="mt-10 space-y-5">

                            <Feature text="Real-time kitchen order management" />
                            <Feature text="Role-based access for your team" />
                            <Feature text="Seamless order and billing workflow" />
                            <Feature text="Analytics for restaurant operations" />

                        </div>

                    </div>

                    {/* Footer */}
                    <p className="text-sm text-gray-600">
                        © 2026 TableFlow
                    </p>

                </div>
            </div>


            {/* Right Section */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">

                <div className="w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-9">

                        <p className="text-xl text-orange-400 font-medium mb-3">
                            Welcome back
                        </p>

                        <h2 className="text-3xl font-bold">
                            Sign in to TableFlow
                        </h2>

                        <p className="text-gray-400 mt-3">
                            Access your restaurant workspace.
                        </p>

                    </div>


                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@tableflow.com"
                                autoComplete="email"
                                className="
                                    w-full
                                    bg-[#222225]
                                    border border-[#36363b]
                                    rounded-xl
                                    px-4 py-2.5
                                    text-white
                                    placeholder:text-gray-600
                                    outline-none
                                    transition
                                    focus:border-orange-500
                                    focus:ring-1
                                    focus:ring-orange-500
                                "
                            />

                        </div>


                        {/* Password */}
                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="
                                        w-full
                                        bg-[#222225]
                                        border border-[#36363b]
                                        rounded-xl
                                        px-4 py-2.5 pr-12
                                        text-white
                                        placeholder:text-gray-600
                                        outline-none
                                        transition
                                        focus:border-orange-500
                                        focus:ring-1
                                        focus:ring-orange-500
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-500
                                        hover:text-white
                                    "
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Error */}
                        {error && (
                            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}


                        {/* Login Button*/}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                mt-4
                                w-full
                                bg-orange-400
                                hover:bg-orange-500
                                disabled:bg-orange-500/50
                                disabled:cursor-not-allowed
                                text-black
                                text-lg
                                font-bold
                                py-2.5
                                rounded-xl
                                transition
                            "
                        >
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>

                    </form>


                    {/* Bottom information */}
                    <div className="mt-8 flex items-center gap-3 text-gray-600 text-sm">
                        <div className="h-px bg-[#303035] flex-1" />
                        <span>Secure restaurant workspace</span>
                        <div className="h-px bg-[#303035] flex-1" />
                    </div>

                </div>

            </div>

        </div>
    );
}


function Feature({ text }) {
    return (
        <div className="flex items-center gap-3 text-gray-300">
            <span className="w-6 h-6 rounded-full border border-green-500 text-green-500 flex items-center justify-center text-sm">
                ✓
            </span>
            <span>{text}</span>

        </div>
    );
}


export default Auth;