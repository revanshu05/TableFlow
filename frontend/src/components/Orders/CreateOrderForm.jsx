import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { getTables } from "../../api/table.api";
import { createOrder } from "../../api/order.api";

import { setCustomer } from "../../redux/slices/customerSlice";

function CreateOrderForm({ onClose }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [members, setMembers] = useState(1);
    const [notes, setNotes] = useState("");

    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);

    const [loadingTables, setLoadingTables] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");


    /* ---------------- FETCH AVAILABLE TABLES ---------------- */

    useEffect(() => {

        const fetchAvailableTables = async () => {

            try {

                setLoadingTables(true);
                setError("");

                const response = await getTables();

                const availableTables =
                    response.data.data.filter(
                        (table) => table.status === "AVAILABLE"
                    );

                setTables(availableTables);

            } catch (error) {

                console.error(
                    "Failed to fetch tables:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load available tables"
                );

            } finally {

                setLoadingTables(false);

            }

        };

        fetchAvailableTables();

    }, []);


    /* ---------------- MEMBER CONTROLS ---------------- */

    const decreaseMembers = () => {

        setMembers((prev) =>
            Math.max(prev - 1, 1)
        );

    };


    const increaseMembers = () => {

        if (!selectedTable) {
            setMembers((prev) => prev + 1);
            return;
        }

        setMembers((prev) =>
            Math.min(prev + 1, selectedTable.capacity)
        );

    };


    /* ---------------- TABLE SELECTION ---------------- */

    const handleTableSelect = (table) => {

        setSelectedTable(table);

        // If current members exceed the selected
        // table capacity, adjust it automatically.
        if (members > table.capacity) {
            setMembers(table.capacity);
        }

    };


    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!customerName.trim()) {
            setError("Customer name is required");
            return;
        }


        if (!selectedTable) {
            setError("Please select a table");
            return;
        }


        if (members < 1) {
            setError("At least one member is required");
            return;
        }


        if (members > selectedTable.capacity) {
            setError(
                `This table can accommodate only ${selectedTable.capacity} members`
            );
            return;
        }


        try {

            setSubmitting(true);


            const response = await createOrder({
                customer: {
                    name: customerName.trim(),
                    phone: customerPhone.trim(),
                    members,
                },
                tableId: selectedTable._id,
                notes: notes.trim(),
            });

            console.log("CREATE ORDER RESPONSE:", response);
            console.log("CREATE ORDER DATA:", response.data);
            console.log("CREATED ORDER:", response.data.data);
            console.log("MONGO ORDER ID:", response.data.data?._id);

            const createdOrder = response.data.data;

            dispatch(setCustomer({
                name: createdOrder.customer.name,
                phone: createdOrder.customer.phone,
                members: createdOrder.customer.members,
                orderType: createdOrder.orderType,
                notes: createdOrder.notes,
                orderId: createdOrder._id,
            }));


            console.log(
                "Order created:",
                response.data
            );

            onClose();

            navigate("/menu");

        } catch (error) {

            console.error(
                "Failed to create order:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create order"
            );

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            {/* Main Form */}
            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
            ">


                {/* ================= LEFT ================= */}

                <div className="
                    space-y-5
                    md:border-r
                    md:border-zinc-700
                    md:pr-6
                ">

                    <div>

                        <h2 className="
                            text-sm
                            font-semibold
                            text-zinc-200
                        ">
                            Customer Details
                        </h2>

                        <p className="
                            text-xs
                            text-zinc-500
                            mt-1
                        ">
                            Enter the customer's information
                        </p>

                    </div>


                    {/* Customer Name */}

                    <div>

                        <label className="
                            block
                            text-sm
                            text-zinc-400
                            mb-2
                        ">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) =>
                                setCustomerName(e.target.value)
                            }
                            placeholder="Enter customer name"
                            className="
                                w-full
                                bg-zinc-900
                                border
                                border-zinc-700
                                rounded-lg
                                px-4
                                py-2.5
                                text-zinc-200
                                placeholder-zinc-600
                                outline-none
                                focus:border-orange-500/60
                                focus:ring-1
                                focus:ring-orange-500/20
                                transition
                            "
                        />

                    </div>


                    {/* Phone */}

                    <div>

                        <label className="
                            block
                            text-sm
                            text-zinc-400
                            mb-2
                        ">
                            Phone Number

                            <span className="
                                text-zinc-600
                                ml-1
                            ">
                                (optional)
                            </span>

                        </label>

                        <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) =>
                                setCustomerPhone(e.target.value)
                            }
                            placeholder="Enter phone number"
                            className="
                                w-full
                                bg-zinc-900
                                border
                                border-zinc-700
                                rounded-lg
                                px-4
                                py-2.5
                                text-zinc-200
                                placeholder-zinc-600
                                outline-none
                                focus:border-orange-500/60
                                focus:ring-1
                                focus:ring-orange-500/20
                                transition
                            "
                        />

                    </div>


                    {/* Members */}

                    <div>

                        <label className="
                            block
                            text-sm
                            text-zinc-400
                            mb-2
                        ">
                            Number of Members
                        </label>


                        <div className="
                            flex
                            items-center
                            justify-between
                            bg-zinc-900
                            border
                            border-zinc-700
                            rounded-lg
                            px-3
                            py-2
                        ">

                            <button
                                type="button"
                                onClick={decreaseMembers}
                                disabled={members <= 1}
                                className="
                                    h-8
                                    w-8
                                    rounded-md
                                    flex
                                    items-center
                                    justify-center
                                    text-zinc-400
                                    hover:text-orange-400
                                    hover:bg-zinc-800
                                    disabled:opacity-30
                                    disabled:cursor-not-allowed
                                    transition
                                "
                            >
                                <FaMinus size={12} />
                            </button>


                            <span className="
                                text-zinc-200
                                font-semibold
                            ">
                                {members}
                            </span>


                            <button
                                type="button"
                                onClick={increaseMembers}
                                disabled={
                                    selectedTable &&
                                    members >= selectedTable.capacity
                                }
                                className="
                                    h-8
                                    w-8
                                    rounded-md
                                    flex
                                    items-center
                                    justify-center
                                    text-zinc-400
                                    hover:text-orange-400
                                    hover:bg-zinc-800
                                    disabled:opacity-30
                                    disabled:cursor-not-allowed
                                    transition
                                "
                            >
                                <FaPlus size={12} />
                            </button>

                        </div>


                        {selectedTable && (
                            <p className="
                                text-xs
                                text-zinc-600
                                mt-1.5
                            ">
                                Maximum {selectedTable.capacity} members
                            </p>
                        )}

                    </div>


                    {/* Notes */}

                    <div>

                        <label className="
                            block
                            text-sm
                            text-zinc-400
                            mb-2
                        ">
                            Notes

                            <span className="
                                text-zinc-600
                                ml-1
                            ">
                                (optional)
                            </span>

                        </label>

                        <textarea
                            value={notes}
                            onChange={(e) =>
                                setNotes(e.target.value)
                            }
                            placeholder="Any special requests..."
                            rows={4}
                            className="
                                w-full
                                resize-none
                                bg-zinc-900
                                border
                                border-zinc-700
                                rounded-lg
                                px-4
                                py-2.5
                                text-zinc-200
                                placeholder-zinc-600
                                outline-none
                                focus:border-orange-500/60
                                focus:ring-1
                                focus:ring-orange-500/20
                                transition
                            "
                        />

                    </div>

                </div>


                {/* ================= RIGHT ================= */}

                <div className="
                    flex
                    flex-col
                ">

                    <div className="
                        flex
                        justify-between
                        items-start
                        mb-4
                    ">

                        <div>

                            <h2 className="
                                text-sm
                                font-semibold
                                text-zinc-200
                            ">
                                Select Table
                            </h2>

                            <p className="
                                text-xs
                                text-zinc-500
                                mt-1
                            ">
                                Choose an available table
                            </p>

                        </div>


                        <span className="
                            text-xs
                            text-green-400
                            bg-green-500/10
                            border
                            border-green-500/10
                            px-2.5
                            py-1
                            rounded-full
                        ">
                            {tables.length} available
                        </span>

                    </div>


                    {/* Tables */}

                    <div className="
                        flex-1
                        min-h-0
                    ">

                        {loadingTables ? (

                            <div className="
                                h-full
                                min-h-56
                                flex
                                items-center
                                justify-center
                                text-sm
                                text-zinc-500
                                bg-zinc-900
                                rounded-xl
                                border
                                border-zinc-800
                            ">
                                Loading tables...
                            </div>

                        ) : tables.length === 0 ? (

                            <div className="
                                h-full
                                min-h-56
                                flex
                                items-center
                                justify-center
                                text-sm
                                text-zinc-500
                                bg-zinc-900
                                rounded-xl
                                border
                                border-zinc-800
                            ">
                                No tables available
                            </div>

                        ) : (

                            <div className="
                                grid
                                grid-cols-2
                                gap-3
                                max-h-80
                                overflow-y-auto
                                pr-1
                            ">

                                {tables.map((table) => {

                                    const isSelected =
                                        selectedTable?._id === table._id;


                                    return (

                                        <button
                                            type="button"
                                            key={table._id}
                                            onClick={() =>
                                                handleTableSelect(table)
                                            }
                                            className={`
                                                relative
                                                p-4
                                                rounded-xl
                                                border
                                                text-left
                                                transition-all
                                                duration-300
                                                ${
                                                    isSelected
                                                        ? `
                                                            border-orange-500
                                                            bg-orange-500/10
                                                            shadow-[0_0_20px_rgba(249,115,22,0.15)]
                                                          `
                                                        : `
                                                            border-zinc-700
                                                            bg-zinc-900
                                                            hover:border-zinc-500
                                                            hover:bg-zinc-800
                                                          `
                                                }
                                            `}
                                        >

                                            <div className={`
                                                text-lg
                                                font-semibold
                                                ${
                                                    isSelected
                                                        ? "text-orange-400"
                                                        : "text-zinc-200"
                                                }
                                            `}>
                                                Table {table.tableNo}
                                            </div>


                                            <div className="
                                                text-xs
                                                text-zinc-500
                                                mt-1
                                            ">
                                                {table.capacity} seats
                                            </div>

                                        </button>

                                    );

                                })}

                            </div>

                        )}

                    </div>


                    {/* Selected Table */}

                    <div className="
                        mt-4
                        px-4
                        py-3
                        rounded-lg
                        bg-zinc-900
                        border
                        border-zinc-800
                    ">

                        <div className="
                            flex
                            justify-between
                            items-center
                        ">

                            <span className="
                                text-xs
                                text-zinc-500
                            ">
                                Selected Table
                            </span>


                            <span className={`
                                text-sm
                                font-medium
                                ${
                                    selectedTable
                                        ? "text-orange-400"
                                        : "text-zinc-600"
                                }
                            `}>
                                {selectedTable
                                    ? `Table ${selectedTable.tableNo}`
                                    : "None"
                                }
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* Error */}

            {error && (

                <div className="
                    px-3
                    py-2.5
                    rounded-lg
                    bg-red-500/10
                    border
                    border-red-500/20
                    text-red-400
                    text-sm
                ">
                    {error}
                </div>

            )}


            {/* Bottom Actions */}

            <div className="
                flex
                justify-end
                items-center
                gap-3
                pt-4
                border-t
                border-zinc-700
            ">

                <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="
                        px-5
                        py-2.5
                        rounded-lg
                        text-sm
                        font-medium
                        text-zinc-400
                        hover:text-zinc-200
                        hover:bg-zinc-800
                        transition
                    "
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={
                        submitting ||
                        !selectedTable ||
                        !customerName.trim()
                    }
                    className="
                        px-6
                        py-2.5
                        rounded-lg
                        bg-orange-500
                        hover:bg-orange-400
                        disabled:bg-zinc-700
                        disabled:text-zinc-500
                        disabled:cursor-not-allowed
                        text-zinc-950
                        font-semibold
                        transition-all
                        duration-200
                        hover:shadow-[0_0_20px_rgba(249,115,22,0.18)]
                    "
                >
                    {submitting
                        ? "Creating Order..."
                        : "Create Order →"
                    }
                </button>

            </div>

        </form>

    );

}

export default CreateOrderForm;