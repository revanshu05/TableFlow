import { FaCheckCircle } from "react-icons/fa";
import { LuChefHat } from "react-icons/lu";
import { BsCheck2All } from "react-icons/bs";
import { getAvatarColor } from "../../utils/getAvatarColor";

const statusConfig = {
    "In Progress": {
        badge: "bg-yellow-500/20 text-yellow-400",
        text: "Preparing order",
        icon: <LuChefHat />,
    },
    "Ready": {
        badge: "bg-green-500/20 text-green-400",
        text: "Ready to serve",
        icon: <FaCheckCircle />,
    },
    "Completed": {
        badge: "bg-blue-500/20 text-blue-400",
        text: "Order completed",
        icon: <BsCheck2All />,
    },
};

function OrderCard({
    customer,
    table,
    orderType,
    date,
    items,
    total,
    status,
}) {
    const currentStatus = statusConfig[status];

    return (
        <div className="w-full bg-zinc-900 rounded-xl p-4 border border-zinc-900 hover:border-olive-500 transition-all duration-200">
            <div className="flex justify-between items-start">
                <div className="flex gap-3">

                    <div className={`w-12 h-12 rounded-lg font-bold flex items-center justify-center ${getAvatarColor(customer)}`}>
                        {customer
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)}
                    </div>

                    <div>
                        <h3 className="text-white font-semibold">{customer}</h3>
                        <p className="text-zinc-400 text-sm">#{table} | {orderType}</p>
                    </div>

                </div>

                <div className="text-right">
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${currentStatus.badge}`}>
                        {currentStatus.icon}
                        {status}
                    </div>
                    <p className="text-zinc-500 text-xs mt-2">{currentStatus.text}</p>
                </div>

            </div>

            <div className="flex justify-between items-center mt-6 text-sm text-zinc-400">
                <p>{date}</p>
                <p>{items} Items</p>
            </div>

            <hr className="my-4 border-zinc-700" />

            <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold text-lg">₹{total}</span>
            </div>

        </div>
    );
}

export default OrderCard;