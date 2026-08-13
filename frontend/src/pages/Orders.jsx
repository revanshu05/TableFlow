import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { FiPlus } from "react-icons/fi";
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

    const [filter, setFilter] = useState("ALL");
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

    const filteredOrders = roleFilteredOrders.filter((order) => {

        if (filter === "ALL") {
            return true;
        }

        return order.status === filter;

    });


    const handleOrderClick = (orderId) => {

        navigate(`/orders/${orderId}`);

    };

    const handleCreateOrderClose = () => {

        setShowCreateModal(false);

    };


    return (

        <section className="
            bg-zinc-800
            h-[calc(100vh-3.5rem)]
            overflow-hidden
            flex
            flex-col
            items-center
            relative
        ">


            {/* Header */}

            <div className="
                w-[94%]
                flex
                items-center
                justify-end
                mt-5
            ">

                <div className="flex items-center gap-4">

                    {/* Status filters */}

                    <div className="
                        flex
                        items-center
                        bg-zinc-900
                        border
                        border-zinc-700
                        rounded-xl
                        p-1
                        gap-1
                    ">

                        <button
                            onClick={() => setFilter("ALL")}
                            className={`
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                transition-all
                                duration-200
                                ${
                                    filter === "ALL"
                                        ? "bg-zinc-700 text-white"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                }
                            `}
                        >
                            All
                        </button>


                        <button
                            onClick={() => setFilter("OPEN")}
                            className={`
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                transition-all
                                duration-200
                                ${
                                    filter === "OPEN"
                                        ? "bg-orange-500/20 text-orange-400"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                }
                            `}
                        >
                            Open
                        </button>


                        <button
                            onClick={() => setFilter("PAYMENT_PENDING")}
                            className={`
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                transition-all
                                duration-200
                                ${
                                    filter === "PAYMENT_PENDING"
                                        ? "bg-blue-500/15 text-blue-400"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                }
                            `}
                        >
                            Payment Pending
                        </button>


                        <button
                            onClick={() => setFilter("COMPLETED")}
                            className={`
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                transition-all
                                duration-200
                                ${
                                    filter === "COMPLETED"
                                        ? "bg-green-500/20 text-green-400"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                }
                            `}
                        >
                            Completed
                        </button>

                    </div>

                </div>

            </div>

            <div 
                className="
                border
                w-[94%]
                mt-5
                border-zinc-700"
            ></div>

            {/* ORDERS */}

            <div className="
                w-[97%]
                p-4
                mx-auto
                mt-1
                flex-1
                overflow-y-auto
            ">


                {/* Loading */}

                {loading && (

                    <div className="
                        flex
                        justify-center
                        items-center
                        h-40
                        text-zinc-400
                    ">
                        Loading orders...
                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div className="
                        flex
                        justify-center
                        items-center
                        h-40
                        text-red-400
                    ">
                        {error}
                    </div>

                )}


                {/* Orders */}

                {!loading && !error && filteredOrders.length > 0 && (

                    <div className="
                        grid
                        grid-cols-3
                        gap-5
                    ">

                        {filteredOrders.map((order) => (

                            <div
                                key={order._id}
                                onClick={() => handleOrderClick(order._id)}
                                className="cursor-pointer"
                            >

                                <OrderCard
                                    {...order}
                                />

                            </div>

                        ))}

                    </div>

                )}


                {/* Empty */}

                {!loading &&
                    !error &&
                    filteredOrders.length === 0 && (

                    <div className="
                        flex
                        flex-col
                        justify-center
                        items-center
                        h-60
                        text-zinc-500
                    ">

                        <p className="text-lg">
                            No orders found
                        </p>

                        <p className="text-sm mt-1">
                            {filter === "ALL"
                                ? "There are no orders available."
                                : `There are no ${filter.toLowerCase().replace("_", " ")} orders.`
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

                        w-16
                        h-16

                        flex
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