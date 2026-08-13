import { FiClock, FiLoader, FiCheckCircle } from "react-icons/fi";
import KitchenTicketCard from "./KitchenTicketCard";

const KitchenColumn = ({
    title,
    tickets,
    status,
    onStatusChange,
    showDivider = true,
}) => {

    const getColumnConfig = () => {
        switch (status) {
            case "PENDING":
                return {
                    icon: <FiClock size={17} />,
                    iconClass: "text-orange-400",
                    countClass: "text-orange-400",
                    headClass: "bg-orange-500/10",
                };

            case "PREPARING":
                return {
                    icon: <FiLoader size={17} />,
                    iconClass: "text-blue-400",
                    countClass: "text-blue-400",
                    headClass: "bg-blue-500/10",
                };

            case "READY":
                return {
                    icon: <FiCheckCircle size={17} />,
                    iconClass: "text-green-400",
                    countClass: "text-green-400",
                    headClass: "bg-green-500/10",
                };

            default:
                return {
                    icon: <FiClock size={17} />,
                    iconClass: "text-gray-400",
                    countClass: "text-gray-400",
                    headClass: "bg-gray-500/10",
                };
        }
    };

    const config = getColumnConfig();

    return (
        <section
            className={`flex h-full min-h-0 min-w-0 flex-col px-4 ${
                showDivider
                    ? "border-r border-white/10"
                    : ""
            }`}
        >

            {/* Column Header */}
            <div
                className={`mx-2 mb-4 flex shrink-0 items-center justify-between rounded-lg px-5 py-3 ${config.headClass}`}
            >

                <div className="flex items-center gap-2.5">

                    <span className={config.iconClass}>
                        {config.icon}
                    </span>

                    <h2 className="text-md font-semibold text-zinc-300">
                        {title}
                    </h2>

                </div>

                <span
                    className={`text-lg font-semibold ${config.countClass}`}
                >
                    {tickets.length}
                </span>

            </div>

            {/* Divider */}
            <div className="mx-2 mb-4 shrink-0 border-b border-zinc-700" />

            {/* Scrollable Ticket Area */}
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">

                {tickets.length === 0 ? (

                    <div className="flex min-h-50 flex-col items-center justify-center text-center">

                        <div
                            className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ${config.iconClass}`}
                        >
                            {config.icon}
                        </div>

                        <p className="text-xs text-gray-500">
                            No {title.toLowerCase()} tickets
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {tickets.map((ticket) => (
                            <KitchenTicketCard
                                key={ticket._id}
                                ticket={ticket}
                                onStatusChange={onStatusChange}
                            />
                        ))}

                    </div>

                )}

            </div>

        </section>
    );
};

export default KitchenColumn;