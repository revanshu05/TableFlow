import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineRestaurant } from "react-icons/md";

import OrderItem from "./OrderItem";

import { createKitchenTicket } from "../../api/order.api";
import { clearCart } from "../../redux/slices/cartSlice";


function KOTContainer() {

    const dispatch = useDispatch();

    const order = useSelector(
        (state) => state.cart.items
    );

    const orderId = useSelector(
        (state) => state.customer.orderId
    );

    console.log("KOT ORDER ID:", orderId);

    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const totalItems = order.reduce(
        (sum, item) => sum + item.quantity,
        0
    );


    const subtotal = order.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    const handleSendToKitchen = async () => {

        if (order.length === 0) {
            setError("Please add at least one item.");
            return;
        }

        if (!orderId) {
            setError("Order ID is missing.");
            return;
        }

        try {

            setSending(true);
            setError("");
            setSuccess("");

            const items = order.map((item) => ({
                menuItem: item.id,
                quantity: item.quantity,
            }));

            await createKitchenTicket(
                orderId,
                items
            );

            dispatch(clearCart());

            setSuccess(
                "Kitchen ticket sent successfully."
            );

        } catch (error) {

            console.error("KOT ERROR:", error);
            console.error("Response:", error.response);
            console.error("Response data:", error.response?.data);

            setError(
                error.response?.data?.message || error.message ||
                "Failed to send order to kitchen."
            );

        } finally {
            setSending(false);
        }

    };


    return (

        <div className="
            bg-zinc-900
            rounded-2xl
            h-full
            p-4
            flex
            flex-col
        ">


            {/* Header */}

            <div className="
                flex
                justify-between
                items-center
                pb-3
                border-b
                border-zinc-700
            ">

                <div>

                    <h2 className="
                        text-zinc-100
                        text-lg
                        font-semibold
                    ">
                        Current KOT
                    </h2>

                    <p className="
                        text-zinc-500
                        text-xs
                        mt-0.5
                    ">
                        Items to send to kitchen
                    </p>

                </div>


                <span className="
                    px-2.5
                    py-1
                    rounded-full
                    bg-orange-500/15
                    text-orange-400
                    text-xs
                    font-medium
                ">
                    {totalItems} Items
                </span>

            </div>


            {/* Messages */}

            {error && (

                <div className="
                    mt-2
                    px-3
                    py-2
                    rounded-lg
                    bg-red-500/10
                    border
                    border-red-500/20
                    text-red-400
                    text-xs
                ">
                    {error}
                </div>

            )}


            {success && (

                <div className="
                    mt-2
                    px-3
                    py-2
                    rounded-lg
                    bg-green-500/10
                    border
                    border-green-500/20
                    text-green-400
                    text-xs
                ">
                    {success}
                </div>

            )}


            {/* Items */}

            <div className="
                flex-1
                overflow-y-auto
                space-y-2
                mt-3
                pr-1
            ">

                {order.length === 0 ? (

                    <div className="
                        h-full
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                    ">

                        <MdOutlineRestaurant
                            size={42}
                            className="
                                text-zinc-700
                                mb-3
                            "
                        />

                        <p className="
                            text-zinc-500
                            text-sm
                        ">
                            No items added
                        </p>

                        <p className="
                            text-zinc-600
                            text-xs
                            mt-1
                        ">
                            Select items from the menu
                        </p>

                    </div>

                ) : (

                    order.map((item) => (

                        <OrderItem
                            key={item.id}
                            item={item}
                        />

                    ))

                )}

            </div>


            {/* Bottom */}

            <div className="
                border-t
                border-zinc-700
                pt-3
                mt-3
            ">

                <div className="
                    flex
                    justify-between
                    text-zinc-400
                    text-sm
                ">
                    <span>
                        Items ({totalItems})
                    </span>

                    <span>
                        ₹{subtotal}
                    </span>
                </div>


                <div className="
                    flex
                    justify-between
                    items-center
                    mt-2
                ">

                    <span className="
                        text-zinc-100
                        font-semibold
                    ">
                        KOT Total
                    </span>

                    <span className="
                        text-orange-400
                        text-lg
                        font-bold
                    ">
                        ₹{subtotal}
                    </span>

                </div>


                {/* Send to Kitchen */}

                <button
                    onClick={handleSendToKitchen}
                    disabled={
                        order.length === 0 ||
                        sending
                    }
                    className="
                        w-full
                        mt-3
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
                    "
                >

                    {sending
                        ? "Sending..."
                        : "Send to Kitchen"
                    }

                </button>

            </div>

        </div>

    );

}


export default KOTContainer;