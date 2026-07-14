import { useState } from "react";
import OrderItem from "./OrderItem";

function BillContainer() {

    const [payment, setPayment] = useState("cash");

    const order = [
        {
            id: 1,
            name: "Chicken Tikka",
            quantity: 2,
            price: 123,
        },
        {
            id: 2,
            name: "Butter Chicken",
            quantity: 1,
            price: 340,
        },
        {
            id: 3,
            name: "Paneer Tikka",
            quantity: 3,
            price: 250,
        },
    ];

    const items = order.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = order.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const tax = Math.round(subtotal * 0.0525);

    const total = subtotal + tax;

    return (
        <div className="bg-zinc-900 rounded-2xl h-full p-4 flex flex-col">

            {/* Customer */}

            <div className="flex justify-between items-center pb-4 border-b border-zinc-700">

                <div>
                    <h2 className="text-zinc-100 text-md font-semibold">Customer Name</h2>

                    <p className="text-zinc-400 text-sm mt-1">#01 / Dine In </p>

                    <p className="text-zinc-500 text-xs mt-1">January 19, 2025 05:34 PM</p>
                </div>

                <div className="h-14 w-14 rounded-xl bg-amber-400 flex items-center justify-center font-bold text-2xl">CN</div>

            </div>

            {/* Heading */}

            <h2 className="text-zinc-200 text-lg font-semibold mt-2">Order Details</h2>

            {/* Orders */}

            <div className="flex-1 overflow-y-auto space-y-3 mt-2 pr-1">

                {order.map((item) => (
                    <OrderItem
                        key={item.id}
                        item={item}
                    />
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

                <div className="grid grid-cols-2 gap-3 mt-3">

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

                </div>

                {/* Buttons */}

                <div className="grid grid-cols-2 gap-3 mt-3">

                    <button className="bg-blue-600 hover:bg-blue-500 rounded-md py-1.5 text-white font-semibold transition">Print Receipt</button>
                    <button className="bg-amber-400 hover:bg-amber-300 rounded-md py-1.5 text-zinc-900 font-bold transition">Place Order</button>

                </div>

            </div>

        </div>
    );
}

export default BillContainer;