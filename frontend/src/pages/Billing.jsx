import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiFileText,
    FiClock,
    FiCheckCircle,
    FiArrowRight,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { MdTableRestaurant } from "react-icons/md";

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


    // LOADING

    if (loading) {

        return (

            <section
                className="
                    flex
                    h-[calc(100vh-3.5rem)]
                    items-center
                    justify-center
                    bg-zinc-800
                "
            >

                <p className="text-sm text-zinc-400">
                    Loading billing...
                </p>

            </section>

        );

    }


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

                    {/* ALL */}

                    <button
                        onClick={() => setFilter("ALL")}
                        className={`
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
                                    ? "bg-blue-500/15 text-blue-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >

                        <FiClock size={14} />

                        Pending

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
                                    ? "bg-green-500/15 text-green-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >

                        <FiCheckCircle size={14} />

                        Paid

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


            {/* ERROR */}

            {error && (

                <div
                    className="
                        mx-6
                        mt-4
                        shrink-0
                        rounded-lg
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

                {filteredOrders.length === 0 ? (

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