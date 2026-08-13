import { useEffect, useState } from "react";

import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/cartSlice";

import { getMenuItems } from "../../api/menu.api";


function MenuContainer() {

    const dispatch = useDispatch();

    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const [selectedItems, setSelectedItems] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Fetch menu
    useEffect(() => {

        const fetchMenu = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getMenuItems();

                console.log("Menu response:", response.data);

                setMenuItems(response.data.data || []);

            } catch (error) {

                console.error("Failed to fetch menu:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load menu"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchMenu();

    }, []);


    // Categories from API response
    const categories = [
        "ALL",
        ...new Set(
            menuItems.map((item) => item.category)
        ),
    ];


    // Filter items
    const filteredItems =
        selectedCategory === "ALL"
            ? menuItems
            : menuItems.filter(
                (item) => item.category === selectedCategory
            );


    // Increase selected quantity
    const increment = (id) => {

        setSelectedItems((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));

    };


    // Decrease selected quantity
    const decrement = (id) => {

        setSelectedItems((prev) => ({
            ...prev,
            [id]: Math.max(
                (prev[id] || 0) - 1,
                0
            ),
        }));

    };


    // Add item to current KOT/cart
    const addToCart = (item) => {

        const quantity = selectedItems[item._id] || 0;

        if (quantity === 0) return;

        dispatch(
            addItem({
                id: item._id,
                name: item.name,
                price: item.price,
                quantity,
                category: item.category,
            })
        );


        // Reset selected quantity
        setSelectedItems((prev) => ({
            ...prev,
            [item._id]: 0,
        }));

    };


    // Loading
    if (loading) {

        return (
            <div className="
                h-full
                flex
                items-center
                justify-center
                text-zinc-400
            ">
                Loading menu...
            </div>
        );

    }


    // Error
    if (error) {

        return (
            <div className="
                h-full
                flex
                items-center
                justify-center
                text-red-400
            ">
                {error}
            </div>
        );

    }


    return (

        <div className="
            h-[85%]
            flex
            flex-col
            mx-5
        ">

            <div className="
                border-b
                border-zinc-700
                mb-3
            " />

            {/* Categories */}

            <div className="
                flex
                gap-3
                overflow-x-auto
            ">

                {categories.map((category) => {

                    const active = selectedCategory === category;


                    return (

                        <button
                            key={category}
                            onClick={() =>
                                setSelectedCategory(category)
                            }
                            className={`
                                px-5
                                py-2.5
                                rounded-xl
                                text-sm
                                font-semibold
                                whitespace-nowrap
                                transition-all
                                duration-200

                                ${
                                    active
                                        ? `
                                            bg-orange-500
                                            text-white
                                            shadow-[0_0_15px_rgba(249,115,22,0.25)]
                                        `
                                        : `
                                            bg-zinc-900
                                            text-zinc-400
                                            border
                                            border-zinc-800
                                            hover:text-zinc-200
                                            hover:border-orange-500/40
                                        `
                                }
                            `}
                        >
                            {category
                                .replaceAll("_", " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                )}
                        </button>

                    );

                })}

            </div>


            <div className="
                border-b
                border-zinc-700
                my-3
            " />


            {/* Menu Items */}

            <div className="
                flex
                flex-col
                overflow-y-auto
                pr-2
                w-full
                mx-auto
            ">

                {filteredItems.length === 0 && (

                    <div className="
                        flex
                        justify-center
                        items-center
                        h-40
                        text-zinc-500
                    ">
                        No menu items found.
                    </div>

                )}


                {filteredItems.map((item) => (

                    <div
                        key={item._id}
                        className="
                            flex
                            items-center
                            justify-between
                            mb-2
                            bg-zinc-900
                            border
                            border-zinc-800
                            rounded-xl
                            px-3
                            py-2
                            hover:border-orange-400/60
                            transition-all
                            duration-200
                        "
                    >

                        {/* Left */}

                        <div className="
                            flex
                            items-center
                            gap-4
                        ">

                            <div className="
                                w-3
                                h-3
                                rounded-full
                                bg-sky-700"
                            />

                            <div className="w-60">

                                <h2 className="
                                    text-lg
                                    font-semibold
                                    text-zinc-100
                                ">
                                    {item.name}
                                </h2>

                                {item.description && (

                                    <p className="
                                        text-xs
                                        text-zinc-500
                                        mt-0.5
                                    ">
                                        {item.description}
                                    </p>

                                )}

                            </div>


                            <div>

                                <p className="
                                    text-orange-400
                                    font-semibold
                                ">
                                    ₹{item.price}
                                </p>

                            </div>

                        </div>


                        {/* Right */}

                        <div className="
                            flex
                            items-center
                            gap-4
                        ">

                            {/* Quantity */}

                            <div className="w-30">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-lg
                                    py-2
                                    px-4
                                    bg-zinc-800
                                ">

                                    <button
                                        className="
                                            text-amber-300
                                            hover:text-amber-500
                                            duration-200
                                        "
                                        onClick={() =>
                                            decrement(item._id)
                                        }
                                    >
                                        <FaMinus size={18} />
                                    </button>


                                    <span className="
                                        text-lg
                                        text-zinc-300
                                        font-semibold
                                        px-3
                                    ">
                                        {selectedItems[item._id] || 0}
                                    </span>


                                    <button
                                        className="
                                            text-amber-300
                                            hover:text-amber-500
                                            duration-200
                                        "
                                        onClick={() =>
                                            increment(item._id)
                                        }
                                    >
                                        <FaPlus size={18} />
                                    </button>

                                </div>

                            </div>


                            {/* Add to cart */}

                            <button
                                className="
                                    ml-5
                                    h-10
                                    w-10
                                    rounded-lg
                                    bg-green-600
                                    hover:bg-green-500
                                    transition
                                "
                                onClick={() =>
                                    addToCart(item)
                                }
                            >
                                <FaShoppingCart
                                    className="m-auto text-zinc-200"
                                    size={22}
                                />
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}


export default MenuContainer;