import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addItem, decreaseQuantity } from "../../redux/slices/cartSlice";
import { getMenuItems } from "../../api/menu.api";

function MenuContainer() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getMenuItems();
                setMenuItems(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch menu:", error);
                setError(error.response?.data?.message || "Failed to load menu");
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const categories = ["ALL", ...new Set(menuItems.map((item) => item.category))];

    const filteredItems =
        selectedCategory === "ALL"
            ? menuItems
            : menuItems.filter((item) => item.category === selectedCategory);

    const handleIncrement = (item) => {
        dispatch(
            addItem({
                id: item._id,
                name: item.name,
                price: item.price,
                quantity: 1,
                category: item.category,
            })
        );
    };

    const handleDecrement = (itemId) => {
        dispatch(decreaseQuantity(itemId));
    };

    const getItemQuantity = (itemId) => {
        const found = cartItems.find((i) => i.id === itemId);
        return found ? found.quantity : 0;
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col mx-3 sm:mx-5 animate-pulse">
                <div className="border-b border-zinc-700/60 mb-3" />

                <div className="flex gap-2.5 overflow-hidden py-2 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-9 w-24 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0" />
                    ))}
                </div>

                <div className="border-b border-zinc-700/60 my-3" />

                <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 sm:pr-2 flex-1 pb-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
                        >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                <div className="space-y-2 min-w-0 flex-1">
                                    <div className="h-4 w-40 rounded bg-zinc-700/70" />
                                    <div className="h-3 w-24 rounded bg-zinc-800" />
                                </div>
                            </div>
                            <div className="flex items-center gap-5 shrink-0">
                                <div className="w-20 flex justify-end">
                                    <div className="h-5 w-12 rounded bg-zinc-700/60" />
                                </div>
                                <div className="w-28 flex justify-end">
                                    <div className="h-10 w-28 rounded-lg bg-zinc-800" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center text-sm text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col mx-3 sm:mx-5">
            <div className="border-b border-zinc-700/60 mb-2" />

            <div className="flex gap-2 sm:gap-3 overflow-x-auto min-h-fit py-1 no-scrollbar shrink-0">
                {categories.map((category) => {
                    const active = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`
                                px-4 py-2 sm:px-5 sm:py-2.5
                                rounded-xl
                                text-xs sm:text-sm
                                font-semibold
                                whitespace-nowrap
                                transition-all
                                duration-200
                                ${
                                    active
                                        ? "bg-orange-500/70 text-white "
                                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-orange-500/40"
                                }
                            `}
                        >
                            {category
                                .replaceAll("_", " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </button>
                    );
                })}
            </div>

            <div className="border-b border-zinc-700/60 my-2" />

            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 sm:pr-2 flex-1 pb-4">
                {filteredItems.length === 0 && (
                    <div className="flex justify-center items-center h-40 text-zinc-500 text-sm">
                        No menu items found.
                    </div>
                )}

                {filteredItems.map((item) => {
                    const quantity = getItemQuantity(item._id);

                    return (
                        <div
                            key={item._id}
                            className="
                                flex
                                items-center
                                justify-between
                                bg-zinc-900
                                border
                                border-zinc-800
                                rounded-xl
                                px-4
                                py-3
                                hover:border-zinc-700/80
                                transition-colors
                            "
                        >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-400/80 shrink-0" />

                                <div className="min-w-0 flex-1">
                                    <h2 className="text-sm sm:text-base font-semibold text-zinc-100 truncate">
                                        {item.name}
                                    </h2>
                                    {item.description ? (
                                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                                            {item.description}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-zinc-600 truncate mt-0.5 capitalize">
                                            {item.category?.toLowerCase() || "item"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-5 shrink-0">
                                <div className="w-20 text-right">
                                    <span className="text-base sm:text-lg font-bold text-orange-400">
                                        ₹{item.price}
                                    </span>
                                </div>

                                <div className="w-28 flex justify-end">
                                    {quantity === 0 ? (
                                        <button
                                            onClick={() => handleIncrement(item)}
                                            className="
                                                h-10
                                                w-28
                                                flex
                                                items-center
                                                justify-center
                                                gap-1.5
                                                rounded-lg
                                                bg-zinc-800
                                                border
                                                border-zinc-700/60
                                                text-zinc-300
                                                text-xs
                                                font-semibold
                                                hover:bg-orange-500/30
                                                hover:text-white
                                                hover:border-orange-500/30
                                                active:scale-[0.97]
                                                transition-all
                                                duration-150
                                            "
                                        >
                                            <FaPlus size={11} />
                                            <span>Add</span>
                                        </button>
                                    ) : (
                                        <div className="h-10 w-28 flex items-center justify-between rounded-lg bg-zinc-800 border border-zinc-700/60 px-1.5 shadow-sm">
                                            <button
                                                className="h-7 w-7 flex items-center justify-center rounded text-orange-400 hover:bg-orange-500/30 hover:text-white transition active:scale-90"
                                                onClick={() => handleDecrement(item._id)}
                                            >
                                                <FaMinus size={11} />
                                            </button>

                                            <span className="text-sm font-bold text-white select-none">
                                                {quantity}
                                            </span>

                                            <button
                                                className="h-7 w-7 flex items-center justify-center rounded text-orange-400 hover:bg-orange-500/30 hover:text-white transition active:scale-90"
                                                onClick={() => handleIncrement(item)}
                                            >
                                                <FaPlus size={11} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MenuContainer;