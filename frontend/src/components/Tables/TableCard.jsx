function TableCard({
    tableNo,
    seats,
    status,
    customer,
}) {

    const statusConfig = {
        "Available": {
            badge: "bg-green-500/20 text-green-400",
            text: "Available",
        },
        "Booked": {
            badge: "bg-red-500/20 text-red-400",
            text: "Occupied",
        },
    };

    const currentStatus = statusConfig[status];

    return (
        <div className="w-full bg-zinc-900 rounded-lg p-4 border border-zinc-900 hover:border-olive-500 
            transition-all duration-200">
            
            <div className="flex justify-between items-center">
                <h2 className="text-white text-xl font-semibold">
                    Table → {tableNo}
                </h2>

                <div className={`px-3 py-1 rounded-md text-sm ${currentStatus.badge}`}>
                    {currentStatus.text}
                </div>
            </div>

            <div className="flex justify-center my-2">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center 
                    justify-center text-zinc-200 text-xl font-semibold">
                    {customer}
                </div>
            </div>

            <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">
                    Seats: <span className="text-zinc-200 font-medium">{seats}</span>
                </span>
            </div>

        </div>
    );
}

export default TableCard;