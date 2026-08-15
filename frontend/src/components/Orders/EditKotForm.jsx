import { useEffect, useState } from "react";
import { FiMinus, FiTrash2 } from "react-icons/fi";

import Modal from "../shared/Modal";
import { updateKitchenTicket } from "../../api/kitchen.api";


function EditKotForm({
    isOpen,
    onClose,
    ticket,
    onUpdated,
}) {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!ticket) {
            setItems([]);
            return;
        }

        setItems(
            ticket.items.map((item) => ({
                menuItem: item.menuItem,
                name: item.name,
                quantity: item.quantity,
                originalQuantity: item.quantity,
                unitPrice: item.unitPrice,
            }))
        );

        setError("");

    }, [ticket]);


    const handleDecrease = (menuItem) => {

        setItems((currentItems) =>
            currentItems.map((item) => {

                if (item.menuItem !== menuItem) {
                    return item;
                }

                return {
                    ...item,
                    quantity: Math.max(0, item.quantity - 1),
                };

            })
        );

    };


    const handleRemove = (menuItem) => {

        setItems((currentItems) =>
            currentItems.map((item) => {

                if (item.menuItem !== menuItem) {
                    return item;
                }

                return {
                    ...item,
                    quantity: 0,
                };

            })
        );

    };


    /*
     * Submit changes
     */
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        const changedItems = items
            .filter(
                (item) =>
                    item.quantity !== item.originalQuantity
            )
            .map((item) => ({
                menuItem: item.menuItem,
                quantity: item.quantity,
            }));

        if (changedItems.length === 0) {

            onClose();

            return;
        }


        try {

            setLoading(true);


            await updateKitchenTicket(
                ticket._id,
                changedItems
            );

            if (onUpdated) {
                await onUpdated();
            }


            onClose();

        } catch (error) {

            console.error(
                "Failed to update KOT:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update KOT"
            );

        } finally {

            setLoading(false);

        }

    };


    if (!ticket) {
        return null;
    }


    return (

        <Modal
            title={`Edit KOT #${ticket.ticketNumber}`}
            isOpen={isOpen}
            onClose={onClose}
        >

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* Info */}
                <div className="
                    rounded-lg
                    border
                    border-orange-500/10
                    bg-orange-500/5
                    px-3
                    py-2.5
                    text-xs
                    text-zinc-400
                ">
                    You can only reduce quantities or remove
                    items from a pending KOT. To add new items,
                    create a new KOT.
                </div>


                {/* Items */}

                <div className="space-y-3">

                    {items.map((item) => {

                        const isRemoved =
                            item.quantity === 0;

                        return (

                            <div
                                key={item.menuItem}
                                className={`
                                    flex
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    px-4
                                    py-3
                                    transition
                                    ${
                                        isRemoved
                                            ? "border-red-500/20 bg-red-500/5 opacity-60"
                                            : "border-zinc-700 bg-zinc-900"
                                    }
                                `}
                            >

                                {/* Item info */}

                                <div className="min-w-0">

                                    <p className="
                                        text-sm
                                        font-medium
                                        text-zinc-200
                                        truncate
                                    ">
                                        {item.name}
                                    </p>

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-zinc-500
                                    ">
                                        Original quantity:{" "}
                                        {item.originalQuantity}
                                    </p>

                                    {isRemoved && (
                                        <p className="
                                            mt-1
                                            text-xs
                                            text-red-400
                                        ">
                                            Will be removed
                                        </p>
                                    )}

                                </div>


                                {/* Quantity controls */}

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    ml-4
                                ">

                                    {/* Decrease */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDecrease(
                                                item.menuItem
                                            )
                                        }
                                        disabled={
                                            item.quantity === 0
                                        }
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-zinc-700
                                            bg-zinc-800
                                            text-zinc-300
                                            transition
                                            hover:bg-zinc-700
                                            disabled:cursor-not-allowed
                                            disabled:opacity-30
                                        "
                                    >
                                        <FiMinus size={14} />
                                    </button>


                                    {/* Quantity */}

                                    <span className="
                                        w-7
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-zinc-200
                                    ">
                                        {item.quantity}
                                    </span>


                                    {/* Delete */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemove(
                                                item.menuItem
                                            )
                                        }
                                        disabled={
                                            item.quantity === 0
                                        }
                                        className="
                                            ml-1
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            text-red-400
                                            transition
                                            hover:bg-red-500/10
                                            disabled:cursor-not-allowed
                                            disabled:opacity-30
                                        "
                                        title="Remove item"
                                    >
                                        <FiTrash2 size={15} />
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>


                {/* Error */}

                {error && (

                    <div className="
                        rounded-lg
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-3
                        py-2
                        text-sm
                        text-red-400
                    ">
                        {error}
                    </div>

                )}


                {/* Actions */}

                <div className="
                    flex
                    justify-center
                    gap-3
                    border-t
                    border-zinc-800
                    pt-4
                ">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-zinc-700
                            px-4
                            py-2
                            text-sm
                            text-zinc-300
                            transition
                            hover:bg-zinc-800
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            rounded-lg
                            bg-orange-500
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-orange-400
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Updating..."
                            : items.every((item) => item.quantity === 0)
                                ? "Delete KOT"
                                : "Update KOT"
                        }
                    </button>

                </div>

            </form>

        </Modal>

    );

}


export default EditKotForm;