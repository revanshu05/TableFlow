import { useState } from "react";

import Modal from "../shared/Modal";
import { createTable } from "../../api/table.api";


function CreateTableForm({ isOpen, onClose, onTableCreated }) {

    const [tableNo, setTableNo] = useState("");
    const [capacity, setCapacity] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if(!tableNo || !capacity){
            setError("Table number and capacity are required");
            return;
        }

        try{

            setLoading(true);

            await createTable({
                tableNo: Number(tableNo),
                capacity: Number(capacity),
            });

            setTableNo("");
            setCapacity("");

            onTableCreated();
            onClose();

        } catch (error) {

            console.error("Failed to create table:", error);

            setError(
                error.response?.data?.message ||
                "Failed to create table"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <Modal
            title="Add New Table"
            isOpen={isOpen}
            onClose={onClose}
        >

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* Table Number */}
                <div>

                    <label className="
                        block
                        text-sm
                        text-zinc-400
                        mb-2
                    ">
                        Table Number
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={tableNo}
                        onChange={(e) => setTableNo(e.target.value)}
                        placeholder="Enter table number"
                        className="
                            w-full
                            bg-zinc-900
                            border
                            border-zinc-700
                            rounded-lg
                            px-4
                            py-2.5
                            text-zinc-200
                            placeholder:text-zinc-600
                            outline-none
                        "
                    />

                </div>


                {/* Capacity */}
                <div>

                    <label className="
                        block
                        text-sm
                        text-zinc-400
                        mb-2
                    ">
                        Number of Seats
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Enter number of seats"
                        className="
                            w-full
                            bg-zinc-900
                            border
                            border-zinc-700
                            rounded-lg
                            px-4
                            py-2.5
                            text-zinc-200
                            placeholder:text-zinc-600
                            outline-none
                        "
                    />

                </div>


                {/* Error */}
                {error && (
                    <div className="
                        bg-red-500/10
                        border
                        border-red-500/20
                        text-red-400
                        text-sm
                        rounded-lg
                        px-3
                        py-2
                    ">
                        {error}
                    </div>
                )}


                {/* Actions */}
                <div className="
                    flex
                    justify-center
                    gap-3
                    pt-2
                ">

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-orange-500
                            text-white
                            font-medium
                            hover:bg-orange-400
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition
                        "
                    >
                        {loading ? "Creating..." : "Create Table"}
                    </button>

                </div>

            </form>

        </Modal>
    );
}


export default CreateTableForm;