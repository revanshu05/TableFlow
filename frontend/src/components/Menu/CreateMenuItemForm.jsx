import { useState } from "react";

import Modal from "../shared/Modal";
import { createMenuItem } from "../../api/menu.api";


const categories = [
    "STARTER",
    "MAIN_COURSE",
    "BEVERAGE",
    "SOUP",
    "DESSERT",
    "PIZZA",
    "DRINK",
    "SALAD",
];


function CreateMenuItemForm({
    isOpen,
    onClose,
    onMenuItemCreated,
}) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const resetForm = () => {

        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setError("");

    };


    const handleClose = () => {

        if (loading) return;

        resetForm();
        onClose();

    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");


        if (!name.trim()) {
            setError("Menu item name is required");
            return;
        }


        if (!category) {
            setError("Category is required");
            return;
        }


        if (price === "") {
            setError("Price is required");
            return;
        }


        if (Number(price) <= 0) {
            setError("Price must be greater than 0");
            return;
        }


        try {

            setLoading(true);


            await createMenuItem({
                name: name.trim(),
                description: description.trim(),
                category,
                price: Number(price),
            });


            resetForm();

            onClose();

        } catch (error) {

            console.error(
                "Failed to create menu item:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create menu item"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <Modal
            title="Add New Menu Item"
            isOpen={isOpen}
            onClose={handleClose}
        >

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* Name */}

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        text-zinc-400
                    ">
                        Item Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter item name"
                        className="
                            w-full
                            rounded-lg
                            border
                            border-zinc-700
                            bg-zinc-900
                            px-4
                            py-2.5
                            text-zinc-200
                            outline-none
                            placeholder:text-zinc-600
                            focus:border-orange-500/60
                        "
                    />

                </div>


                {/* Description */}

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        text-zinc-400
                    ">
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Enter item description"
                        rows={3}
                        className="
                            w-full
                            resize-none
                            rounded-lg
                            border
                            border-zinc-700
                            bg-zinc-900
                            px-4
                            py-2.5
                            text-zinc-200
                            outline-none
                            placeholder:text-zinc-600
                            focus:border-orange-500/60
                        "
                    />

                </div>


                {/* Category */}

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        text-zinc-400
                    ">
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-zinc-700
                            bg-zinc-900
                            px-4
                            py-2.5
                            text-zinc-200
                            outline-none
                            focus:border-orange-500/60
                        "
                    >

                        <option value="">
                            Select category
                        </option>

                        {categories.map((category) => (

                            <option
                                key={category}
                                value={category}
                            >
                                {category
                                    .replaceAll("_", " ")
                                    .toLowerCase()
                                    .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                    )}
                            </option>

                        ))}

                    </select>

                </div>


                {/* Price */}

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        text-zinc-400
                    ">
                        Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value)
                        }
                        placeholder="Enter price"
                        className="
                            w-full
                            rounded-lg
                            border
                            border-zinc-700
                            bg-zinc-900
                            px-4
                            py-2.5
                            text-zinc-200
                            outline-none
                            placeholder:text-zinc-600
                            focus:border-orange-500/60
                        "
                    />

                </div>


                {/* Error */}

                {error && (

                    <div className="
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


                {/* Actions */}

                <div className="
                    flex
                    justify-center
                    gap-3
                    pt-2
                ">

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            rounded-lg
                            bg-orange-500
                            px-4
                            py-2
                            font-medium
                            text-white
                            transition
                            hover:bg-orange-400
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Creating..."
                            : "Create Item"
                        }
                    </button>

                </div>

            </form>

        </Modal>

    );

}


export default CreateMenuItemForm;