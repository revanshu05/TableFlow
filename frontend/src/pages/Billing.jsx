import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

import {
    FiFileText,
    FiClock,
    FiCheckCircle,
} from "react-icons/fi";

import BillCard from "../components/Billing/BillCard";
import { getOrders } from "../api/order.api";


function Billing() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filter, setFilter] = useState("PAYMENT_PENDING");


    // FETCH ORDERS

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getOrders();

            const data = response.data.data.orders || [];

            // Billing only works with these two states
            const billingOrders = data.filter(
                (order) =>
                    order.status === "PAYMENT_PENDING" ||
                    order.status === "COMPLETED"
            );

            setOrders(billingOrders);

        } catch (error) {

            console.error(
                "Failed to fetch billing orders:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load billing orders"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchOrders();

        const handleBillRequested = (newOrder) => {
            setOrders((prev) => {
                const exists = prev.some((o) => o._id === newOrder._id);
                
                if(exists){
                    return prev.map((o) => (o._id === newOrder._id ? newOrder : o));
                }

                return [newOrder, ...prev];
            })
        }

        const handleOrderCompleted = (completedOrder) => {
            setOrders((prev) => 
                prev.map((o) => 
                    o._id === completedOrder._id ? completedOrder : o
                )
            );
        }

        socket.on("order:billRequested", handleBillRequested);
        socket.on("order:completed", handleOrderCompleted);

        return () => {
            socket.off("order:billRequested", handleBillRequested);
            socket.off("order:completed", handleOrderCompleted);
        };
    }, []);


    // FILTER

    const filteredOrders = orders.filter((order) => {

        if (filter === "ALL") {
            return true;
        }

        return order.status === filter;

    });


    // HELPERS

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    const formatTime = (date) => {

        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    // MAIN UI

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

                {/* LEFT */}

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

                        <FiFileText
                            size={20}
                            className="text-orange-400"
                        />

                    </div>


                    <div>

                        <h1
                            className="
                                text-xl
                                font-semibold
                                text-white
                            "
                        >
                            Billing
                        </h1>

                    </div>

                </div>


                {/* RIGHT - FILTERS */}

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

                    {/* PAYMENT PENDING */}

                    <button
                        onClick={() =>
                            setFilter("PAYMENT_PENDING")
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
                                    ? "bg-orange-500/20 text-orange-400 font-semibold"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >

                        <FiClock size={14} />

                        <span>
                            Pending
                        </span>

                    </button>


                    {/* COMPLETED */}

                    <button
                        onClick={() =>
                            setFilter("COMPLETED")
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
                                    ? "bg-green-500/20 text-green-400 font-semibold"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >

                        <FiCheckCircle size={14} />

                        <span>
                            Paid
                        </span>

                    </button>


                    {/* ALL */}

                    <button
                        onClick={() =>
                            setFilter("ALL")
                        }
                        className={`
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            transition-all
                            duration-200

                            ${
                                filter === "ALL"
                                    ? "bg-zinc-700 text-white font-semibold"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >
                        All
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


            {/* ERROR MESSAGE */}

            {!loading && error && (

                <div
                    className="
                        mx-6
                        mt-4
                        rounded-xl
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        text-red-400
                    "
                >
                    {error}
                </div>

            )}


            {/* BILLING ORDERS */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-6
                    py-5
                "
            >

                {loading ? (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                            2xl:grid-cols-4
                        "
                    >

                        {Array.from({ length: 8 }).map((_, i) => (

                            <div
                                key={i}
                                className="
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-zinc-900/80
                                    p-5
                                    animate-pulse
                                "
                            >

                                <div className="flex items-start gap-4">

                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-zinc-800" />

                                    <div className="flex-1 space-y-2">

                                        <div className="flex justify-between items-center">
                                            <div className="h-4 w-24 rounded bg-zinc-700/70" />
                                            <div className="h-5 w-14 rounded-md bg-zinc-800" />
                                        </div>

                                        <div className="h-3 w-32 rounded bg-zinc-800" />

                                    </div>

                                </div>

                                <div className="my-3 border-t border-zinc-800" />

                                <div className="flex justify-between items-center py-1">
                                    <div className="h-3.5 w-20 rounded bg-zinc-800" />
                                    <div className="h-3.5 w-16 rounded bg-zinc-800" />
                                </div>

                                <div className="my-3 border-t border-zinc-800" />

                                <div className="flex justify-between items-center">
                                    <div className="h-3 w-16 rounded bg-zinc-800" />
                                    <div className="h-5 w-20 rounded bg-zinc-700/60" />
                                </div>

                            </div>

                        ))}

                    </div>

                ) : filteredOrders.length === 0 ? (

                    <div
                        className="
                            flex
                            h-64
                            flex-col
                            items-center
                            justify-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-zinc-900
                                text-zinc-600
                            "
                        >

                            <FiFileText size={21} />

                        </div>


                        <p className="text-sm text-zinc-500">
                            No billing orders found.
                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                            2xl:grid-cols-4
                        "
                    >

                        {filteredOrders.map((order) => (

                            <BillCard
                                key={order._id}
                                order={order}
                                onClick={(orderId) =>
                                    navigate(`/billing/${orderId}`)
                                }
                            />                            

                        ))}

                    </div>

                )}

            </div>

        </section>

    );

}


export default Billing;