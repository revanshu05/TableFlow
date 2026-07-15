import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaLinesLeaning } from "react-icons/fa6";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  Utils                                                              */
/* ------------------------------------------------------------------ */

// Deterministic pastel-on-dark avatar color, derived from initials.
function getAvatarColor(initials = "") {
    const palette = [
        "bg-orange-500/20 text-orange-300",
        "bg-emerald-500/20 text-emerald-300",
        "bg-sky-500/20 text-sky-300",
        "bg-fuchsia-500/20 text-fuchsia-300",
        "bg-amber-500/20 text-amber-300",
        "bg-rose-500/20 text-rose-300",
    ];
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
        hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
}

/* ------------------------------------------------------------------ */
/*  Sample data (stand-in for ../../constants)                        */
/* ------------------------------------------------------------------ */

const menus = {
    starters: {
        id: "starters",
        name: "Starters",
        image:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=60",
        items: [
            { id: 101, name: "Chicken Tikka", price: 123, isVeg: false },
            { id: 102, name: "Paneer Tikka", price: 250, isVeg: true },
            { id: 103, name: "Veg Spring Roll", price: 180, isVeg: true },
        ],
    },
    mains: {
        id: "mains",
        name: "Main Course",
        image:
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=60",
        items: [
            { id: 201, name: "Butter Chicken", price: 340, isVeg: false },
            { id: 202, name: "Dal Makhani", price: 220, isVeg: true },
            { id: 203, name: "Paneer Butter Masala", price: 280, isVeg: true },
        ],
    },
    breads: {
        id: "breads",
        name: "Breads",
        image:
            "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&auto=format&fit=crop&q=60",
        items: [
            { id: 301, name: "Butter Naan", price: 45, isVeg: true },
            { id: 302, name: "Garlic Naan", price: 55, isVeg: true },
        ],
    },
    beverages: {
        id: "beverages",
        name: "Beverages",
        image:
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=60",
        items: [
            { id: 401, name: "Masala Chaas", price: 60, isVeg: true },
            { id: 402, name: "Sweet Lassi", price: 80, isVeg: true },
        ],
    },
};

/* ------------------------------------------------------------------ */
/*  BackButton                                                         */
/* ------------------------------------------------------------------ */

function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="bg-[#025cca] p-1 text-xl font-bold rounded-full text-white hover:scale-110 transition"
        >
            <IoArrowBackOutline size={22} />
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  OrderItem (row shown inside the bill)                              */
/* ------------------------------------------------------------------ */

function OrderItem({ item }) {
    return (
        <div className="flex items-center justify-between bg-zinc-800/60 rounded-lg px-3 py-2">
            <div>
                <h3 className="text-zinc-100 text-sm font-semibold">{item.name}</h3>
                <p className="text-zinc-500 text-xs mt-0.5">
                    ₹{item.price} x {item.quantity}
                </p>
            </div>
            <span className="text-zinc-200 text-sm font-bold">
                ₹{item.price * item.quantity}
            </span>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  BillContainer                                                      */
/* ------------------------------------------------------------------ */

function BillContainer() {
    const [payment, setPayment] = useState("cash");

    const order = [
        { id: 1, name: "Chicken Tikka", quantity: 2, price: 123 },
        { id: 2, name: "Butter Chicken", quantity: 1, price: 340 },
        { id: 3, name: "Paneer Tikka", quantity: 3, price: 250 },
    ];

    const items = order.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.0525);
    const total = subtotal + tax;

    return (
        <div className="bg-zinc-900 rounded-2xl h-full p-4 flex flex-col">
            {/* Customer */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-700">
                <div>
                    <h2 className="text-zinc-100 text-md font-semibold">Customer Name</h2>
                    <p className="text-zinc-400 text-sm mt-1">#01 / Dine In</p>
                    <p className="text-zinc-500 text-xs mt-1">January 19, 2025 05:34 PM</p>
                </div>
                <div
                    className={`h-14 w-14 rounded-xl flex items-center justify-center font-bold text-2xl ${getAvatarColor(
                        "CN"
                    )}`}
                >
                    CN
                </div>
            </div>

            {/* Heading */}
            <h2 className="text-zinc-200 text-lg font-semibold mt-2">Order Details</h2>

            {/* Orders */}
            <div className="flex-1 overflow-y-auto space-y-3 mt-2 pr-1">
                {order.map((item) => (
                    <OrderItem key={item.id} item={item} />
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

                {/* Payment toggle */}
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
                <div className="flex mt-3">
                    <button className="mx-auto px-10 bg-amber-400 hover:bg-amber-300 rounded-md py-1.5 text-zinc-900 font-bold transition">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  MenuContainer                                                      */
/* ------------------------------------------------------------------ */

function MenuContainer() {
    const menuList = Object.values(menus);

    const [selectedMenu, setSelectedMenu] = useState(menuList[0]);
    const [itemCount, setItemCount] = useState(0);
    const [itemId, setItemId] = useState();

    const increment = (id) => {
        setItemId(id);
        if (itemCount >= 5) return;
        setItemCount((prev) => (id === itemId ? prev + 1 : 1));
    };

    const decrement = (id) => {
        setItemId(id);
        if (itemCount <= 0) return;
        setItemCount((prev) => (id === itemId ? prev - 1 : 0));
    };

    return (
        <div className="h-[85%] flex flex-col m-4 pt-2">
            {/* Menu Categories */}
            <div className="grid grid-cols-4 gap-5">
                {menuList.map((menu) => {
                    const active = selectedMenu.id === menu.id;

                    return (
                        <div
                            key={menu.id}
                            onClick={() => {
                                setSelectedMenu(menu);
                                setItemId(0);
                                setItemCount(0);
                            }}
                            className={`relative h-22 overflow-hidden rounded-xl cursor-pointer transition-all duration-300 bg-zinc-900 border border-zinc-800
                            ${
                                active
                                    ? "border-orange-400 shadow-[0_0_15px_rgba(251,146,60,.8)]"
                                    : "hover:scale-[1.02]"
                            }`}
                        >
                            {/* Left Content */}
                            <div className="relative z-10 flex flex-col justify-between h-full p-4 w-[65%]">
                                <div>
                                    <h2
                                        className={`${
                                            active ? "text-orange-400" : "text-white"
                                        } text-lg font-semibold`}
                                    >
                                        {menu.name}
                                    </h2>
                                    <p className="text-sm text-zinc-400 mt-1">
                                        {menu.items.length} Items
                                    </p>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div
                                className="absolute top-0 right-0 h-full w-[45%]"
                                style={{
                                    clipPath: "polygon(30% 0%,100% 0%,100% 100%,0% 100%)",
                                }}
                            >
                                <img
                                    src={menu.image}
                                    alt={menu.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-b border-zinc-700 my-5"></div>

            {/* Menu Items */}
            <div className="flex flex-col overflow-y-auto pr-2 w-200 mx-auto">
                {selectedMenu.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between mb-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 hover:border-orange-400 transition-all duration-200"
                    >
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    item.isVeg ? "bg-green-500" : "bg-red-500"
                                }`}
                            ></div>

                            <div className="w-60">
                                <h2 className="text-lg font-semibold text-zinc-100">
                                    {item.name}
                                </h2>
                            </div>

                            <div>
                                <p className="text-orange-400 font-semibold">₹{item.price}</p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4">
                            {/* Quantity */}
                            <div className="w-30">
                                <div className="flex items-center justify-between rounded-lg py-2 px-4 bg-zinc-800">
                                    <button
                                        className="text-amber-300 hover:text-amber-500 duration-200"
                                        onClick={() => decrement(item.id)}
                                    >
                                        <FaMinus size={18} />
                                    </button>

                                    <span className="text-lg text-zinc-300 font-semibold px-3">
                                        {item.id === itemId ? itemCount : "0"}
                                    </span>

                                    <button
                                        className="text-amber-300 hover:text-amber-500 duration-200"
                                        onClick={() => increment(item.id)}
                                    >
                                        <FaPlus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Add to cart */}
                            <button
                                className="ml-5 h-10 w-10 rounded-lg bg-green-600 hover:bg-green-500 transition"
                                onClick={() => setItemCount(0)}
                            >
                                <FaShoppingCart className="m-auto text-zinc-200" size={22} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Menu (page)                                                        */
/* ------------------------------------------------------------------ */

function More() {
    return (
        <section className="bg-zinc-800 h-[calc(100vh-6.5rem)] overflow-hidden flex">
            {/* Left Container */}
            <div className="flex-3/4 bg-zinc-800 h-full ml-1">
                {/* TOP */}
                <div className="flex items-center justify-between m-4">
                    <div className="flex items-center gap-4">
                        <BackButton />
                        <h1 className="text-2xl font-semibold text-zinc-200">Menu</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaLinesLeaning size={40} className="text-orange-300 mt-2" />
                        <div>
                            <h1 className="text-zinc-200 text-lg font-semibold">
                                Customer Name
                            </h1>
                            <p className="text-zinc-400 text-sm font-normal">Table No: 01</p>
                        </div>
                    </div>
                </div>

                <MenuContainer />
            </div>

            {/* Right Container */}
            <div className="my-4 mr-4 ml-1 rounded-2xl flex-1/4 bg-zinc-900 h-149">
                <BillContainer />
            </div>
        </section>
    );
}

export default More;