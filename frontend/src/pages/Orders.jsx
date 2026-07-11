import { IoMdArrowRoundBack } from "react-icons/io";
import OrderCard from "../components/Orders/OrderCard";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/shared/BackButton";

const orders = [
    {
        id: 1,
        customer: "Revanshu Suthar",
        table: "101",
        orderType: "Dine In",
        date: "January 18, 2025 08:32 PM",
        items: 8,
        total: 250,
        status: "Ready",
    },
    {
        id: 2,
        customer: "Vihan Suthar",
        table: "12",
        orderType: "Take Away",
        date: "July 11, 2026 02:15 PM",
        items: 5,
        total: 780,
        status: "In Progress",
    },
    {
        id: 3,
        customer: "Aarav Sharma",
        table: "15",
        orderType: "Dine In",
        date: "July 11, 2026 01:45 PM",
        items: 6,
        total: 620,
        status: "Ready",
    },
    {
        id: 4,
        customer: "Priya Mehta",
        table: "08",
        orderType: "Take Away",
        date: "July 11, 2026 02:05 PM",
        items: 3,
        total: 340,
        status: "Completed",
    },
    {
        id: 5,
        customer: "Rohan Verma",
        table: "22",
        orderType: "Dine In",
        date: "July 11, 2026 12:55 PM",
        items: 9,
        total: 1120,
        status: "Ready",
    },
    {
        id: 6,
        customer: "Sneha Kapoor",
        table: "18",
        orderType: "Take Away",
        date: "July 11, 2026 02:20 PM",
        items: 4,
        total: 495,
        status: "In Progress",
    },
    {
        id: 7,
        customer: "Aditya Singh",
        table: "04",
        orderType: "Dine In",
        date: "July 11, 2026 01:15 PM",
        items: 7,
        total: 860,
        status: "Completed",
    },
    {
        id: 8,
        customer: "Neha Joshi",
        table: "09",
        orderType: "Dine In",
        date: "July 11, 2026 01:58 PM",
        items: 5,
        total: 540,
        status: "Ready",
    },
    {
        id: 9,
        customer: "Karan Patel",
        table: "31",
        orderType: "Take Away",
        date: "July 11, 2026 02:10 PM",
        items: 2,
        total: 290,
        status: "In Progress",
    },
    {
        id: 10,
        customer: "Ananya Gupta",
        table: "14",
        orderType: "Dine In",
        date: "July 11, 2026 12:40 PM",
        items: 10,
        total: 1450,
        status: "Completed",
    },
];

function Orders(){
    return(
        <section className="bg-zinc-800 h-[calc(100vh-6.5rem)] overflow-hidden flex flex-col items-center">
            <div className="w-[97%] flex flex-row items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                    <BackButton/>
                    <h1 className="text-2xl font-semibold text-zinc-200">Orders</h1>
                </div>
                <div>
                    <button className="text-zinc-300 px-5 py-2 text-md rounded bg-zinc-700">All</button>
                    <button className="text-zinc-300 px-5 py-2 text-md rounded">In Progress</button>
                    <button className="text-zinc-300 px-5 py-2 text-md rounded ">Ready</button>
                    <button className="text-zinc-300 px-5 py-2 text-md rounded ">Completed</button>
                </div>
            </div>
            <div className="w-[97%] mx-auto mt-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4 pb-4">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            {...order}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Orders;