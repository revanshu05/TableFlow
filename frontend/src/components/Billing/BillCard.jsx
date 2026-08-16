import {
    FaUser,
    FaReceipt,
    FaArrowRight,
} from "react-icons/fa";


function BillCard({
    order,
    onClick,
}) {

    const isCompleted = order.status === "COMPLETED";


    return (

        <div
            onClick={() => onClick(order._id)}
            className="
                group
                cursor-pointer
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                p-5

                ease-in-out

                transition-all
                duration-300

                hover:translate-y-0.5
                hover:border-orange-500/40
                hover:shadow-[0_10px_35px_rgba(249,115,22,0.12)]
            "
        >

            {/* ================= TOP ================= */}

            <div
                className="
                    flex
                    items-start
                    gap-4
                "
            >
                {/* Receipt Icon */}

                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-orange-500/10
                        text-orange-400
                    "
                >
                    <FaReceipt size={20} />
                </div>


                {/* Order Information */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-1
                        flex-col
                        gap-2
                    "
                >

                    {/* Order Number + Status */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <h2
                            className="
                                text-base
                                font-semibold
                                text-zinc-100
                                group-hover:text-orange-400
                            "
                        >
                            Order #{order.orderNumber}
                        </h2>


                        <span
                            className={`
                                shrink-0
                                rounded-md
                                px-2.5
                                py-1
                                text-xs
                                font-medium

                                ${
                                    isCompleted
                                        ? `
                                            bg-green-500/10
                                            text-green-400
                                        `
                                        : `
                                            bg-orange-500/10
                                            text-orange-400
                                        `
                                }
                            `}
                        >
                            {isCompleted
                                ? "Paid"
                                : "Pending"
                            }
                        </span>

                    </div>


                    {/* Date & Time */}

                    <p
                        className="
                            text-xs
                            text-zinc-500
                        "
                    >
                        {new Date(
                            order.createdAt
                        ).toLocaleString()}
                    </p>

                </div>

            </div>


            {/* ================= DIVIDER ================= */}

            <div
                className="
                    my-3    
                    border-t
                    border-zinc-700
                "
            />


            {/* ================= CUSTOMER ================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-zinc-800
                            text-zinc-400
                        "
                    >
                        <FaUser size={13} />
                    </div>


                    <div>

                        <p
                            className="
                                text-sm
                                font-medium
                                text-zinc-200
                            "
                        >
                            {order.customer?.name || "Walk-in Customer"}
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-zinc-500
                            "
                        >
                            {order.customer?.members || 1} Members
                        </p>

                    </div>

                </div>


                {/* Table */}

                <div className="text-right">

                    <p
                        className="
                            text-xs
                            text-zinc-500
                        "
                    >
                        Table
                    </p>

                    <p
                        className="
                            mt-0.5
                            text-sm
                            font-medium
                            text-zinc-300
                        "
                    >
                        {order.table?.tableNo || "N/A"}
                    </p>

                </div>

            </div>


            {/* ================= BILL SUMMARY ================= */}

            <div
                className="
                    flex
                    mt-5
                    justify-end
                "
            >

                <div
                    className="
                        bg-zinc-800
                        py-1
                        px-3
                        flex
                        items-center
                        justify-end
                        w-fit
                        rounded-md
                    "
                >

                    <span
                        className="text-md font-semibold text-zinc-300 pr-5">
                        Total: 
                    </span>

                    <span
                        className="
                            text-lg
                            font-semibold
                            text-orange-400
                        "
                    >
                        ₹{order.grandTotal?.toFixed(2)}
                    </span>

                </div>

            </div>


            {/* ================= FOOTER ================= */}

            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                "
            >

                <span
                    className="
                        text-xs
                        text-zinc-600
                    "
                >
                    {order.waiter?.name
                        ? `Served by ${order.waiter.name}`
                        : ""
                    }
                </span>


                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                        text-zinc-500
                        transition
                        group-hover:text-orange-400
                    "
                >

                    View Bill

                    <FaArrowRight
                        size={11}
                        className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                        "
                    />

                </div>

            </div>

        </div>

    );

}


export default BillCard;