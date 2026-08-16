import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { IoReceiptOutline } from "react-icons/io5";
import { FiPlus, FiCheckCircle } from "react-icons/fi";
import { LuClock3 } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";

import OrderCard from "../components/Orders/OrderCard";
import Modal from "../components/shared/Modal";
import CreateOrderForm from "../components/Orders/CreateOrderForm";

import { getOrders } from "../api/order.api";


function Orders() {

    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filter, setFilter] = useState("OPEN");
    const [showCreateModal, setShowCreateModal] = useState(false);


    useEffect(() => {

        const fetchOrders = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getOrders();

                console.log("Orders response:", response.data);

                setOrders(response.data.data || []);

            } catch (error) {

                console.error("Failed to fetch orders:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchOrders();

    }, []);


    /* =========================================
       ROLE BASED FILTERING
    ========================================= */

    const roleFilteredOrders = orders.filter((order) => {

        if (user?.role === "waiter") {

            return (
                order.status === "OPEN" ||
                order.status === "PAYMENT_PENDING"
            );

        }

        if (user?.role === "cashier") {

            return (
                order.status === "PAYMENT_PENDING" ||
                order.status === "COMPLETED"
            );

        }

        if (user?.role === "admin") {
            return true;
        }

        return false;

    });


    /* =========================================
       STATUS FILTER
    ========================================= */

    const filteredOrders = roleFilteredOrders.filter((order) => {

        if (filter === "ALL") {
            return true;
        }

        return order.status === filter;

    });


    /* =========================================
       HANDLERS
    ========================================= */

    const handleOrderClick = (orderId) => {

        navigate(`/orders/${orderId}`);

    };


    const handleCreateOrderClose = () => {

        setShowCreateModal(false);

    };


    return (

        <section
            className="
                flex
                h-[calc(100vh-3.5rem)]
                flex-col
                overflow-hidden
                bg-zinc-800
            "
        >

            {/* PAGE HEADER */}

            <div
                className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    px-6
                    py-3
                "
            >

                {/* LEFT - PAGE TITLE */}

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-orange-500/10
                        "
                    >

                        <IoReceiptOutline
                            size={20}
                            className="text-orange-400"
                        />

                    </div>


                    <h1
                        className="
                            text-xl
                            font-semibold
                            text-white
                        "
                    >
                        Orders
                    </h1>

                </div>


                {/* RIGHT - STATUS FILTERS */}

                <div
                    className="
                        flex
                        items-center
                        gap-1
                        rounded-xl
                        border
                        border-zinc-700
                        bg-zinc-900
                        p-1
                    "
                >

                    {/* ALL */}

                    <button
                        onClick={() => setFilter("ALL")}
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            transition-all
                            duration-200

                            ${
                                filter === "ALL"
                                    ? "bg-zinc-700 text-white"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >
                        All
                    </button>


                    {/* OPEN */}

                    <button
                        onClick={() => setFilter("OPEN")}
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            transition-all
                            duration-200

                            ${
                                filter === "OPEN"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >
                        <LuClock3 size={14}/>
                        Open
                    </button>


                    {/* PAYMENT PENDING */}

                    <button
                        onClick={() => setFilter("PAYMENT_PENDING")}
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            transition-all
                            duration-200

                            ${
                                filter === "PAYMENT_PENDING"
                                    ? "bg-blue-500/15 text-blue-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >
                        <MdOutlinePayment size={14}/>
                        Payment Pending
                    </button>


                    {/* COMPLETED */}

                    <button
                        onClick={() => setFilter("COMPLETED")}
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            transition-all
                            duration-200

                            ${
                                filter === "COMPLETED"
                                    ? "bg-green-500/20 text-green-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >
                        <FiCheckCircle size={14}/>
                        Completed
                    </button>

                </div>

            </div>


            {/* HEADER DIVIDER */}

            <div
                className="
                    mx-6
                    shrink-0
                    border-b
                    border-zinc-700
                "
            />


            {/* ORDERS CONTENT */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-6
                    py-4
                "
            >

                {/* LOADING */}

                {loading && (

                    <div
                        className="
                            flex
                            h-40
                            items-center
                            justify-center
                            text-sm
                            text-zinc-400
                        "
                    >
                        Loading orders...
                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div
                        className="
                            flex
                            h-40
                            items-center
                            justify-center
                            text-sm
                            text-red-400
                        "
                    >
                        {error}
                    </div>

                )}


                {/* ORDERS */}

                {!loading &&
                    !error &&
                    filteredOrders.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                pb-20
                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {filteredOrders.map((order) => (

                                <div
                                    key={order._id}
                                    onClick={() =>
                                        handleOrderClick(order._id)
                                    }
                                    className="cursor-pointer"
                                >

                                    <OrderCard
                                        {...order}
                                    />

                                </div>

                            ))}

                        </div>

                    )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    filteredOrders.length === 0 && (

                        <div
                            className="
                                flex
                                h-60
                                flex-col
                                items-center
                                justify-center
                                text-zinc-500
                            "
                        >

                            <p className="text-lg">
                                No orders found
                            </p>

                            <p className="mt-1 text-sm">

                                {filter === "ALL"
                                    ? "There are no orders available."
                                    : `There are no ${filter
                                        .toLowerCase()
                                        .replace("_", " ")} orders.`
                                }

                            </p>

                        </div>

                    )}

            </div>


            {/* FLOATING CREATE ORDER BUTTON */}

            {["admin", "waiter"].includes(user?.role) && (

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="
                        fixed
                        bottom-6
                        right-14
                        z-40

                        flex
                        h-16
                        w-16
                        items-center
                        justify-center

                        rounded-full

                        bg-orange-500
                        text-white

                        shadow-lg
                        shadow-orange-500/30

                        transition-all
                        duration-300
                        ease-out

                        hover:scale-110
                        hover:bg-orange-600

                        active:scale-95
                    "
                    title="Create Order"
                >

                    <FiPlus size={28} />

                </button>

            )}


            {/* CREATE ORDER MODAL */}

            <Modal
                title="Create New Order"
                isOpen={showCreateModal}
                onClose={handleCreateOrderClose}
                size="3xl"
            >

                <CreateOrderForm
                    onClose={handleCreateOrderClose}
                />

            </Modal>

        </section>

    );

}


export default Orders;