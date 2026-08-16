import { useEffect, useState } from "react";
import { IoGridOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";

import TableCard from "../components/Tables/TableCard";
import CreateTableForm from "../components/Tables/CreateTableForm";

import { getTables } from "../api/table.api";


function Tables() {

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");

    const [showCreateModal, setShowCreateModal] = useState(false);


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

        <section
            className="
                relative
                flex
                h-[calc(100vh-3.5rem)]
                flex-col
                overflow-hidden
                bg-zinc-800
            "
        >

            {/* PAGE HEADER */}

            <div
                className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    px-6
                    py-3
                "
            >

                {/* Left - Page Title */}

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-orange-500/10
                        "
                    >

                        <IoGridOutline
                            size={20}
                            className="text-orange-400"
                        />

                    </div>


                    <h1
                        className="
                            text-xl
                            font-semibold
                            text-white
                        "
                    >
                        Tables
                    </h1>

                </div>


                {/* Right - Filters */}

                <div
                    className="
                        flex
                        items-center
                        gap-1
                        rounded-xl
                        border
                        border-zinc-700
                        bg-zinc-900
                        p-1
                    "
                >

                    <button
                        onClick={() => setFilter("ALL")}
                        className={`
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            transition-all
                            duration-200

                            ${
                                filter === "ALL"
                                    ? "bg-zinc-700 text-white"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >
                        All
                    </button>


                    <button
                        onClick={() => setFilter("AVAILABLE")}
                        className={`
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            transition-all
                            duration-200

                            ${
                                filter === "AVAILABLE"
                                    ? "bg-green-500/20 text-green-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >
                        Available
                    </button>


                    <button
                        onClick={() => setFilter("OCCUPIED")}
                        className={`
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            transition-all
                            duration-200

                            ${
                                filter === "OCCUPIED"
                                    ? "bg-red-500/20 text-red-400"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                        `}
                    >
                        Occupied
                    </button>

                </div>

            </div>


            {/* HEADER DIVIDER */}

            <div
                className="
                    mx-6
                    shrink-0
                    border-b
                    border-zinc-700
                "
            />


            {/* TABLE CONTENT */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-6
                    py-4
                "
            >

                {/* Loading */}

                {loading && (

                    <div
                        className="
                            flex
                            h-40
                            items-center
                            justify-center
                            text-sm
                            text-zinc-400
                        "
                    >
                        Loading tables...
                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div
                        className="
                            flex
                            h-40
                            items-center
                            justify-center
                            text-sm
                            text-red-400
                        "
                    >
                        {error}
                    </div>

                )}


                {/* Tables */}

                {!loading &&
                    !error &&
                    filteredTables.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-5
                                pb-4
                                md:grid-cols-3
                                lg:grid-cols-4
                                xl:grid-cols-5
                            "
                        >

                            {filteredTables.map((table) => (

                                <TableCard
                                    key={table._id}
                                    tableNo={table.tableNo}
                                    seats={table.capacity}
                                    status={table.status}
                                    waiter={table.assignedWaiter}
                                    currentOrder={table.currentOrder}
                                />

                            ))}

                        </div>

                    )}


                {/* No Tables */}

                {!loading &&
                    !error &&
                    filteredTables.length === 0 && (

                        <div
                            className="
                                flex
                                h-40
                                items-center
                                justify-center
                                text-sm
                                text-zinc-500
                            "
                        >
                            No tables found.
                        </div>

                    )}

            </div>


            {/* TEMPORARY ADD TABLE BUTTON */}

            <button
                onClick={() => setShowCreateModal(true)}
                className="
                    fixed
                    bottom-7
                    right-7
                    z-40

                    flex
                    h-14
                    w-14
                    items-center
                    justify-center

                    rounded-full

                    bg-blue-600
                    text-white

                    shadow-lg
                    shadow-blue-600/30

                    transition-all
                    duration-200

                    hover:scale-105
                    hover:bg-blue-500

                    active:scale-95
                "
                title="Add Table"
            >

                <FiPlus size={24} />

            </button>


            {/* CREATE TABLE MODAL */}

            <CreateTableForm
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onTableCreated={fetchTables}
            />

        </section>

    );

}


export default Tables;