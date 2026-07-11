const todaysSpecial = [
    {
        id: 1,
        name: "Paneer Tikka",
        category: "Starter",
        price: 299,
        available: true,
    },
    {
        id: 2,
        name: "Butter Chicken",
        category: "Main Course",
        price: 449,
        available: true,
    },
    {
        id: 3,
        name: "Veg Biryani",
        category: "Rice",
        price: 329,
        available: true,
    },
    {
        id: 4,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 399,
        available: false,
    },
    {
        id: 5,
        name: "Chocolate Brownie",
        category: "Dessert",
        price: 199,
        available: true,
    },
];

function TodaySpecial() {
    return (
        <div className="h-full p-5 flex flex-col">

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Today's Special</h2>
            </div>

            <div className="flex flex-col gap-6">

                {todaysSpecial.map((dish) => (
                    <div
                        key={dish.id}
                        className="flex items-center justify-between bg-zinc-800 
                            rounded-xl px-4 py-3">

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-zinc-700 border-2 border-zinc-600"></div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">{dish.name}</h3>

                                <p className="text-zinc-400 text-sm">{dish.category}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">

                            <span className="text-orange-400 font-bold text-lg">₹{dish.price}</span>
                            <span
                                className={`text-sm px-3 py-1 rounded-full ${
                                    dish.available
                                        ? "bg-green-700/20 text-green-400"
                                        : "bg-red-700/20 text-red-400"
                                }`}>
                                {dish.available ? "Available" : "Sold Out"}
                            </span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default TodaySpecial;