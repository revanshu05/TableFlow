import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    updateTable,
    setCustomer,
} from "../../redux/slices/customerSlice";
import { LuUsers } from "react-icons/lu";

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

    const formattedTableNo = String(tableNo).padStart(2, "0");
    const isOccupied = status === "OCCUPIED";

    return (
        <div
            onClick={handleClick}
            className={`
                group
                relative
                aspect-square
                w-full
                rounded-xl
                p-3
                flex
                flex-col
                justify-between
                cursor-pointer
                transition-all
                duration-150
                ease-out
                hover:scale-[1.03]
                active:scale-[0.97]
                ${
    isOccupied
        ? `
            bg-orange-500/20
            hover:border-orange-400
            hover:bg-orange-500/15
        `
        : `
            bg-zinc-900/30
            border-2
            border-dashed
            border-zinc-700/80
            hover:border-zinc-500
            hover:bg-zinc-900/60
        `
}
            `}
        >
            {/* Table Number */}
            <span
                className={`
                    text-2xl
                    font-bold
                    tracking-tight
                    ${isOccupied ? "text-white" : "text-zinc-300"}
                `}
            >
                {formattedTableNo}
            </span>

            {/* Bottom: Capacity Only */}
            <div
                className={`
                    flex
                    items-center
                    gap-1
                    text-sm
                    font-medium
                    ${isOccupied ? "text-white" : "text-zinc-500"}
                `}
            >
                <LuUsers size={13} className={isOccupied ? "text-white" : "text-zinc-500"} />
                <span>{seats}</span>
                <span className="text-sm">seats</span>
            </div>
        </div>
    );
}

export default TableCard;