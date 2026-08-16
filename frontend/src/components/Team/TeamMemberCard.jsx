import {
    FaUser,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";

import {
    FaUserEdit ,
} from "react-icons/fa";


function TeamMemberCard({
    member,
    onEdit,
}) {

    const roleConfig = {

        admin: {
            label: "Admin",
            badge: "bg-orange-500/15 text-orange-400",
        },

        waiter: {
            label: "Waiter",
            badge: "bg-blue-500/15 text-blue-400",
        },

        cashier: {
            label: "Cashier",
            badge: "bg-green-500/15 text-green-400",
        },

        kitchen: {
            label: "Kitchen",
            badge: "bg-purple-500/15 text-purple-400",
        },

    };


    const currentRole =
        roleConfig[member.role] || {
            label: member.role,
            badge: "bg-zinc-500/15 text-zinc-400",
        };


    return (

        <div
            className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                p-5
                transition-all
                duration-200
                hover:border-orange-500/30
                hover:bg-zinc-850
            "
        >

            {/* TOP */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {/* Avatar */}

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-orange-500/10
                            text-orange-400
                        "
                    >
                        <FaUser size={16} />
                    </div>


                    {/* Name + Role */}

                    <div>

                        <h2
                            className="
                                font-semibold
                                text-zinc-100
                            "
                        >
                            {member.name}
                        </h2>


                        <span
                            className={`
                                mt-1
                                inline-flex
                                rounded-md
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                ${currentRole.badge}
                            `}
                        >
                            {currentRole.label}
                        </span>

                    </div>

                </div>


                {/* Menu */}

                <button
                    onClick={() => onEdit(member)}
                    className="
                        rounded-lg
                        p-2
                        text-zinc-500
                        transition
                        hover:bg-zinc-800
                        hover:text-zinc-200
                    "
                >
                    <FaUserEdit  size={20} />
                </button>

            </div>


            {/* DIVIDER */}

            <div
                className="
                    my-4
                    border-t
                    border-zinc-800
                "
            />


            {/* INFORMATION */}

            <div
                className="
                    space-y-3
                    text-sm
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        text-zinc-400
                    "
                >
                    <FaEnvelope
                        size={13}
                        className="text-zinc-600"
                    />

                    <span className="truncate">
                        {member.email}
                    </span>
                </div>


                {member.phone && (

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-zinc-400
                        "
                    >

                        <FaPhone
                            size={13}
                            className="text-zinc-600"
                        />

                        <span>
                            {member.phone}
                        </span>

                    </div>

                )}

            </div>


            {/* STATUS */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                "
            >

                <span className="text-xs text-zinc-600">
                    Member since{" "}
                    {new Date(
                        member.createdAt
                    ).toLocaleDateString()}
                </span>


                <span
                    className={`
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        font-medium
                        ${
                            member.active
                                ? "text-green-400"
                                : "text-red-400"
                        }
                    `}
                >

                    <span
                        className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${
                                member.active
                                    ? "bg-green-400"
                                    : "bg-red-400"
                            }
                        `}
                    />

                    {member.active
                        ? "Active"
                        : "Inactive"
                    }

                </span>

            </div>

        </div>

    );

}


export default TeamMemberCard;