import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import TableCard from "../components/Tables/TableCard";
import CreateTableForm from "../components/Tables/CreateTableForm";

import { getTables } from "../api/table.api";


function Tables() {

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const user = useSelector((state) => state.auth.user);

    const isAdmin = user?.role === "admin";


    const fetchTables = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getTables();

            console.log("Tables response:", response.data);

            setTables(response.data.data);

        } catch (error) {

            console.error("Failed to fetch tables:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load tables"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchTables();
    }, []);


    const filteredTables = tables.filter((table) => {

        if (filter === "ALL") return true;

        return table.status === filter;
    });


    return (
        <section className="
            bg-zinc-800
            h-[calc(100vh-3.5rem)]
            overflow-hidden
            flex
            flex-col
            items-center
        ">

            {/* Top Controls */}
            <div className="
                w-[94%]
                flex
                items-center
                justify-between
                mt-5
            ">

                {/* Admin Action */}
                <div>

                    {isAdmin && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-cyan-700
                                text-white
                                text-sm
                                font-medium
                                hover:bg-cyan-800
                                hover:shadow-lg
                                hover:shadow-cyan-900/30
                                transition-all
                                duration-200
                            "
                        >
                            + Add Table
                        </button>
                    )}

                </div>


                {/* Filters */}
                <div className="
                    flex
                    items-center
                    bg-zinc-900
                    border
                    border-zinc-700
                    rounded-xl
                    p-1
                    gap-1
                ">

                    <button
                        onClick={() => setFilter("ALL")}
                        className={`
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                            transition-all
                            duration-200
                            ${
                                filter === "ALL"
                                    ? "bg-zinc-700 text-white"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            }
                        `}
                    >
                        All
                    </button>


                    <button
                        onClick={() => setFilter("AVAILABLE")}
                        className={`
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                            transition-all
                            duration-200
                            ${
                                filter === "AVAILABLE"
                                    ? "bg-green-500/20 text-green-400"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            }
                        `}
                    >
                        Available
                    </button>


                    <button
                        onClick={() => setFilter("OCCUPIED")}
                        className={`
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                            transition-all
                            duration-200
                            ${
                                filter === "OCCUPIED"
                                    ? "bg-red-500/20 text-red-400"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            }
                        `}
                    >
                        Occupied
                    </button>

                </div>

            </div>

            <div 
                className="
                border
                w-[94%]
                mt-5
                border-zinc-700"
            ></div>


            {/* Tables */}
            <div className="
                w-[97%]
                p-4
                mx-auto
                mt-1
                flex-1
                overflow-y-auto
            ">

                {/* Loading */}
                {loading && (
                    <div className="
                        flex
                        justify-center
                        items-center
                        h-40
                        text-zinc-400
                    ">
                        Loading tables...
                    </div>
                )}


                {/* Error */}
                {!loading && error && (
                    <div className="
                        flex
                        justify-center
                        items-center
                        h-40
                        text-red-400
                    ">
                        {error}
                    </div>
                )}


                {/* Tables */}
                {!loading && !error && filteredTables.length > 0 && (
                    <div className="
                        grid
                        grid-cols-5
                        gap-5
                        pb-4
                    ">

                        {filteredTables.map((table) => (

                            <TableCard
                                key={table._id}
                                tableNo={table.tableNo}
                                seats={table.capacity}
                                status={table.status}
                                waiter={table.assignedWaiter}
                            />

                        ))}

                    </div>
                )}


                {/* No Tables */}
                {!loading &&
                    !error &&
                    filteredTables.length === 0 && (
                        <div className="
                            flex
                            justify-center
                            items-center
                            h-40
                            text-zinc-500
                        ">
                            No tables found.
                        </div>
                    )
                }

            </div>


            {/* Create Table Modal */}
            <CreateTableForm
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onTableCreated={fetchTables}
            />

        </section>
    );
}


export default Tables;