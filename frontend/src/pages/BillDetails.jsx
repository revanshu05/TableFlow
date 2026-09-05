import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FiArrowLeft,
    FiUser,
    FiPhone,
    FiUsers,
    FiMapPin,
    FiClock,
    FiFileText,
    FiPrinter,
    FiDownload,
    FiCheckCircle,
} from "react-icons/fi";

import { MdAttachMoney } from "react-icons/md";

import { getOrderById } from "../api/order.api";
import { generateReceiptPDF } from "../utils/receiptGenerator";


// HELPERS

const formatTime = (date) => {

    if (!date) return "N/A";

    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

};


const formatDate = (date) => {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

};


const formatCurrency = (value) => {

    return `₹${Number(value || 0).toFixed(2)}`;

};


// BILL RECEIPT

function BillReceipt({ order }) {

    const items = order.items || [];

    const isPaid =
        order.status === "COMPLETED";

    /*
     * grandTotal already contains:
     *
     * subtotal + tax - discount
     *
     * Tip is added separately.
     */

    const tip = Number(order.tip || 0);

    const finalTotal =
        Number(order.grandTotal || 0) + tip;


    return (

        <div
            id="bill-receipt-printable"
            className="
                rounded-2xl
                border
                border-zinc-700
                bg-zinc-900
                overflow-hidden
            "
        >

            {/* RECEIPT HEADER */}

            <div
                className="
                    border-b
                    border-zinc-800
                    px-6
                    py-6
                "
            >

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-6
                    "
                >

                    <div>

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

                                <FiFileText
                                    size={19}
                                    className="text-orange-400"
                                />

                            </div>


                            <div>

                                <h1
                                    className="
                                        text-xl
                                        font-semibold
                                        text-white
                                    "
                                >
                                    Order #{order.orderNumber}
                                </h1>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-zinc-500
                                    "
                                >
                                    {formatDate(order.createdAt)}
                                    {" • "}
                                    {formatTime(order.createdAt)}
                                </p>

                            </div>

                        </div>

                    </div>


                    <span
                        className={`
                            shrink-0
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-semibold

                            ${
                                isPaid
                                    ? "bg-green-500/15 text-green-400"
                                    : "bg-orange-500/15 text-orange-400"
                            }
                        `}
                    >
                        {isPaid
                            ? "PAID"
                            : "PAYMENT PENDING"
                        }
                    </span>

                </div>

            </div>


            {/* CUSTOMER / ORDER INFORMATION */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-6
                    border-b
                    border-zinc-800
                    px-6
                    py-6
                    md:grid-cols-2
                "
            >

                {/* CUSTOMER */}

                <div>

                    <p
                        className="
                            mb-4
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-zinc-600
                        "
                    >
                        Customer
                    </p>


                    <div className="space-y-3">

                        <div className="flex items-center gap-3">

                            <FiUser
                                size={15}
                                className="text-zinc-600"
                            />

                            <span className="text-sm text-zinc-300">
                                {order.customer?.name || "N/A"}
                            </span>

                        </div>


                        <div className="flex items-center gap-3">

                            <FiPhone
                                size={15}
                                className="text-zinc-600"
                            />

                            <span className="text-sm text-zinc-400">
                                {order.customer?.phone || "N/A"}
                            </span>

                        </div>


                        <div className="flex items-center gap-3">

                            <FiUsers
                                size={15}
                                className="text-zinc-600"
                            />

                            <span className="text-sm text-zinc-400">
                                {order.customer?.members || 0} Members
                            </span>

                        </div>

                    </div>

                </div>


                {/* ORDER */}

                <div>

                    <p
                        className="
                            mb-4
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-zinc-600
                        "
                    >
                        Order Information
                    </p>


                    <div className="space-y-3">

                        <div className="flex items-center gap-3">

                            <FiMapPin
                                size={15}
                                className="text-zinc-600"
                            />

                            <span className="text-sm text-zinc-400">

                                {order.table?.tableNo
                                    ? `Table ${order.table.tableNo}`
                                    : "N/A"
                                }

                            </span>

                        </div>


                        <div className="flex items-center gap-3">

                            <FiUser
                                size={15}
                                className="text-zinc-600"
                            />

                            <span className="text-sm text-zinc-400">
                                Waiter: {order.waiter?.name || "N/A"}
                            </span>

                        </div>


                        <div className="flex items-center gap-3">

                            <FiClock
                                size={15}
                                className="text-zinc-600"
                            />

                            <span className="text-sm text-zinc-400">

                                {formatDate(order.createdAt)}
                                {" • "}
                                {formatTime(order.createdAt)}

                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* ITEMS */}

            <div className="px-6 py-6">

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-orange-500/10
                            "
                        >

                            <FiFileText
                                size={17}
                                className="text-orange-400"
                            />

                        </div>


                        <h2
                            className="
                                text-base
                                font-semibold
                                text-zinc-100
                            "
                        >
                            Items
                        </h2>

                    </div>


                    <span
                        className="
                            rounded-full
                            bg-zinc-800
                            px-3
                            py-1
                            text-xs
                            text-zinc-400
                        "
                    >
                        {items.length} items
                    </span>

                </div>


                {/* COLUMN HEADER */}

                <div
                    className="
                        grid
                        grid-cols-[1fr_70px_110px_120px]
                        gap-3
                        border-b
                        border-zinc-800
                        px-1
                        pb-3
                        text-xs
                        text-zinc-500
                    "
                >

                    <span>Item</span>

                    <span className="text-right">
                        Qty
                    </span>

                    <span className="text-right">
                        Unit Price
                    </span>

                    <span className="text-right">
                        Amount
                    </span>

                </div>


                {/* ITEMS */}

                <div>

                    {items.map((item, index) => {

                        const amount =
                            item.quantity *
                            item.unitPrice;

                        return (

                            <div
                                key={`${item.menuItem}-${index}`}
                                className="
                                    grid
                                    grid-cols-[1fr_70px_110px_120px]
                                    items-center
                                    gap-3
                                    border-b
                                    border-zinc-800
                                    px-1
                                    py-4
                                "
                            >

                                <span
                                    className="
                                        text-sm
                                        font-medium
                                        text-zinc-100
                                    "
                                >
                                    {item.name}
                                </span>


                                <span
                                    className="
                                        text-right
                                        text-sm
                                        text-zinc-400
                                    "
                                >
                                    {item.quantity}
                                </span>


                                <span
                                    className="
                                        text-right
                                        text-sm
                                        text-zinc-400
                                    "
                                >
                                    {formatCurrency(item.unitPrice)}
                                </span>


                                <span
                                    className="
                                        text-right
                                        text-sm
                                        font-medium
                                        text-zinc-100
                                    "
                                >
                                    {formatCurrency(amount)}
                                </span>

                            </div>

                        );

                    })}

                </div>


                {/* TOTALS */}

                <div
                    className="
                        mt-6
                        ml-auto
                        w-full
                        max-w-80
                        space-y-3
                    "
                >

                    <div className="flex justify-between">

                        <span className="text-sm text-zinc-500">
                            Subtotal
                        </span>

                        <span className="text-sm text-zinc-300">
                            {formatCurrency(order.subtotal)}
                        </span>

                    </div>


                    <div className="flex justify-between">

                        <span className="text-sm text-zinc-500">
                            Tax
                        </span>

                        <span className="text-sm text-zinc-300">
                            {formatCurrency(order.tax)}
                        </span>

                    </div>


                    <div className="flex justify-between">

                        <span className="text-sm text-zinc-500">
                            Discount
                        </span>

                        <span className="text-sm text-green-400">
                            - {formatCurrency(order.discount)}
                        </span>

                    </div>


                    {/* TIP */}

                    <div className="flex justify-between">

                        <span className="text-sm text-zinc-500">
                            Tip
                        </span>

                        <span className="text-sm text-zinc-300">
                            {formatCurrency(tip)}
                        </span>

                    </div>


                    {/* FINAL TOTAL */}

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            justify-between
                            border-t
                            border-zinc-700
                            pt-4
                        "
                    >

                        <span
                            className="
                                text-base
                                font-semibold
                                text-zinc-100
                            "
                        >
                            Total
                        </span>


                        <span
                            className="
                                text-2xl
                                font-bold
                                text-orange-400
                            "
                        >
                            {formatCurrency(finalTotal)}
                        </span>

                    </div>

                </div>


                {/* PAYMENT INFORMATION */}

                {isPaid && (

                    <div
                        className="
                            mt-6
                            rounded-lg
                            border
                            border-green-500/15
                            bg-green-500/5
                            px-4
                            py-3
                        "
                    >

                        <div className="flex items-center gap-3">

                            <FiCheckCircle
                                size={17}
                                className="text-green-400"
                            />

                            <div>

                                <p className="text-sm font-medium text-green-400">
                                    Payment Completed
                                </p>

                                <p className="mt-1 text-xs text-zinc-500">

                                    {order.paymentMethod || "N/A"}
                                    {" • "}
                                    {formatDate(order.paidAt)}
                                    {" • "}
                                    {formatTime(order.paidAt)}

                                </p>

                                {tip > 0 && (

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-zinc-500
                                    ">
                                        Tip: {formatCurrency(tip)}
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}


// PAYMENT PANEL

function PaymentPanel({
    order,
    onCompletePayment,
    onPrintReceipt,
    onDownloadPDF,
}) {

    const isPaid =
        order.status === "COMPLETED";

    const tip =
        Number(order.tip || 0);

    const finalTotal =
        Number(order.grandTotal || 0) + tip;


    return (

        <div
            className="
                rounded-2xl
                border
                border-zinc-700
                bg-zinc-900
                p-5
                h-fit
            "
        >

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

                    <MdAttachMoney
                        size={21}
                        className="text-orange-400"
                    />

                </div>


                <div>

                    <h2
                        className="
                            text-base
                            font-semibold
                            text-zinc-100
                        "
                    >
                        Payment
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                        {isPaid
                            ? "Payment completed"
                            : "Payment is pending"
                        }
                    </p>

                </div>

            </div>


            {/* AMOUNT */}

            <div
                className="
                    mt-6
                    rounded-xl
                    bg-zinc-800
                    px-4
                    py-5
                    text-center
                "
            >

                <p className="text-xs text-zinc-400">
                    {isPaid
                        ? "Amount Paid"
                        : "Amount Due"
                    }
                </p>

                <p
                    className="
                        mt-2
                        text-3xl
                        font-bold
                        text-orange-400
                    "
                >
                    {formatCurrency(finalTotal)}
                </p>

            </div>


            {/* ACTION */}

            {!isPaid ? (

                <button
                    onClick={onCompletePayment}
                    className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-teal-700
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-teal-800
                    "
                >

                    <MdAttachMoney size={18} />

                    Complete Payment

                </button>

            ) : (

                <div className="mt-5 space-y-2.5">

                    <button
                        onClick={onDownloadPDF}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-orange-500
                            hover:bg-orange-600
                            active:scale-[0.99]
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            shadow-lg
                            shadow-orange-500/10
                            cursor-pointer
                        "
                    >

                        <FiDownload size={17} />

                        Download Bill PDF

                    </button>


                    <button
                        onClick={onPrintReceipt}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-zinc-800
                            border
                            border-zinc-700
                            hover:bg-zinc-750
                            hover:border-zinc-600
                            hover:text-white
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-zinc-200
                            transition
                            cursor-pointer
                        "
                    >

                        <FiPrinter size={17} />

                        Print Receipt

                    </button>

                </div>

            )}


            {/* PAYMENT DETAILS */}

            {isPaid && (

                <div className="mt-5 space-y-3">

                    <div className="flex justify-between">

                        <span className="text-xs text-zinc-500">
                            Payment Method
                        </span>

                        <span className="text-xs font-medium text-zinc-300">
                            {order.paymentMethod || "N/A"}
                        </span>

                    </div>


                    <div className="flex justify-between">

                        <span className="text-xs text-zinc-500">
                            Tip
                        </span>

                        <span className="text-xs font-medium text-zinc-300">
                            {formatCurrency(tip)}
                        </span>

                    </div>


                    <div className="flex justify-between">

                        <span className="text-xs text-zinc-500">
                            Paid At
                        </span>

                        <span className="text-xs font-medium text-zinc-300">
                            {formatTime(order.paidAt)}
                        </span>

                    </div>

                </div>

            )}

        </div>

    );

}


// ============================================================
// MAIN PAGE
// ============================================================

function BillDetails() {

    const { orderId } = useParams();

    const navigate = useNavigate();


    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchOrder = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getOrderById(orderId);

            setOrder(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Failed to fetch bill details:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load bill details"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchOrder();

    }, [orderId]);


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div
                className="
                    flex
                    h-[calc(100vh-3.5rem)]
                    items-center
                    justify-center
                    bg-zinc-800
                "
            >

                <p className="text-sm text-zinc-400">
                    Loading bill...
                </p>

            </div>

        );

    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error || !order) {

        return (

            <div
                className="
                    flex
                    h-[calc(100vh-3.5rem)]
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    bg-zinc-800
                "
            >

                <p className="text-sm text-red-400">
                    {error || "Bill not found"}
                </p>


                <button
                    onClick={() => navigate("/billing")}
                    className="
                        rounded-lg
                        border
                        border-zinc-700
                        px-4
                        py-2
                        text-sm
                        text-zinc-300
                        transition
                        hover:bg-zinc-900
                    "
                >
                    Back to Billing
                </button>

            </div>

        );

    }


    // ========================================================
    // ACTIONS
    // ========================================================

    const handleCompletePayment = () => {

        navigate(`/orders/${orderId}/payment`);

    };


    const handleDownloadPDF = () => {

        if (!order) return;
        generateReceiptPDF(order);

    };


    const handlePrintReceipt = () => {

        window.print();

    };


    // ========================================================
    // MAIN UI
    // ========================================================

    return (

        <section
            className="
                flex
                h-[calc(100vh-3.5rem)]
                flex-col
                overflow-hidden
                bg-zinc-800
            "
        >

            {/* HEADER */}

            <div
                className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-zinc-700
                    px-6
                    py-4
                "
            >

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate("/billing")}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            text-zinc-400
                            transition
                            hover:bg-zinc-900
                            hover:text-white
                        "
                    >

                        <FiArrowLeft size={19} />

                    </button>


                    <div>

                        <h1
                            className="
                                text-xl
                                font-semibold
                                text-white
                            "
                        >
                            Bill Details
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-zinc-500
                            "
                        >
                            Order #{order.orderNumber}
                            {" • "}
                            {formatDate(order.createdAt)}
                        </p>

                    </div>

                </div>


                <div className="flex items-center gap-3">

                    {order.status === "COMPLETED" && (
                        <button
                            onClick={handleDownloadPDF}
                            className="
                                hidden
                                sm:flex
                                items-center
                                gap-1.5
                                rounded-lg
                                bg-orange-500/15
                                hover:bg-orange-500/25
                                text-orange-400
                                border
                                border-orange-500/30
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                transition
                                cursor-pointer
                            "
                        >
                            <FiDownload size={14} />
                            <span>Download PDF</span>
                        </button>
                    )}

                    <span
                        className={`
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-semibold

                            ${
                                order.status === "COMPLETED"
                                    ? "bg-green-500/15 text-green-400"
                                    : "bg-orange-500/15 text-orange-400"
                            }
                        `}
                    >
                        {order.status === "COMPLETED"
                            ? "Paid"
                            : "Payment Pending"
                        }
                    </span>

                </div>

            </div>


            {/* CONTENT */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-6
                    py-5
                "
            >

                <div
                    className="
                        mx-auto
                        grid
                        max-w-375
                        grid-cols-1
                        gap-5
                        xl:grid-cols-[1fr_320px]
                    "
                >

                    <BillReceipt
                        order={order}
                    />


                    <PaymentPanel
                        order={order}
                        onCompletePayment={handleCompletePayment}
                        onPrintReceipt={handlePrintReceipt}
                        onDownloadPDF={handleDownloadPDF}
                    />

                </div>

            </div>

            {/* PRINT STYLES */}
            <style>{`
                @media print {
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                    }
                    header, aside, nav, button, .no-print {
                        display: none !important;
                    }
                    #bill-receipt-printable {
                        border: 1px solid #e4e4e7 !important;
                        background: #ffffff !important;
                        color: #09090b !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        border-radius: 0 !important;
                    }
                    #bill-receipt-printable * {
                        color: #09090b !important;
                        border-color: #e4e4e7 !important;
                        background-color: transparent !important;
                    }
                }
            `}</style>

        </section>

    );

}


export default BillDetails;