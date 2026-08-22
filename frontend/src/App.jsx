import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ProtectedRoute from "./components/shared/ProtectedRoute";
import ProtectedLayout from "./components/shared/ProtectedLayout";

import {
    Home,
    Auth,
    Orders,
    Tables,
    Menu,
    Kitchen
} from "./pages";

import { getCurrentUser } from "./api/user.api";
import { setCredentials, logout } from "./redux/slices/authSlice";

import OrderDetails from "./pages/OrderDetails";
import Payment from "./pages/Payment";
import Team from "./pages/Team";
import Billing from "./pages/Billing";
import BillDetails from "./pages/BillDetails";
import Settings from "./pages/Settings";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getCurrentUser();

                console.log(
                    "Current user response: ",
                    response.data
                );

                dispatch(
                    setCredentials({
                        user: response.data.data
                    })
                );

            } catch (error) {
                console.log(
                    "CURRENT USER FULL ERROR:",
                    error
                );

                console.log(
                    "ERROR MESSAGE:",
                    error.message
                );

                console.log(
                    "ERROR RESPONSE:",
                    error.response
                );

                dispatch(logout());
            }
        };

        checkAuth();
    }, [dispatch]);


    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC ROUTES */}

                <Route
                    path="/auth"
                    element={<Auth />}
                />


                {/* AUTHENTICATED ROUTES */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<ProtectedLayout />}>


                        {/* ADMIN ONLY */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={["admin"]}
                                />
                            }
                        >

                            <Route
                                path="/"
                                element={<Home />}
                            />

                            <Route
                                path="/team"
                                element={<Team />}
                            />

                            <Route
                                path="/settings"
                                element={<Settings />}
                            />

                        </Route>


                        {/* ADMIN + WAITER */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={[
                                        "admin",
                                        "waiter"
                                    ]}
                                />
                            }
                        >

                            <Route
                                path="/orders"
                                element={<Orders />}
                            />

                            <Route
                                path="/tables"
                                element={<Tables />}
                            />

                            <Route
                                path="/menu"
                                element={<Menu />}
                            />

                            <Route
                                path="/orders/:orderId"
                                element={<OrderDetails />}
                            />

                        </Route>


                        {/* ADMIN + KITCHEN */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={[
                                        "admin",
                                        "kitchen"
                                    ]}
                                />
                            }
                        >

                            <Route
                                path="/kitchen"
                                element={<Kitchen />}
                            />

                        </Route>


                        {/* ADMIN + CASHIER */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={[
                                        "admin",
                                        "cashier"
                                    ]}
                                />
                            }
                        >

                            <Route
                                path="/orders/:orderId/payment"
                                element={<Payment />}
                            />

                            <Route
                                path="/billing"
                                element={<Billing />}
                            />

                            <Route
                                path="/billing/:orderId"
                                element={<BillDetails />}
                            />

                        </Route>


                    </Route>

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;