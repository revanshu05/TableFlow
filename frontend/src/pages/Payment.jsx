import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiCreditCard,
    FiDollarSign,
    FiUser,
    FiUsers,
    FiCheckCircle,
    FiLoader,
} from "react-icons/fi";

import {
    getOrderById,
    completePayment,
} from "../api/order.api";


function Payment() {

    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    const [tip, setTip] = useState(0);
    const [tipInput, setTipInput] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("CASH");

    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");


    /* =========================================
       FETCH ORDER
    ========================================= */

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getOrderById(orderId);

                const orderData = response.data.data;

                /*
                 * Payment should only be available
                 * for PAYMENT_PENDING orders.
                 */

                if (orderData.status !== "PAYMENT_PENDING") {

                    setError(
                        "This order is not available for payment."
                    );

                    return;
                }

                setOrder(orderData);

                /*
                 * If the order already has a tip,
                 * show it in the input.
                 */

                if (orderData.tip > 0) {

                    setTip(orderData.tip);
                    setTipInput(String(orderData.tip));

                }

            } catch (error) {

                console.error(
                    "Failed to fetch order:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load order"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchOrder();

    }, [orderId]);


    /* =========================================
       TIP
    ========================================= */

    const handleTipChange = (e) => {

        const value = e.target.value;

        /*
         * Allow empty input while typing.
         */

        if (value === "") {

            setTipInput("");
            setTip(0);

            return;
        }

        const numericValue = Number(value);

        if (
            !Number.isNaN(numericValue) &&
            numericValue >= 0
        ) {

            setTipInput(value);
            setTip(numericValue);

        }

    };


    const handleTipPreset = (amount) => {

        setTip(amount);
        setTipInput(String(amount));

    };


    /* =========================================
       COMPLETE PAYMENT
    ========================================= */

    const handleCompletePayment = async () => {

        if (!order) {
            return;
        }

        try {

            setPaying(true);
            setError("");

            await completePayment(
                order._id,
                {
                    paymentMethod,
                    tip,
                }
            );

            /*
             * Payment successful.
             * Go back to order details.
             */

            navigate(`/orders/${order._id}`);

        } catch (error) {

            console.error(
                "Failed to complete payment:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to complete payment"
            );

        } finally {

            setPaying(false);

        }

    };


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (

            <section className="
                flex
                h-[calc(100vh-3.5rem)]
                items-center
                justify-center
                bg-zinc-800
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-zinc-400
                ">

                    <FiLoader
                        size={16}
                        className="animate-spin"
                    />

                    Loading payment details...

                </div>

            </section>

        );

    }


    /* =========================================
       ERROR / INVALID ORDER
    ========================================= */

    if (error && !order) {

        return (

            <section className="
                flex
                h-[calc(100vh-3.5rem)]
                flex-col
                items-center
                justify-center
                bg-zinc-800
            ">

                <p className="
                    text-sm
                    text-red-400
                ">
                    {error}
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="
                        mt-4
                        rounded-lg
                        border
                        border-zinc-700
                        px-4
                        py-2
                        text-sm
                        text-zinc-300
                        transition
                        hover:bg-zinc-700
                    "
                >
                    Go Back
                </button>

            </section>

        );

    }


    if (!order) {
        return null;
    }


    const amountToPay =
        order.grandTotal + tip;


    return (

        <section className="
            flex
            h-[calc(100vh-3.5rem)]
            flex-col
            overflow-hidden
            bg-zinc-800
        ">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-zinc-700
                px-6
                py-4
            ">

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-zinc-400
                            transition
                            hover:bg-zinc-700
                            hover:text-zinc-200
                        "
                    >
                        <FiArrowLeft size={18} />
                    </button>


                    <div>

                        <h1 className="
                            text-lg
                            font-semibold
                            text-white
                        ">
                            Complete Payment
                        </h1>

                        <p className="
                            mt-0.5
                            text-xs
                            text-zinc-500
                        ">
                            Order #{order.orderNumber}
                            {" • "}
                            Table {order.table?.tableNo ?? "N/A"}
                        </p>

                    </div>

                </div>


                {/* Payment pending badge */}

                <div className="
                    rounded-full
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-blue-400
                ">
                    Payment Pending
                </div>

            </div>


            {/* =========================================
                CONTENT
            ========================================= */}

            <div className="
                min-h-0
                flex-1
                overflow-y-auto
                px-6
                py-5
            ">

                <div className="
                    mx-auto
                    grid
                    max-w-6xl
                    grid-cols-1
                    gap-5
                    lg:grid-cols-[1.5fr_1fr]
                ">


                    {/* =================================
                        LEFT — BILL
                    ================================= */}

                    <div className="
                        rounded-2xl
                        border
                        border-zinc-700
                        bg-zinc-900
                        p-5
                    ">


                        {/* Customer information */}

                        <div className="
                            mb-5
                            flex
                            items-center
                            justify-between
                        ">

                            <div className="flex items-center gap-3">

                                <div className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-orange-500/10
                                ">
                                    <FiUser
                                        size={17}
                                        className="text-orange-400"
                                    />
                                </div>


                                <div>

                                    <p className="
                                        text-sm
                                        font-medium
                                        text-zinc-200
                                    ">
                                        {order.customer?.name}
                                    </p>

                                    <div className="
                                        mt-1
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-zinc-500
                                    ">

                                        <span>
                                            {order.customer?.phone ||
                                                "No phone"}
                                        </span>

                                        <span>
                                            •
                                        </span>

                                        <span className="
                                            flex
                                            items-center
                                            gap-1
                                        ">
                                            <FiUsers size={12} />
                                            {order.customer?.members || 1}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <div className="
                                text-right
                            ">

                                <p className="
                                    text-xs
                                    text-zinc-500
                                ">
                                    Waiter
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-zinc-300
                                ">
                                    {order.waiter?.name || "N/A"}
                                </p>

                            </div>

                        </div>


                        {/* Divider */}

                        <div className="
                            mb-4
                            border-t
                            border-zinc-800
                        " />


                        {/* Items */}

                        <div>

                            <div className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            ">

                                <h2 className="
                                    text-sm
                                    font-medium
                                    text-zinc-200
                                ">
                                    Order Items
                                </h2>

                                <span className="
                                    text-xs
                                    text-zinc-500
                                ">
                                    {order.items.length} items
                                </span>

                            </div>


                            <div className="space-y-3">

                                {order.items.map((item) => {

                                    const itemTotal =
                                        item.quantity *
                                        item.unitPrice;

                                    return (

                                        <div
                                            key={item.menuItem}
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                                rounded-lg
                                                bg-zinc-800/60
                                                px-3
                                                py-2.5
                                            "
                                        >

                                            <div className="min-w-0">

                                                <p className="
                                                    truncate
                                                    text-sm
                                                    text-zinc-200
                                                ">
                                                    {item.name}
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-zinc-500
                                                ">
                                                    {item.quantity}
                                                    {" × "}
                                                    ₹{item.unitPrice}
                                                </p>

                                            </div>


                                            <p className="
                                                shrink-0
                                                text-sm
                                                font-medium
                                                text-zinc-300
                                            ">
                                                ₹{itemTotal.toFixed(2)}
                                            </p>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>


                        {/* Totals */}

                        <div className="
                            mt-5
                            border-t
                            border-zinc-800
                            pt-4
                        ">

                            <div className="
                                flex
                                justify-between
                                text-sm
                            ">
                                <span className="text-zinc-500">
                                    Subtotal
                                </span>

                                <span className="text-zinc-300">
                                    ₹{order.subtotal.toFixed(2)}
                                </span>
                            </div>


                            <div className="
                                mt-2
                                flex
                                justify-between
                                text-sm
                            ">
                                <span className="text-zinc-500">
                                    Tax
                                </span>

                                <span className="text-zinc-300">
                                    ₹{order.tax.toFixed(2)}
                                </span>
                            </div>


                            {order.discount > 0 && (

                                <div className="
                                    mt-2
                                    flex
                                    justify-between
                                    text-sm
                                ">
                                    <span className="text-zinc-500">
                                        Discount
                                    </span>

                                    <span className="text-green-400">
                                        - ₹{order.discount.toFixed(2)}
                                    </span>
                                </div>

                            )}


                            <div className="
                                mt-4
                                flex
                                items-center
                                justify-between
                                border-t
                                border-zinc-800
                                pt-4
                            ">

                                <span className="
                                    font-medium
                                    text-zinc-300
                                ">
                                    Total
                                </span>

                                <span className="
                                    text-xl
                                    font-semibold
                                    text-orange-400
                                ">
                                    ₹{order.grandTotal.toFixed(2)}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        RIGHT — PAYMENT
                    ================================= */}

                    <div className="
                        h-135
                        flex
                        flex-col
                        rounded-2xl
                        border
                        border-zinc-700
                        bg-zinc-900
                        p-5
                    ">


                        {/* Tip */}

                        <div>

                            <h2 className="
                                text-sm
                                font-medium
                                text-zinc-200
                            ">
                                Add Tip
                            </h2>

                            <p className="
                                mt-1
                                text-xs
                                text-zinc-500
                            ">
                                Optional tip for the waiter
                            </p>


                            <div className="
                                mt-3
                                flex
                                gap-2
                            ">

                                {[0, 50, 100, 200].map((amount) => (

                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() =>
                                            handleTipPreset(amount)
                                        }
                                        className={`
                                            flex-1
                                            rounded-lg
                                            border
                                            px-3
                                            py-2
                                            text-xs
                                            transition

                                            ${
                                                tip === amount
                                                    ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                                                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                                            }
                                        `}
                                    >
                                        {amount === 0
                                            ? "No Tip"
                                            : `₹${amount}`
                                        }
                                    </button>

                                ))}

                            </div>


                            <input
                                type="number"
                                min="0"
                                value={tipInput}
                                onChange={handleTipChange}
                                placeholder="Custom tip"
                                className="
                                    mt-3
                                    w-full
                                    rounded-lg
                                    border
                                    border-zinc-700
                                    bg-zinc-800
                                    px-3
                                    py-2.5
                                    text-sm
                                    text-zinc-200
                                    outline-none
                                    placeholder:text-zinc-600
                                    focus:border-orange-500/50
                                "
                            />

                        </div>


                        {/* Payment method */}

                        <div className="
                            mt-6
                        ">

                            <h2 className="
                                text-sm
                                font-medium
                                text-zinc-200
                            ">
                                Payment Method
                            </h2>


                            <div className="
                                mt-3
                                grid
                                grid-cols-2
                                gap-3
                            ">


                                {/* CASH */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaymentMethod("CASH")
                                    }
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        px-4
                                        py-3
                                        text-left
                                        transition

                                        ${
                                            paymentMethod === "CASH"
                                                ? "border-orange-500/40 bg-orange-500/10"
                                                : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                                        }
                                    `}
                                >

                                    <FiDollarSign
                                        size={19}
                                        className={
                                            paymentMethod === "CASH"
                                                ? "text-orange-400"
                                                : "text-zinc-500"
                                        }
                                    />

                                    <div>

                                        <p className={`
                                            text-sm
                                            font-medium
                                            ${
                                                paymentMethod === "CASH"
                                                    ? "text-orange-400"
                                                    : "text-zinc-300"
                                            }
                                        `}>
                                            Cash
                                        </p>

                                    </div>

                                </button>


                                {/* ONLINE */}

                                <button
                                    type="button"
                                    disabled
                                    className="
                                        flex
                                        cursor-not-allowed
                                        items-center
                                        gap-3
                                        rounded-xl
                                        border
                                        border-zinc-800
                                        bg-zinc-800/50
                                        px-4
                                        py-3
                                        text-left
                                        opacity-50
                                    "
                                >

                                    <FiCreditCard
                                        size={19}
                                        className="text-zinc-600"
                                    />

                                    <div>

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-zinc-500
                                        ">
                                            Online
                                        </p>

                                        <p className="
                                            mt-0.5
                                            text-[11px]
                                            text-zinc-600
                                        ">
                                            Coming soon
                                        </p>

                                    </div>

                                </button>

                            </div>

                        </div>


                        {/* Payment summary */}

                        <div className="
                            mt-auto
                            pt-6
                        ">

                            <div className="
                                rounded-xl
                                border
                                border-zinc-700
                                bg-zinc-800
                                p-4
                            ">

                                <div className="
                                    flex
                                    justify-between
                                    text-sm
                                ">

                                    <span className="text-zinc-500">
                                        Order Total
                                    </span>

                                    <span className="text-zinc-300">
                                        ₹{order.grandTotal.toFixed(2)}
                                    </span>

                                </div>


                                <div className="
                                    mt-2
                                    flex
                                    justify-between
                                    text-sm
                                ">

                                    <span className="text-zinc-500">
                                        Tip
                                    </span>

                                    <span className="text-zinc-300">
                                        ₹{tip.toFixed(2)}
                                    </span>

                                </div>


                                <div className="
                                    mt-3
                                    flex
                                    items-center
                                    justify-between
                                    border-t
                                    border-zinc-700
                                    pt-3
                                ">

                                    <span className="
                                        font-medium
                                        text-zinc-200
                                    ">
                                        Amount to Pay
                                    </span>

                                    <span className="
                                        text-2xl
                                        font-semibold
                                        text-white
                                    ">
                                        ₹{amountToPay.toFixed(2)}
                                    </span>

                                </div>

                            </div>


                            {/* Error */}

                            {error && (

                                <div className="
                                    mt-3
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


                            {/* Complete button */}

                            <button
                                type="button"
                                onClick={handleCompletePayment}
                                disabled={paying}
                                className="
                                    mt-4
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-orange-500
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-orange-500/10
                                    transition
                                    hover:bg-orange-400
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {paying ? (

                                    <>
                                        <FiLoader
                                            size={16}
                                            className="animate-spin"
                                        />

                                        Processing...

                                    </>

                                ) : (

                                    <>
                                        <FiCheckCircle size={17} />

                                        Complete Payment

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default Payment;