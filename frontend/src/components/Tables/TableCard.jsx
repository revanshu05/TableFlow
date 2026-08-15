import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
    updateTable,
    setCustomer,
} from "../../redux/slices/customerSlice";


function TableCard({
    tableNo,
    seats,
    status,
    waiter,
    currentOrder,
}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleClick = () => {

        if (status === "AVAILABLE") return;

        if (status === "OCCUPIED") {

            dispatch(updateTable({
                tableNo,
            }));


            dispatch(setCustomer({
                name: currentOrder?.customer?.name || "",
                phone: currentOrder?.customer?.phone || "",
                members: currentOrder?.customer?.members || 0,
                orderType: currentOrder?.orderType,
                orderId: currentOrder?._id,
            }));


            navigate("/menu");
        }

    };


    const statusConfig = {
        AVAILABLE: {
            badge: "bg-green-500/20 text-green-400",
            text: "Available",
        },

        OCCUPIED: {
            badge: "bg-red-500/20 text-red-400",
            text: "Occupied",
        },
    };


    const currentStatus =
        statusConfig[status] || {
            badge: "bg-zinc-500/20 text-zinc-400",
            text: status,
        };


    return (
        <div
            onClick={handleClick}
            className="
                group
                w-full
                bg-zinc-900
                rounded-xl
                p-4
                border
                border-zinc-800
                cursor-pointer
                transition-all
                duration-300
                ease-out
                hover:translate-0.5
                hover:scale-[1.02]
                hover:bg-zinc-800
                hover:border-orange-500/50
                hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]
                active:scale-[0.98]
            "
        >

            {/* Table number + status */}

            <div className="
                flex
                justify-between
                items-center
            ">

                <h2 className="
                    text-white
                    text-xl
                    font-semibold
                    transition-colors
                    duration-300
                    group-hover:text-orange-400
                ">
                    Table {tableNo}
                </h2>


                <div className={`
                    px-3
                    py-1
                    rounded-md
                    text-xs
                    font-medium
                    ${currentStatus.badge}
                `}>
                    {currentStatus.text}
                </div>

            </div>


            {/* Table information */}

            <div className="
                mt-6
                space-y-3
            ">

                {/* Seats */}

                <div className="
                    flex
                    justify-between
                    items-center
                    text-sm
                ">

                    <span className="text-zinc-500">
                        Seats
                    </span>

                    <span className="
                        text-zinc-200
                        font-medium
                    ">
                        {seats}
                    </span>

                </div>


                {/* Waiter */}

                <div className="
                    flex
                    justify-between
                    items-center
                    text-sm
                ">

                    <span className="text-zinc-500">
                        Waiter
                    </span>

                    <span className="
                        text-zinc-200
                        font-medium
                    ">
                        {waiter?.name || "Unassigned"}
                    </span>

                </div>

            </div>

        </div>
    );
}


export default TableCard;