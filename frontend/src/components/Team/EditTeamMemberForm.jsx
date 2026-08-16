import { useEffect, useState } from "react";

import Modal from "../shared/Modal";
import { updateTeamMember } from "../../api/user.api";


const roles = [
    "admin",
    "waiter",
    "cashier",
    "kitchen",
];


function EditTeamMemberForm({
    isOpen,
    onClose,
    member,
    onMemberUpdated,
}) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [active, setActive] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    /*
     * Load selected member into form
     */
    useEffect(() => {

        if (!member) return;

        setName(member.name || "");
        setEmail(member.email || "");
        setPhone(member.phone || "");
        setRole(member.role || "");
        setActive(member.active ?? true);
        setError("");

    }, [member]);


    const handleClose = () => {

        if (loading) return;

        setError("");
        onClose();

    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");


        if (!name.trim()) {
            setError("Name is required");
            return;
        }


        if (!email.trim()) {
            setError("Email is required");
            return;
        }


        if (!role) {
            setError("Role is required");
            return;
        }


        try {

            setLoading(true);


            await updateTeamMember(member._id, {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                role,
                active,
            });


            onMemberUpdated();
            onClose();

        } catch (error) {

            console.error(
                "Failed to update team member:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update team member"
            );

        } finally {

            setLoading(false);

        }

    };


    if (!member) return null;


    return (

        <Modal
            title="Edit Team Member"
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
                        Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter name"
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


                {/* Email */}

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        text-zinc-400
                    ">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter email"
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


                {/* Phone */}

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        text-zinc-400
                    ">
                        Phone
                    </label>

                    <input
                        type="text"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        placeholder="Enter phone number"
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


                {/* Role */}

                <div>

                    <label className="
                        mb-2
                        block
                        text-sm
                        text-zinc-400
                    ">
                        Role
                    </label>

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
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
                            Select role
                        </option>

                        {roles.map((role) => (

                            <option
                                key={role}
                                value={role}
                            >
                                {role.charAt(0).toUpperCase() +
                                    role.slice(1)}
                            </option>

                        ))}

                    </select>

                </div>


                {/* Active Status */}

                <div className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-zinc-700
                    bg-zinc-900
                    px-4
                    py-3
                ">

                    <div>

                        <p className="
                            text-sm
                            font-medium
                            text-zinc-200
                        ">
                            Account Status
                        </p>

                        <p className="
                            text-xs
                            text-zinc-500
                            mt-1
                        ">
                            {active
                                ? "Member can access the system"
                                : "Member cannot access the system"
                            }
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() => setActive((prev) => !prev)}
                        className={`
                            relative
                            h-6
                            w-11
                            rounded-full
                            transition
                            ${
                                active
                                    ? "bg-green-500"
                                    : "bg-zinc-700"
                            }
                        `}
                    >

                        <span
                            className={`
                                absolute
                                top-1
                                h-4
                                w-4
                                rounded-full
                                bg-white
                                transition
                                ${
                                    active
                                        ? "left-6"
                                        : "left-1"
                                }
                            `}
                        />

                    </button>

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
                            px-5
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
                            ? "Updating..."
                            : "Update Member"
                        }
                    </button>

                </div>

            </form>

        </Modal>

    );
}


export default EditTeamMemberForm;