import { FiClock, FiMapPin, FiPlay, FiCheck, FiPackage } from "react-icons/fi";

const KitchenTicketCard = ({ ticket, onStatusChange }) => {

    const getAction = () => {
        if (ticket.status === "PENDING") {
            return {
                label: "Start Preparing",
                action: "start",
                icon: <FiPlay size={14} />,
            };
        }

        if (ticket.status === "PREPARING") {
            return {
                label: "Mark Ready",
                action: "ready",
                icon: <FiCheck size={14} />,
            };
        }

        if (ticket.status === "READY") {
            return {
                label: "Mark Served",
                action: "served",
                icon: <FiCheck size={14} />,
            };
        }

        return null;
    };

    const getStatusStyle = () => {
        switch (ticket.status) {
            case "PENDING":
                return "bg-orange-500/10 text-orange-400 border-orange-500/20";

            case "PREPARING":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";

            case "READY":
                return "bg-green-500/10 text-green-400 border-green-500/20";

            default:
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    const formatTime = (date) => {
        if (!date) return "--";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const action = getAction();

    return (
        <div className="mx-auto w-full max-w-90 rounded-xl border border-white/5 
        bg-[#18181b] p-3.5 transition 
        hover:border-orange-500/40 hover:shadow-[0_10px_35px_rgba(249,115,22,0.12)]">

            {/* KOT Header */}
            <div className="flex items-center justify-between">

                <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-semibold text-white">
                        KOT #{ticket.ticketNumber}
                    </h3>

                    <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${getStatusStyle()}`}
                    >
                        {ticket.status}
                    </span>
                </div>

            </div>

            {/* Table + Time */}
            <div className="mt-2.5 flex items-center gap-5 text-xs">

                <div className="flex items-center gap-1.5 text-gray-400">
                    <FiMapPin
                        size={13}
                        className="text-cyan-400"
                    />

                    <span>
                        Table {ticket.table?.tableNo || "--"}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500">
                    <FiClock size={13} />

                    <span>
                        {formatTime(ticket.createdAt)}
                    </span>
                </div>

            </div>

            {/* Items */}
            <div className="mt-3 border-t border-white/5 pt-3">

                <div className="mb-2 flex items-center gap-1.5">
                    <FiPackage
                        size={14}
                        className="text-gray-500"
                    />

                    <p className="text-xs font-medium text-gray-400">
                        Items
                    </p>

                    <span className="text-[11px] text-gray-600">
                        ({ticket.items.length})
                    </span>
                </div>

                <div className="space-y-1.5">

                    {ticket.items.map((item) => (
                        <div
                            key={item.menuItem}
                            className="flex items-center justify-between rounded-md bg-[#202023] px-2.5 py-1.5"
                        >
                            <span className="text-xs text-gray-200">
                                {item.name}
                            </span>

                            <span className="text-xs font-medium text-gray-400">
                                × {item.quantity}
                            </span>
                        </div>
                    ))}

                </div>

            </div>

            {/* Action */}
            {action && (
                <button
                    onClick={() =>
                        onStatusChange(
                            ticket._id,
                            action.action
                        )
                    }
                    className="mt-3 flex w-full items-center justify-center 
                    gap-2 rounded-lg bg-cyan-600 py-2 text-xs 
                    font-semibold text-white transition 
                    hover:bg-cyan-700 active:scale-[0.99] cursor-pointer"
                >
                    {action.icon}
                    {action.label}
                </button>
            )}

        </div>
    );
};

export default KitchenTicketCard;