import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ProtectedRoute from "./components/shared/ProtectedRoute";
import ProtectedLayout from "./components/shared/ProtectedLayout";
import {Home, Auth, Orders, Tables, Menu, Kitchen} from "./pages";
import Header from "./components/shared/Header";
import Logout from "./components/shared/Logout";

import { getCurrentUser } from "./api/user.api";
import { setCredentials, logout } from "./redux/slices/authSlice";
import OrderDetails from "./pages/OrderDetails";
import Payment from "./pages/Payment";
import Team from "./pages/Team";
import Billing from "./pages/Billing";
import BillDetails from "./pages/BillDetails";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await getCurrentUser();
				console.log("Current user response: ", response.data);
				dispatch(setCredentials({
					user: response.data.data
				}));
			} catch (error) {
				console.log("CURRENT USER FULL ERROR:", error);
				console.log("ERROR MESSAGE:", error.message);
				console.log("ERROR RESPONSE:", error.response);
				dispatch(logout());
			}
		};

		checkAuth();
	}, [dispatch]);


return (
	<>
	<BrowserRouter>
		<Routes>
			<Route path="/auth" element={<Auth />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<ProtectedLayout />}>

					<Route path="/" element={<Home />} />
					<Route path="/orders" element={<Orders />} />
					<Route path="/tables" element={<Tables />} />
					<Route path="/menu" element={<Menu />} />
					<Route path="/kitchen" element={<Kitchen/>} />
					<Route path="/orders/:orderId" element={<OrderDetails/>} />
					<Route path="/orders/:orderId/payment" element={<Payment />} />
					<Route path="/team" element={<Team />} />
					<Route path="/billing" element={<Billing />} />
					<Route path="/billing/:orderId" element={<BillDetails />} />

				</Route>
			</Route>

		</Routes>
	</BrowserRouter>
	</>

)}

export default App
