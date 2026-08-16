import { useEffect, useState } from "react";
import StatCard from "../components/Home/StatCard";
import { getDashboardAnalytics } from "../api/analytics.api";

import {
    IoCashOutline,
    IoReceiptOutline,
    IoRestaurantOutline,
    IoTimeOutline,
    IoGridOutline,
    IoCheckmarkCircleOutline,
} from "react-icons/io5";


function Home() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                const response =
                    await getDashboardAnalytics();

                setAnalytics(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Dashboard analytics error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchAnalytics();

    }, []);


    if (loading) {

        return (
            <div className="
                flex
                h-full
                items-center
                justify-center
                p-6
                text-sm
                text-zinc-400
            ">
                Loading dashboard...
            </div>
        );

    }


    if (error) {

        return (
            <div className="
                p-6
                text-sm
                text-red-400
            ">
                {error}
            </div>
        );

    }


    return (

        <div className="
            min-h-full
            bg-zinc-800
            p-6
        ">

            {/* Header */}

            <div className="mb-8">

                <h1 className="
                    text-xl
                    font-semibold
                    text-zinc-100
                ">
                    Dashboard
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-zinc-500
                ">
                    Here's what's happening in your
                    restaurant today.
                </p>

            </div>


            {/* Cards */}

            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-3
            ">

                <StatCard
                    title="Today's Revenue"
                    value={`₹${Number(
                        analytics.todayRevenue || 0
                    ).toFixed(2)}`}
                    icon={IoCashOutline}
                    color="orange"
                />


                <StatCard
                    title="Today's Orders"
                    value={analytics.todayOrders}
                    icon={IoReceiptOutline}
                    color="blue"
                />


                <StatCard
                    title="Active Orders"
                    value={analytics.activeOrders}
                    icon={IoRestaurantOutline}
                    color="purple"
                />


                <StatCard
                    title="Payment Pending"
                    value={analytics.paymentPendingOrders}
                    subtitle="Orders waiting for payment"
                    icon={IoTimeOutline}
                    color="amber"
                />


                <StatCard
                    title="Occupied Tables"
                    value={analytics.occupiedTables}
                    icon={IoGridOutline}
                    color="red"
                />


                <StatCard
                    title="Available Tables"
                    value={analytics.availableTables}
                    icon={IoCheckmarkCircleOutline}
                    color="green"
                />

            </div>

        </div>

    );

}


export default Home;