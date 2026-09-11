import { useEffect, useState } from "react";
import { FiRefreshCw, FiActivity } from "react-icons/fi";
import { IoRestaurantOutline } from "react-icons/io5"
import { socket } from "../socket";

import {
    getKitchenTickets,
    updateKitchenTicketStatus,
} from "../api/kitchen.api";

import KitchenColumn from "../components/Kitchen/KitchenColumn";

const Kitchen = () => {

    const [tickets, setTickets] = useState({
        pending: [],
        preparing: [],
        ready: [],
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchTickets = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getKitchenTickets();

            setTickets(response.data.data);

        } catch (error) {
            console.error(
                "Failed to fetch kitchen tickets:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to fetch kitchen tickets"
            );

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        fetchTickets();

        const handleKotCreated = (newTicket) => {
            setTickets((prev) => {
                const exists = prev.pending.some((t) => t._id === newTicket._id);
                if (exists) return prev;

                return {
                    ...prev,
                    pending: [newTicket, ...prev.pending],
                };
            });
        };

        const handleKotStatusUpdated = (updatedTicket) => {
            setTickets((prev) => {
                const ticketId = updatedTicket._id;

                const newPending = prev.pending.filter((t) => t._id !== ticketId);
                const newPreparing = prev.preparing.filter((t) => t._id !== ticketId);
                const newReady = prev.ready.filter((t) => t._id !== ticketId);

                if (updatedTicket.status === "PENDING") newPending.unshift(updatedTicket);
                if (updatedTicket.status === "PREPARING") newPreparing.unshift(updatedTicket);
                if (updatedTicket.status === "READY") newReady.unshift(updatedTicket);
                
                return {
                    pending: newPending,
                    preparing: newPreparing,
                    ready: newReady,
                };
            });
        };

        socket.on("kot:created", handleKotCreated);
        socket.on("kot:statusUpdated", handleKotStatusUpdated);

        return () => {
            socket.off("kot:created", handleKotCreated);
            socket.off("kot:statusUpdated", handleKotStatusUpdated);
        };
    }, []);

    const handleStatusChange = async (ticketId, action) => {
        try {
            setError("");

            await updateKitchenTicketStatus(ticketId, action);

        } catch (error) {
            console.error("Failed to update kitchen ticket status:", error);
            setError(
                error.response?.data?.message ||
                "Failed to update kitchen ticket status"
            );
            fetchTickets(false);
        }
    };

    const totalTickets =
        tickets.pending.length +
        tickets.preparing.length +
        tickets.ready.length;

    return (
        <div className="flex flex-col overflow-hidden h-full min-h-0 bg-zinc-800 px-6 py-4">

            {/* Page Header */}
            <div className="mb-4 flex shrink-0 items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                        <IoRestaurantOutline
                            size={20}
                            className="text-orange-400"
                        />
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold text-white">
                            Kitchen Dashboard
                        </h1>
                    </div>

                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">

                    <div className="hidden items-center gap-2 rounded-lg border border-white/5 bg-[#18181b] px-3 py-2 sm:flex">

                        <span className="h-2 w-2 rounded-full bg-green-400" />

                        <span className="text-xs text-gray-400">
                            {totalTickets} active
                        </span>

                    </div>

                    <button
                        onClick={() => fetchTickets(false)}
                        disabled={refreshing}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#18181b] px-3 py-2 text-sm text-gray-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FiRefreshCw
                            size={15}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        <span className="hidden sm:inline">
                            Refresh
                        </span>
                    </button>

                </div>

            </div>

            {/* Error */}
            {error && (
                <div className="mb-5 shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            <div
                className="
                    mb-3
                    shrink-0
                    border-b
                    border-zinc-700
                "
            />

            {/* Kitchen Board */}
            <div className="min-h-0 flex-1 overflow-hidden bg-zinc-800 py-1">

                <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-3">

                    <KitchenColumn
                        title="Pending"
                        status="PENDING"
                        tickets={tickets.pending}
                        onStatusChange={handleStatusChange}
                        showDivider={true}
                        loading={loading}
                    />

                    <KitchenColumn
                        title="Preparing"
                        status="PREPARING"
                        tickets={tickets.preparing}
                        onStatusChange={handleStatusChange}
                        showDivider={true}
                        loading={loading}
                    />

                    <KitchenColumn
                        title="Ready"
                        status="READY"
                        tickets={tickets.ready}
                        onStatusChange={handleStatusChange}
                        showDivider={false}
                        loading={loading}
                    />

                </div>

            </div>

        </div>
    );
};

export default Kitchen;