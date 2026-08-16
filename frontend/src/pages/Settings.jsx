import { useEffect, useState } from "react";
import {
    FiSettings,
    FiSave,
    FiLoader,
    FiMapPin,
    FiPhone,
    FiPercent,
    FiGrid,
    FiPlus,
    FiCheckCircle,
    FiMenu,
} from "react-icons/fi";

import {
    getRestaurantSettings,
    updateRestaurantSettings,
} from "../api/restaurant.api";

import CreateTableForm from "../components/Tables/CreateTableForm";
import CreateMenuItemForm from "../components/Menu/CreateMenuItemForm";


function Settings() {


    const [restaurantName, setRestaurantName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [taxPercentage, setTaxPercentage] = useState("");


    // UI STATE

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // MODALS

    const [showTableModal, setShowTableModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);


    // FETCH SETTINGS

    useEffect(() => {

        const fetchSettings = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getRestaurantSettings();

                const settings =
                    response.data.data;

                setRestaurantName(
                    settings.restaurantName || ""
                );

                setPhone(
                    settings.phone || ""
                );

                setAddress(
                    settings.address || ""
                );

                setTaxPercentage(
                    String(
                        settings.taxPercentage ?? 0
                    )
                );

            } catch (error) {

                console.error(
                    "Failed to fetch restaurant settings:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load settings"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchSettings();

    }, []);


    // SAVE SETTINGS

    const handleSaveSettings = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!restaurantName.trim()) {

            setError(
                "Restaurant name is required"
            );

            return;

        }


        if (taxPercentage === "") {

            setError(
                "Tax percentage is required"
            );

            return;

        }


        const tax = Number(taxPercentage);


        if (
            Number.isNaN(tax) ||
            tax < 0 ||
            tax > 100
        ) {

            setError(
                "Tax must be between 0 and 100"
            );

            return;

        }


        try {

            setSaving(true);


            const response =
                await updateRestaurantSettings({

                    restaurantName:
                        restaurantName.trim(),

                    phone:
                        phone.trim(),

                    address:
                        address.trim(),

                    taxPercentage: tax,

                });


            const settings =
                response.data.data;


            setRestaurantName(
                settings.restaurantName || ""
            );

            setPhone(
                settings.phone || ""
            );

            setAddress(
                settings.address || ""
            );

            setTaxPercentage(
                String(
                    settings.taxPercentage ?? 0
                )
            );


            setSuccess(
                "Settings saved successfully"
            );


        } catch (error) {

            console.error(
                "Failed to update restaurant settings:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save settings"
            );

        } finally {

            setSaving(false);

        }

    };


    // TABLE CREATED

    const handleTableCreated = () => {

        setSuccess(
            "Table created successfully"
        );

    };


    // MENU ITEM CREATED

    const handleMenuItemCreated = () => {

        setSuccess(
            "Menu item created successfully"
        );

    };


    // LOADING

    if (loading) {

        return (

            <section
                className="
                    flex
                    h-[calc(100vh-3.5rem)]
                    items-center
                    justify-center
                    bg-zinc-800
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-zinc-400
                    "
                >

                    <FiLoader
                        size={16}
                        className="animate-spin"
                    />

                    Loading settings...

                </div>

            </section>

        );

    }


    // MAIN UI

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

                        <FiSettings
                            size={19}
                            className="text-orange-400"
                        />

                    </div>


                    <div>

                        <h1
                            className="
                                text-lg
                                font-semibold
                                text-white
                            "
                        >
                            Settings
                        </h1>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-zinc-500
                            "
                        >
                            Manage your restaurant configuration
                        </p>

                    </div>

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
                        max-w-5xl
                        space-y-5
                    "
                >

                    {/* FEEDBACK */}

                    {error && (

                        <div
                            className="
                                rounded-xl
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


                    {success && (

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-green-500/20
                                bg-green-500/10
                                px-4
                                py-3
                                text-sm
                                text-green-400
                            "
                        >

                            <FiCheckCircle size={16} />

                            {success}

                        </div>

                    )}


                    {/* QUICK ACTIONS */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-900
                        "
                    >

                        <div
                            className="
                                border-b
                                border-zinc-800
                                px-5
                                py-4
                            "
                        >

                            <h2
                                className="
                                    text-sm
                                    font-semibold
                                    text-zinc-100
                                "
                            >
                                Quick Actions
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-zinc-500
                                "
                            >
                                Quickly add restaurant resources
                            </p>

                        </div>


                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                p-5
                                md:grid-cols-2
                            "
                        >

                            {/* Add Table */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-zinc-800/50
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-orange-500/10
                                        "
                                    >

                                        <FiGrid
                                            size={18}
                                            className="text-orange-400"
                                        />

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowTableModal(true)
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            bg-cyan-700
                                            px-3
                                            py-2
                                            text-xs
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-cyan-800
                                        "
                                    >

                                        <FiPlus size={14} />

                                        Add Table

                                    </button>

                                </div>


                                <h3
                                    className="
                                        mt-4
                                        text-sm
                                        font-medium
                                        text-zinc-200
                                    "
                                >
                                    Tables
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-zinc-500
                                    "
                                >
                                    Add a new dining table and configure
                                    its seating capacity.
                                </p>

                            </div>


                            {/* Add Menu Item */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-zinc-800/50
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-orange-500/10
                                        "
                                    >

                                        <FiMenu
                                            size={18}
                                            className="text-orange-400"
                                        />

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowMenuModal(true)
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            rounded-lg
                                            bg-cyan-700
                                            px-3
                                            py-2
                                            text-xs
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-cyan-800
                                        "
                                    >

                                        <FiPlus size={14} />

                                        Add Menu Item

                                    </button>

                                </div>


                                <h3
                                    className="
                                        mt-4
                                        text-sm
                                        font-medium
                                        text-zinc-200
                                    "
                                >
                                    Menu
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-zinc-500
                                    "
                                >
                                    Add a new menu item with its category,
                                    description and price.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* RESTAURANT DETAILS */}

                    <form
                        onSubmit={handleSaveSettings}
                        className="
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-900
                        "
                    >

                        {/* Section Header */}

                        <div
                            className="
                                border-b
                                border-zinc-800
                                px-5
                                py-4
                            "
                        >

                            <h2
                                className="
                                    text-sm
                                    font-semibold
                                    text-zinc-100
                                "
                            >
                                Restaurant Details
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-zinc-500
                                "
                            >
                                Basic information about your restaurant
                            </p>

                        </div>


                        {/* Fields */}

                        <div className="p-5">

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-5
                                    md:grid-cols-2
                                "
                            >

                                {/* Restaurant Name */}

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-sm
                                            text-zinc-400
                                        "
                                    >
                                        Restaurant Name
                                    </label>

                                    <input
                                        type="text"
                                        value={restaurantName}
                                        onChange={(e) =>
                                            setRestaurantName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter restaurant name"
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-zinc-700
                                            bg-zinc-800
                                            px-4
                                            py-2.5
                                            text-sm
                                            text-zinc-200
                                            outline-none
                                            placeholder:text-zinc-600
                                            focus:border-orange-500/50
                                        "
                                    />

                                </div>


                                {/* Phone */}

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-sm
                                            text-zinc-400
                                        "
                                    >
                                        Phone Number
                                    </label>

                                    <div className="relative">

                                        <FiPhone
                                            size={15}
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-zinc-600
                                            "
                                        />

                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter phone number"
                                            className="
                                                w-full
                                                rounded-lg
                                                border
                                                border-zinc-700
                                                bg-zinc-800
                                                py-2.5
                                                pl-9
                                                pr-4
                                                text-sm
                                                text-zinc-200
                                                outline-none
                                                placeholder:text-zinc-600
                                                focus:border-orange-500/50
                                            "
                                        />

                                    </div>

                                </div>


                                {/* Address */}

                                <div className="md:col-span-2">

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-sm
                                            text-zinc-400
                                        "
                                    >
                                        Address
                                    </label>

                                    <div className="relative">

                                        <FiMapPin
                                            size={15}
                                            className="
                                                absolute
                                                left-3
                                                top-3
                                                text-zinc-600
                                            "
                                        />

                                        <textarea
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter restaurant address"
                                            rows={3}
                                            className="
                                                w-full
                                                resize-none
                                                rounded-lg
                                                border
                                                border-zinc-700
                                                bg-zinc-800
                                                py-2.5
                                                pl-9
                                                pr-4
                                                text-sm
                                                text-zinc-200
                                                outline-none
                                                placeholder:text-zinc-600
                                                focus:border-orange-500/50
                                            "
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Save */}

                            <div
                                className="
                                    mt-5
                                    flex
                                    justify-end
                                    border-t
                                    border-zinc-800
                                    pt-5
                                "
                            >

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-lg
                                        bg-orange-500
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-orange-400
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {saving ? (

                                        <>
                                            <FiLoader
                                                size={15}
                                                className="animate-spin"
                                            />

                                            Saving...

                                        </>

                                    ) : (

                                        <>
                                            <FiSave size={15} />

                                            Save Changes

                                        </>

                                    )}

                                </button>

                            </div>

                        </div>

                    </form>


                    {/* BILLING */}

                    <form
                        onSubmit={handleSaveSettings}
                        className="
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-900
                        "
                    >

                        <div
                            className="
                                border-b
                                border-zinc-800
                                px-5
                                py-4
                            "
                        >

                            <h2
                                className="
                                    text-sm
                                    font-semibold
                                    text-zinc-100
                                "
                            >
                                Billing
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-zinc-500
                                "
                            >
                                Configure tax applied to orders
                            </p>

                        </div>


                        <div className="p-5">

                            <div className="max-w-sm">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        text-zinc-400
                                    "
                                >
                                    Tax Percentage
                                </label>

                                <div className="relative">

                                    <FiPercent
                                        size={15}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-zinc-600
                                        "
                                    />

                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={taxPercentage}
                                        onChange={(e) =>
                                            setTaxPercentage(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-zinc-700
                                            bg-zinc-800
                                            py-2.5
                                            pl-9
                                            pr-10
                                            text-sm
                                            text-zinc-200
                                            outline-none
                                            focus:border-orange-500/50
                                        "
                                    />

                                    <span
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-xs
                                            text-zinc-500
                                        "
                                    >
                                        %
                                    </span>

                                </div>

                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        text-zinc-600
                                    "
                                >
                                    This percentage will be applied when
                                    calculating the order tax.
                                </p>

                            </div>


                            <div
                                className="
                                    mt-5
                                    flex
                                    justify-end
                                    border-t
                                    border-zinc-800
                                    pt-5
                                "
                            >

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-lg
                                        bg-orange-500
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-orange-400
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {saving ? (

                                        <>
                                            <FiLoader
                                                size={15}
                                                className="animate-spin"
                                            />

                                            Saving...

                                        </>

                                    ) : (

                                        <>
                                            <FiSave size={15} />

                                            Save Changes

                                        </>
                                    )}

                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            </div>


            {/* CREATE TABLE MODAL */}

            <CreateTableForm
                isOpen={showTableModal}
                onClose={() =>
                    setShowTableModal(false)
                }
                onTableCreated={handleTableCreated}
            />


            {/* CREATE MENU ITEM MODAL */}

            <CreateMenuItemForm
                isOpen={showMenuModal}
                onClose={() =>
                    setShowMenuModal(false)
                }
                onMenuItemCreated={handleMenuItemCreated}
            />

        </section>

    );

}


export default Settings;