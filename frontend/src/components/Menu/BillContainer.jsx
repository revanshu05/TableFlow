import { useState } from "react";
import OrderItem from "./OrderItem";
import { formatDate, getAvatarColor, getAvatarName } from "../../utils";
import { useSelector } from "react-redux";

function BillContainer() {
    
    const customerData = useSelector((state) => state.customer);
    const order = useSelector((state) => state.cart.items);

    const [payment, setPayment] = useState("cash");

    const items = order.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const tax = Math.round(subtotal * 0.0525);

    const total = subtotal + tax;

    return (
        <div className="bg-zinc-900 rounded-2xl h-full p-4 flex flex-col">

            {/* Customer */}

            <div className="flex justify-between items-center pb-4 border-b border-zinc-700">

                <div>
                    <h2 className="text-zinc-100 text-md font-semibold">{customerData.customerName || "Customer Name"}</h2>
                    <p className="text-zinc-400 text-sm font-medium mt-0.5">{customerData.orderId || "N/A"} / <span>{customerData.orderType}</span> </p>
                    <p className="text-zinc-500 text-xs font font-medium mt-0.5">{formatDate(new Date())}</p>
                </div>

                <div className={`h-14 w-14 rounded-xl flex items-center justify-center font-bold text-2xl ${getAvatarColor(customerData.customerName || "Customer Name")}`}>{getAvatarName(customerData.customerName || "Customer Name")}</div>

            </div>

            {/* Heading */}

            <h2 className="text-zinc-200 text-lg font-semibold mt-2">Order Details</h2>

            {/* Orders */}

            <div className="flex-1 overflow-y-auto space-y-3 mt-2 pr-1">

                {order.lenght === 0 ? (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                        No items added</div>
                ) : ( order.map((item) => (
                    <OrderItem
                        key={item.id}
                        item={item}
                    />)
                ))}

            </div>

            {/* Bottom */}

            <div className="border-t border-zinc-700 pt-2">

                <div className="flex justify-between text-zinc-300 text-sm">
                    <span>Items ({items})</span>
                    <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-zinc-300 mt-1 text-sm">
                    <span>Tax (5.25%)</span>
                    <span>₹{tax}</span>
                </div>

                <div className="flex justify-between text-white text-md font-bold mt-2 border-t border-zinc-600 pt-1">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>

                {/* Payment */}

                {/* <div className="grid grid-cols-2 gap-3 mt-3">

                    <button
                        onClick={() => setPayment("cash")}
                        className={`rounded-md py-1.5 font-semibold transition ${
                            payment === "cash"
                                ? "bg-zinc-700 text-white"
                                : "bg-zinc-800 text-zinc-400"
                        }`}
                    >
                        Cash
                    </button>

                    <button
                        onClick={() => setPayment("online")}
                        className={`rounded-md py-1.5 font-semibold transition ${
                            payment === "online"
                                ? "bg-zinc-700 text-white"
                                : "bg-zinc-800 text-zinc-400"
                        }`}
                    >
                        Online
                    </button>

                </div> */}

                {/* Buttons */}

                <div className="flex mt-3">

                    {/*<button className="bg-blue-600 hover:bg-blue-500 rounded-md py-1.5 text-white font-semibold transition">Print Receipt</button> */}
                    <button className="mx-auto px-10 bg-amber-400 hover:bg-amber-300 rounded-md py-1.5 text-zinc-900 font-bold transition">Place Order</button>

                </div>

            </div>

        </div>
    );
}

export default BillContainer;