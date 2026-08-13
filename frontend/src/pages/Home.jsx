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
                const response = await getDashboardAnalytics();
                setAnalytics(response.data.data);
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


    if(loading){
        return (
            <div className="p-6 text-zinc-400">
                Loading dashboard...
            </div>
        );
    }


    if(error){
        return (
            <div className="p-6 text-red-400">
                {error}
            </div>
        );
    }


    return (
        <div className="p-6">

            <div className="mt-6 text-zinc-300">

                <div className="p-6">

                    <div className="mb-8">

                        <p className="
                            mt-1
                            text-md
                            text-zinc-400
                        ">
                            Here's what's happening in your restaurant today.
                        </p>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-3
                        gap-4
                    ">

                        <StatCard
                            title="Today's Revenue"
                            value={`₹${analytics.todayRevenue}`}
                            icon={IoCashOutline}
                        />


                        <StatCard
                            title="Today's Orders"
                            value={analytics.todayOrders}
                            icon={IoReceiptOutline}
                        />


                        <StatCard
                            title="Active Orders"
                            value={analytics.activeOrders}
                            icon={IoRestaurantOutline}
                        />


                        <StatCard
                            title="Payment Pending"
                            value={analytics.paymentPendingOrders}
                            subtitle="Orders waiting for payment"
                            icon={IoTimeOutline}
                        />


                        <StatCard
                            title="Occupied Tables"
                            value={analytics.occupiedTables}
                            icon={IoGridOutline}
                        />


                        <StatCard
                            title="Available Tables"
                            value={analytics.availableTables}
                            icon={IoCheckmarkCircleOutline}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Home;