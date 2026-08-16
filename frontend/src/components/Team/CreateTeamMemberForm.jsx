import { useState } from "react";

import Modal from "../shared/Modal";
import { registerUser } from "../../api/user.api";


const roles = [
    "admin",
    "waiter",
    "cashier",
    "kitchen",
];


function CreateTeamMemberForm({
    isOpen,
    onClose,
    onMemberCreated,
}) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const resetForm = () => {

        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setRole("");
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


        // ================= VALIDATION =================

        if (!name.trim()) {
            setError("Name is required");
            return;
        }


        if (!email.trim()) {
            setError("Email is required");
            return;
        }


        if (!password) {
            setError("Password is required");
            return;
        }


        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters"
            );
            return;
        }


        if (!role) {
            setError("Role is required");
            return;
        }


        try {

            setLoading(true);


            await registerUser({

                name: name.trim(),

                email: email.trim(),

                password,

                phone: phone.trim(),

                role,

            });


            // Refresh team list

            await onMemberCreated();


            resetForm();

            onClose();


        } catch (error) {

            console.error(
                "Failed to create team member:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create team member"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <Modal
            title="Add New Team Member"
            isOpen={isOpen}
            onClose={handleClose}
        >

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* NAME */}

                <div>

                    <label
                        className="
                            mb-2
                            block
                            text-sm
                            text-zinc-400
                        "
                    >
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter full name"
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


                {/* EMAIL */}

                <div>

                    <label
                        className="
                            mb-2
                            block
                            text-sm
                            text-zinc-400
                        "
                    >
                        Email Address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter email address"
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


                {/* PHONE */}

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
                        <span className="ml-1 text-zinc-600">
                            (Optional)
                        </span>
                    </label>

                    <input
                        type="tel"
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


                {/* ROLE */}

                <div>

                    <label
                        className="
                            mb-2
                            block
                            text-sm
                            text-zinc-400
                        "
                    >
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
                                {role
                                    .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                    )}
                            </option>

                        ))}

                    </select>

                </div>


                {/* PASSWORD */}

                <div>

                    <label
                        className="
                            mb-2
                            block
                            text-sm
                            text-zinc-400
                        "
                    >
                        Temporary Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
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

                    <p className="
                        mt-1.5
                        text-xs
                        text-zinc-600
                    ">
                        Minimum 6 characters
                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div
                        className="
                            rounded-lg
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-3
                            py-2
                            text-sm
                            text-red-400
                        "
                    >
                        {error}
                    </div>

                )}


                {/* ACTION */}

                <div
                    className="
                        flex
                        justify-center
                        pt-2
                    "
                >

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            rounded-lg
                            bg-orange-500
                            px-5
                            py-2.5
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
                            : "Create Member"
                        }

                    </button>

                </div>

            </form>

        </Modal>

    );

}


export default CreateTeamMemberForm;