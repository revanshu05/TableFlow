import { FiCheckCircle } from "react-icons/fi";
import { LuClock3 } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";

import { getAvatarColor } from "../../utils";


const statusConfig = {

    OPEN: {
        badge: "bg-orange-500/15 text-orange-400 border-orange-500/20",
        icon: <LuClock3 />,
        label: "Open",
    },

    PAYMENT_PENDING: {
        badge: "bg-blue-500/15 text-blue-400 border-blue-500/20",
        icon: <MdOutlinePayment />,
        label: "Payment Pending",
    },

    COMPLETED: {
        badge: "bg-green-500/15 text-green-400 border-green-500/20",
        icon: <FiCheckCircle />,
        label: "Completed",
    },

};


function OrderCard({
    _id,
    orderNumber,
    customer,
    table,
    status,
    kotCount,
    grandTotal,
    createdAt,
}) {

    const currentStatus =
        statusConfig[status] || {
            badge: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
            icon: null,
            label: status || "Unknown",
        };


    const customerName = customer?.name || "Unknown Customer";


    const formattedTime = createdAt
        ? new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "--";


    return (
        <div
            className="
                group
                w-full
                bg-zinc-900
                rounded-xl
                p-3.5
                border
                border-zinc-800
                cursor-pointer

                transition-all
                duration-300
                ease-out

                hover:translate-y-0.5
                hover:border-orange-500/40
                hover:shadow-[0_10px_35px_rgba(249,115,22,0.12)]

                active:scale-[0.98]
            "
        >

            {/* TOP */}
            <div className="flex justify-between items-start">

                {/* Customer */}
                <div className="flex items-center gap-3">

                    <div
                        className={`
                            w-10
                            h-10
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-sm
                            ${getAvatarColor(customerName)}
                        `}
                    >
                        {customerName
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        }
                    </div>


                    <div>

                        <h3
                            className="
                                text-white
                                font-semibold
                                group-hover:text-orange-400
                                transition-colors
                            "
                        >
                            Order #{orderNumber}
                        </h3>

                        <p className="text-zinc-500 text-xs mt-0.5">
                            {customerName}
                        </p>

                    </div>

                </div>


                {/* Status */}
                <div
                    className={`
                        inline-flex
                        items-center
                        gap-1.5
                        px-2.5
                        py-1
                        rounded-full
                        border
                        text-xs
                        font-medium
                        ${currentStatus.badge}
                    `}
                >
                    {currentStatus.icon}
                    {currentStatus.label}
                </div>

            </div>


            {/* ORDER INFORMATION */}
            <div
                className="
                    grid
                    grid-cols-2
                    gap-y-3
                    mt-4
                "
            >

                {/* Table */}
                <div>

                    <p className="text-xs text-zinc-500">
                        Table
                    </p>

                    <p className="text-sm text-zinc-200 font-medium mt-0.5">
                        {table?.tableNo
                            ? `Table ${table.tableNo}`
                            : "Take Away"
                        }
                    </p>

                </div>


                {/* Members */}
                <div>

                    <p className="text-xs text-zinc-500">
                        Members
                    </p>

                    <p className="text-sm text-zinc-200 font-medium mt-0.5">
                        {customer?.members ?? "--"}
                    </p>

                </div>


                {/* Items */}
                <div>

                    <p className="text-xs text-zinc-500">
                        Items
                    </p>

                    <p className="text-sm text-zinc-200 font-medium mt-0.5">
                        --
                    </p>

                </div>


                {/* KOTs */}
                <div>

                    <p className="text-xs text-zinc-500">
                        KOTs
                    </p>

                    <p className="text-sm text-zinc-200 font-medium mt-0.5">
                        {kotCount ?? 0}
                    </p>

                </div>

            </div>


            {/* BOTTOM */}
            <div
                className="
                    flex
                    justify-between
                    items-end
                    mt-4
                    pt-3
                    border-t
                    border-zinc-800
                "
            >

                {/* Created */}
                <div>

                    <p className="text-xs text-zinc-500">
                        Created
                    </p>

                    <p className="text-sm text-zinc-300 mt-0.5">
                        {formattedTime}
                    </p>

                </div>


                {/* Total */}
                <div className="text-right">

                    <p className="text-xs text-zinc-500">
                        Order Total
                    </p>

                    <p
                        className="
                            text-lg
                            font-bold
                            text-orange-400
                            mt-0.5
                        "
                    >
                        ₹{grandTotal ?? 0}
                    </p>

                </div>

            </div>

        </div>
    );
}


export default OrderCard;