import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../socket";

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
    const [pagination, setPagination] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filter, setFilter] = useState(null);
    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);

    const limit = 15;

    const [showCreateModal, setShowCreateModal] = useState(false);


    // SET DEFAULT FILTER

    useEffect(() => {

        if (!user) return;

        if (user.role === "admin") {
            setFilter("ALL");
        }
        else if (user.role === "waiter") {
            setFilter("OPEN");
        }

    }, [user]);


    // FETCH ORDERS

    useEffect(() => {

        if (!filter) return;


        const fetchOrders = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getOrders({
                    status: filter,
                    sort,
                    page,
                    limit
                });

                const data = response.data.data;

                setOrders(data.orders || []);
                setPagination(data.pagination || null);

            }
            catch (error) {

                console.error(
                    "Failed to fetch orders:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );

            }
            finally {

                setLoading(false);

            }

        };


        fetchOrders();

    }, [filter, sort, page]);


    useEffect(() => {

        const handleOrderCreated = (newOrder) => {
            setOrders((prev) => {
                const exists = prev.some((o) => o._id === newOrder._id);

                if(exists) return prev;
                return [newOrder, ...prev];
            });
        };
        
        const handleOrderUpdate = (updatedOrder) => {
            setOrders((prev) =>
                prev.map((o) =>
                    o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o
                )
            );
        };

        socket.on("order:created", handleOrderCreated);
        socket.on("order:billRequested", handleOrderUpdate);
        socket.on("order:completed", handleOrderUpdate);

        return () => {
            socket.off("order:created", handleOrderCreated);
            socket.off("order:billRequested", handleOrderUpdate);
            socket.off("order:completed", handleOrderUpdate);
        };
    }, []);


    // HANDLERS

    const handleOrderClick = (orderId) => {
        navigate(`/orders/${orderId}`);
    };


    const handleFilterChange = (newFilter) => {

        setFilter(newFilter);
        setPage(1);

    };


    const handleSortChange = (newSort) => {

        setSort(newSort);
        setPage(1);

    };


    const handlePreviousPage = () => {

        if(pagination?.hasPreviousPage){
            setPage((prev) => prev - 1);
        }

    };


    const handleNextPage = () => {

        if(pagination?.hasNextPage){
            setPage((prev) => prev + 1);
        }

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


                {/* RIGHT - SORT + STATUS FILTERS */}

                <div className="flex items-center gap-3">


                    {/* SORT SELECTOR */}

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

                        {/* NEWEST */}

                        <button
                            onClick={() =>
                                handleSortChange("newest")
                            }
                            className={`
                                rounded-lg
                                px-3
                                py-2
                                text-xs
                                transition-all
                                duration-200

                                ${
                                    sort === "newest"
                                        ? "bg-zinc-700 text-white"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                }
                            `}
                        >
                            Newest
                        </button>


                        {/* OLDEST */}

                        <button
                            onClick={() =>
                                handleSortChange("oldest")
                            }
                            className={`
                                rounded-lg
                                px-3
                                py-2
                                text-xs
                                transition-all
                                duration-200

                                ${
                                    sort === "oldest"
                                        ? "bg-zinc-700 text-white"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                }
                            `}
                        >
                            Oldest
                        </button>

                    </div>


                    {/* STATUS FILTERS */}

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
                            onClick={() =>
                                handleFilterChange("ALL")
                            }
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
                            onClick={() =>
                                handleFilterChange("OPEN")
                            }
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
                            <LuClock3 size={14} />
                            Open
                        </button>


                        {/* PAYMENT PENDING */}

                        <button
                            onClick={() =>
                                handleFilterChange(
                                    "PAYMENT_PENDING"
                                )
                            }
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
                            <MdOutlinePayment size={14} />
                            Payment Pending
                        </button>


                        {/* COMPLETED */}

                        <button
                            onClick={() =>
                                handleFilterChange("COMPLETED")
                            }
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
                            <FiCheckCircle size={14} />
                            Completed
                        </button>

                    </div>

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

                {/* LOADING SKELETON */}

                {loading && (
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            pb-6
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-zinc-900
                                    border
                                    border-zinc-800
                                    p-3.5
                                    animate-pulse
                                "
                            >
                                {/* Top: Customer Avatar + Order# & Status Badge */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-lg bg-zinc-800 shrink-0" />
                                        <div className="space-y-1.5">
                                            {/* Order # */}
                                            <div className="h-4.5 w-24 rounded bg-zinc-700/70" />
                                            {/* Customer Name */}
                                            <div className="h-3 w-16 rounded bg-zinc-800" />
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="h-6 w-24 rounded-full bg-zinc-800" />
                                </div>

                                {/* Middle: 2x2 Information Grid */}
                                <div className="grid grid-cols-2 gap-y-3 mt-4">
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-10 rounded bg-zinc-800/80" />
                                        <div className="h-4 w-20 rounded bg-zinc-700/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-14 rounded bg-zinc-800/80" />
                                        <div className="h-4 w-10 rounded bg-zinc-700/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-10 rounded bg-zinc-800/80" />
                                        <div className="h-4 w-10 rounded bg-zinc-700/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-10 rounded bg-zinc-800/80" />
                                        <div className="h-4 w-10 rounded bg-zinc-700/50" />
                                    </div>
                                </div>

                                {/* Bottom: Date and Order Total */}
                                <div className="flex justify-between items-end mt-4 pt-3 border-t border-zinc-800">
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-12 rounded bg-zinc-800/80" />
                                        <div className="h-3.5 w-32 rounded bg-zinc-800" />
                                    </div>
                                    <div className="space-y-1.5 flex flex-col items-end">
                                        <div className="h-3 w-16 rounded bg-zinc-800/80" />
                                        <div className="h-6 w-20 rounded bg-zinc-700/70" />
                                    </div>
                                </div>
                            </div>
                        ))}
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
                    orders.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                pb-6
                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {orders.map((order) => (

                                <div
                                    key={order._id}
                                    onClick={() =>
                                        handleOrderClick(
                                            order._id
                                        )
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
                    orders.length === 0 && (

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


                {/* PAGINATION */}

                {!loading &&
                    !error &&
                    pagination &&
                    pagination.totalPages > 0 && (

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-t
                                border-zinc-700
                                px-2
                                py-4
                            "
                        >

                            {/* PAGE INFORMATION */}

                            <p
                                className="
                                    text-xs
                                    text-zinc-500
                                "
                            >
                                Page{" "}
                                <span className="text-zinc-300">
                                    {pagination.page}
                                </span>{" "}
                                of{" "}
                                <span className="text-zinc-300">
                                    {pagination.totalPages}
                                </span>
                            </p>


                            {/* PAGINATION CONTROLS */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                {/* PREVIOUS */}

                                <button
                                    disabled={!pagination.hasPreviousPage}
                                    onClick={handlePreviousPage}
                                    className="
                                        rounded-lg
                                        border
                                        border-zinc-700
                                        bg-zinc-900
                                        px-3
                                        py-2
                                        text-xs
                                        text-zinc-300
                                        transition
                                        hover:bg-zinc-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Previous
                                </button>


                                {/* CURRENT PAGE */}

                                <span
                                    className="
                                        rounded-lg
                                        bg-zinc-700
                                        px-3
                                        py-2
                                        text-xs
                                        text-white
                                    "
                                >
                                    {pagination.page}
                                </span>


                                {/* NEXT */}

                                <button
                                    disabled={!pagination.hasNextPage}
                                    onClick={handleNextPage}
                                    className="
                                        rounded-lg
                                        border
                                        border-zinc-700
                                        bg-zinc-900
                                        px-3
                                        py-2
                                        text-xs
                                        text-zinc-300
                                        transition
                                        hover:bg-zinc-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    )}

            </div>


            {/* FLOATING CREATE ORDER BUTTON */}

            {["admin", "waiter"].includes(user?.role) && (

                <button
                    onClick={() =>
                        setShowCreateModal(true)
                    }
                    className="
                        fixed
                        bottom-20
                        right-10
                        z-40
                        flex
                        h-18
                        w-18
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
                    <FiPlus size={40} />
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