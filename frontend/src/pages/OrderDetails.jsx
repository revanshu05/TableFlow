import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../redux/slices/customerSlice";

import EditKotForm from "../components/Orders/EditKotForm";

import {
    FiArrowLeft,
    FiUser,
    FiPhone,
    FiUsers,
    FiMapPin,
    FiClock,
    FiFileText,
    FiPlus,
    FiSend,
    FiEdit3,
    FiEye,
} from "react-icons/fi";

import { MdAttachMoney } from "react-icons/md";

import { IoRestaurantOutline } from "react-icons/io5";

import {
    getOrderById,
    getOrderKots,
    requestBill,
} from "../api/order.api";


// ============================================================
// HELPERS
// ============================================================

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


// ============================================================
// SUMMARY CARD
// ============================================================

function InfoCard({ title, icon: Icon, children }) {

    return (

        <div
            className="
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900/70
                p-5
            "
        >

            {/* Header */}

            <div className="flex items-center gap-3 mb-5">

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

                    <Icon
                        size={18}
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
                    {title}
                </h2>

            </div>


            {children}

        </div>

    );

}


// ============================================================
// INFO ROW
// ============================================================

function InfoRow({ icon: Icon, label, value }) {

    return (

        <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

                <Icon
                    size={16}
                    className="text-zinc-500"
                />

                <span className="text-sm text-zinc-500">
                    {label}
                </span>

            </div>


            <span
                className="
                    text-sm
                    font-medium
                    text-zinc-200
                    text-right
                "
            >
                {value || "N/A"}
            </span>

        </div>

    );

}


// ============================================================
// ORDER SUMMARY
// ============================================================

function OrderSummaryCards({ order }) {

    return (

        <div
            className="
                grid
                grid-cols-1
                gap-4
                lg:grid-cols-3
            "
        >

            {/* CUSTOMER */}

            <InfoCard
                title="Customer Info"
                icon={FiUser}
            >

                <div className="space-y-4">

                    <InfoRow
                        icon={FiUser}
                        label="Name"
                        value={order.customer?.name}
                    />

                    <InfoRow
                        icon={FiPhone}
                        label="Phone"
                        value={order.customer?.phone || "N/A"}
                    />

                    <InfoRow
                        icon={FiUsers}
                        label="Members"
                        value={order.customer?.members}
                    />

                </div>

            </InfoCard>


            {/* ORDER */}

            <InfoCard
                title="Order Info"
                icon={FiFileText}
            >

                <div className="space-y-4">

                    <InfoRow
                        icon={FiMapPin}
                        label="Table"
                        value={
                            order.table?.tableNo
                                ? `Table ${order.table.tableNo}`
                                : "N/A"
                        }
                    />

                    <InfoRow
                        icon={FiUser}
                        label="Waiter"
                        value={order.waiter?.name}
                    />

                    <InfoRow
                        icon={FiClock}
                        label="Time"
                        value={formatTime(order.createdAt)}
                    />

                    <InfoRow
                        icon={IoRestaurantOutline}
                        label="KOTs"
                        value={order.kotCount}
                    />

                </div>

            </InfoCard>


            {/* NOTES */}

            <InfoCard
                title="Notes"
                icon={FiFileText}
            >

                <div className="h-35 overflow-y-auto">

                    <p
                        className="
                            text-sm
                            leading-6
                            text-zinc-400
                        "
                    >
                        {order.notes || "No notes added"}
                    </p>

                </div>

            </InfoCard>

        </div>

    );

}


// ============================================================
// ORDER ITEMS
// ============================================================

function OrderItemsCard({ order }) {

    const items = order.items || [];

    return (

        <div
            className="
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900/70
                p-5
            "
        >

            {/* Header */}

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
                            size={18}
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
                        Items and Total
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


            {/* Column Header */}

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


            {/* Items */}

            <div>

                {items.map((item, index) => {

                    const amount =
                        item.quantity * item.unitPrice;

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

                            {/* Item */}

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-zinc-100
                                    "
                                >
                                    {item.name}
                                </p>

                            </div>


                            {/* Quantity */}

                            <span
                                className="
                                    text-right
                                    text-sm
                                    text-zinc-300
                                "
                            >
                                {item.quantity}
                            </span>


                            {/* Unit Price */}

                            <span
                                className="
                                    text-right
                                    text-sm
                                    text-zinc-300
                                "
                            >
                                ₹{item.unitPrice.toFixed(2)}
                            </span>


                            {/* Amount */}

                            <span
                                className="
                                    text-right
                                    text-sm
                                    font-medium
                                    text-zinc-100
                                "
                            >
                                ₹{amount.toFixed(2)}
                            </span>

                        </div>

                    );

                })}

            </div>


            {/* Totals */}

            <div
                className="
                    mt-5
                    ml-auto
                    w-full
                    max-w-75
                    space-y-3
                "
            >

                <div className="flex justify-between">

                    <span className="text-sm text-zinc-500">
                        Subtotal
                    </span>

                    <span className="text-sm text-zinc-300">
                        ₹{order.subtotal?.toFixed(2)}
                    </span>

                </div>


                <div className="flex justify-between">

                    <span className="text-sm text-zinc-500">
                        Tax
                    </span>

                    <span className="text-sm text-zinc-300">
                        ₹{order.tax?.toFixed(2)}
                    </span>

                </div>


                <div className="flex justify-between">

                    <span className="text-sm text-zinc-500">
                        Discount
                    </span>

                    <span className="text-sm text-zinc-300">
                        ₹{order.discount?.toFixed(2)}
                    </span>

                </div>


                <div
                    className="
                        border-t
                        border-zinc-700
                        pt-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <span
                        className="
                            text-base
                            font-semibold
                            text-zinc-100
                        "
                    >
                        Grand Total
                    </span>

                    <span
                        className="
                            text-xl
                            font-bold
                            text-orange-400
                        "
                    >
                        ₹{order.grandTotal?.toFixed(2)}
                    </span>

                </div>

            </div>

        </div>

    );

}


// ============================================================
// KOT CARD
// ============================================================

function KotsCard({ kots, onEdit }) {

    return (

        <div
            className="
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900/70
                p-5
            "
        >

            {/* Header */}

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

                        <IoRestaurantOutline
                            size={18}
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
                        Kitchen Tickets (KOTs)
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
                    {kots.length} KOTs
                </span>

            </div>


            {/* KOT List */}

            <div className="space-y-3">

                {kots.map((kot, index) => {

                    const canEdit = kot.status === "PENDING";

                    return (

                        <div
                            key={kot._id}
                            className="
                                rounded-xl
                                border
                                border-zinc-800
                                bg-zinc-950
                                p-4
                            "
                        >

                            {/* KOT Header */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <span
                                        className="
                                            text-base
                                            font-semibold
                                            text-zinc-100
                                        "
                                    >
                                        KOT #{kot.ticketNumber}
                                    </span>


                                    <span
                                        className="
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        {formatTime(kot.createdAt)}
                                    </span>

                                </div>


                                <span
                                    className={`
                                        rounded-full
                                        px-3
                                        py-1
                                        text-[11px]
                                        font-semibold

                                        ${
                                            kot.status === "READY"
                                                ? "bg-green-500/15 text-green-400"
                                                : kot.status === "PREPARING"
                                                    ? "bg-blue-500/15 text-blue-400"
                                                    : "bg-orange-500/15 text-orange-400"
                                        }
                                    `}
                                >
                                    {kot.status}
                                </span>

                            </div>


                            {/* Items */}

                            <div className="mt-4 space-y-2">

                                {(kot.items || []).map(
                                    (item, itemIndex) => (

                                        <div
                                            key={itemIndex}
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                text-sm
                                            "
                                        >

                                            <span className="text-zinc-400">

                                                <span className="mr-2 text-orange-400">
                                                    •
                                                </span>

                                                {item.name}

                                            </span>


                                            <span className="text-zinc-500">
                                                × {item.quantity}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>


                            {/* Edit */}

                            {canEdit && (

                                <button
                                    onClick={() => onEdit(kot)}
                                    className="
                                        mt-4
                                        ml-auto
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-blue-400
                                        transition
                                        hover:text-blue-300
                                    "
                                >

                                    <FiEdit3 size={14} />

                                    Edit KOT

                                </button>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>

    );

}


// ============================================================
// MAIN PAGE
// ============================================================

function OrderDetails() {

    const { orderId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(
        (state) => state.auth.user
    );


    const [order, setOrder] = useState(null);
    const [kots, setKots] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [requestingBill, setRequestingBill] = useState(false);

    const [selectedKot, setSelectedKot] = useState(null);
    const [showEditKotModal, setShowEditKotModal] = useState(false);

    // ========================================================
    // FETCH DATA
    // ========================================================

    const fetchOrderData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                orderResponse,
                kotsResponse,
            ] = await Promise.all([
                getOrderById(orderId),
                getOrderKots(orderId),
            ]);


            setOrder(
                orderResponse.data.data
            );

            setKots(
                kotsResponse.data.data || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch order details:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load order details"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchOrderData();

    }, [orderId]);


    // Add Kot

    const handleAddKot = () => {

        dispatch(setCustomer({
            name: order.customer.name,
            phone: order.customer.phone,
            members: order.customer.members,
            orderType: order.orderType,
            orderId: order._id,
        }));

        navigate("/menu");
    };

    
    // Edit Kot

    const handleEditKot = (kot) => {
        setSelectedKot(kot);
        setShowEditKotModal(true);
    };


    // REQUEST BILL

    const handleRequestBill = async () => {

        try {

            setRequestingBill(true);
            setError("");

            await requestBill(orderId);

            await fetchOrderData();

        } catch (error) {

            console.error(
                "Failed to request bill:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to request bill"
            );

        } finally {

            setRequestingBill(false);

        }

    };


    // LOADING

    if (loading) {

        return (

            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-center
                    bg-zinc-800
                "
            >

                <p className="text-sm text-zinc-400">
                    Loading order...
                </p>

            </div>

        );

    }


    // ERROR

    if (error || !order) {

        return (

            <div
                className="
                    flex
                    h-full
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    bg-zinc-800
                "
            >

                <p className="text-sm text-red-400">
                    {error || "Order not found"}
                </p>


                <button
                    onClick={() => navigate("/orders")}
                    className="
                        rounded-lg
                        border
                        border-zinc-700
                        px-4
                        py-2
                        text-sm
                        text-zinc-300
                        hover:bg-zinc-800
                    "
                >
                    Back to Orders
                </button>

            </div>

        );

    }


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

            {/* PAGE HEADER */}

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

                {/* LEFT */}

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate("/orders")}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-zinc-700
                            bg-zinc-950
                            text-zinc-400
                            transition
                            hover:bg-zinc-900
                            hover:text-white
                        "
                    >

                        <FiArrowLeft size={19} />

                    </button>


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

                        <div className="flex items-center gap-2">

                            <h1
                                className="
                                    text-xl
                                    font-semibold
                                    text-white
                                "
                            >
                                Order #{order.orderNumber}
                            </h1>


                            <span
                                className={`
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold

                                    ${
                                        order.status === "OPEN"
                                            ? "bg-orange-500/15 text-orange-400"
                                            : order.status === "PAYMENT_PENDING"
                                                ? "bg-blue-500/15 text-blue-400"
                                                : "bg-green-500/15 text-green-400"
                                    }
                                `}
                            >
                                {order.status === "PAYMENT_PENDING"
                                    ? "Payment Pending"
                                    : order.status
                                }
                            </span>

                        </div>


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


                {/* RIGHT ACTIONS */}

                <div className="flex items-center gap-3">

                    {/* NEW KOT */}

                    {["admin", "waiter"].includes(user?.role) &&
                        order.status === "OPEN" && (

                            <button
                                onClick={handleAddKot}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-orange-700
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-orange-800
                                    hover:text-white
                                    cursor-pointer
                                "
                            >

                                <FiPlus size={17} />

                                New KOT

                            </button>

                        )}


                    {/* REQUEST BILL */}

                    {["admin", "waiter"].includes(user?.role) &&
                        order.status === "OPEN" && (

                            <button
                                onClick={handleRequestBill}
                                disabled={requestingBill}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-blue-500
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-600
                                    cursor-pointer
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                <FiSend size={16} />

                                {requestingBill
                                    ? "Requesting..."
                                    : "Request Bill"
                                }

                            </button>

                        )}


                    {/* Complete Payment */}

                    {["admin", "waiter", "cashier"].includes(user?.role) &&
                        order.status === "PAYMENT_PENDING" && (

                            <button
                                onClick={() => navigate(`/orders/${orderId}/payment`)}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-teal-700
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-teal-800
                                    cursor-pointer
                                "
                            >

                                <MdAttachMoney  size={18} />

                                Complete Payment

                            </button>

                        )}

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div
                    className="
                        mx-6
                        mt-4
                        shrink-0
                        rounded-lg
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        text-red-400
                    "
                >
                    {error}
                </div>

            )}


            {/* PAGE CONTENT */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-6
                    py-5
                "
            >

                <div className="mx-auto max-w-375 space-y-5">

                    {/* TOP THREE CARDS */}

                    <OrderSummaryCards
                        order={order}
                    />


                    {/* ITEMS + KOTS */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            xl:grid-cols-[1.15fr_0.85fr]
                        "
                    >

                        <OrderItemsCard
                            order={order}
                        />


                        <KotsCard
                            kots={kots}
                            onEdit={handleEditKot}
                        />

                    </div>

                </div>

            </div>

            <EditKotForm
                isOpen={showEditKotModal}
                onClose={() => {
                    setShowEditKotModal(false);
                    setSelectedKot(null);
                }}
                ticket={selectedKot}
                onUpdated={fetchOrderData}
            />

        </section>

    );

}


export default OrderDetails;