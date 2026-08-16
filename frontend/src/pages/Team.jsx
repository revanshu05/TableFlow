import { useEffect, useMemo, useState } from "react";

import {
    IoPeopleOutline,
} from "react-icons/io5";

import {
    FiPlus,
    FiSearch,
} from "react-icons/fi";

import TeamMemberCard from "../components/Team/TeamMemberCard";
import CreateTeamMemberForm from "../components/Team/CreateTeamMemberForm";
import TeamStats from "../components/Team/TeamStats";
import EditTeamMemberForm from "../components/Team/EditTeamMemberForm";

import {
    getTeamMembers,
} from "../api/user.api";


function Team() {

    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const fetchTeamMembers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getTeamMembers();

            setMembers(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch team members:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load team members"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchTeamMembers();
    }, []);


    // FILTER MEMBERS

    const filteredMembers = useMemo(() => {

        return members.filter((member) => {

            const matchesRole =
                roleFilter === "ALL" ||
                member.role === roleFilter;


            const searchValue =
                search.trim().toLowerCase();


            const matchesSearch =
                !searchValue ||
                member.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                member.email
                    ?.toLowerCase()
                    .includes(searchValue) ||
                member.phone
                    ?.toLowerCase()
                    .includes(searchValue);


            return (
                matchesRole &&
                matchesSearch
            );

        });

    }, [
        members,
        search,
        roleFilter,
    ]);


    const handleEdit = (member) => {

        setSelectedMember(member);
        setShowEditModal(true);

    };


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
                    px-6
                    py-4
                "
            >

                {/* LEFT */}

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

                        <IoPeopleOutline
                            size={21}
                            className="text-orange-400"
                        />

                    </div>


                    <div>

                        <h1
                            className="
                                text-xl
                                font-semibold
                                text-white
                            "
                        >
                            Team
                        </h1>


                        <p
                            className="
                                text-xs
                                text-zinc-500
                            "
                        >
                            Manage restaurant staff
                        </p>

                    </div>

                </div>


                {/* ADD MEMBER */}

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-orange-500
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-orange-400
                    "
                >

                    <FiPlus size={17} />

                    Add Member

                </button>

            </div>


            {/* DIVIDER */}

            <div
                className="
                    mx-6
                    shrink-0
                    border-b
                    border-zinc-700
                "
            />

            <div className="overflow-y-auto">

                <TeamStats team={members}/>

                <div
                    className="
                        mx-6
                        shrink-0
                        border-b
                        border-zinc-700
                    "
                />

                {/* FILTER BAR */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-end
                        gap-4
                        px-6
                        py-4
                    "
                >


                    {/* ROLE FILTER */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                            rounded-xl
                            border
                            border-zinc-700
                            bg-zinc-900
                            p-1
                        "
                    >

                        {[
                            ["ALL", "All"],
                            ["admin", "Admin"],
                            ["waiter", "Waiter"],
                            ["cashier", "Cashier"],
                            ["kitchen", "Kitchen"],
                        ].map(([value, label]) => (

                            <button
                                key={value}
                                onClick={() =>
                                    setRoleFilter(value)
                                }
                                className={`
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-xs
                                    font-medium
                                    transition

                                    ${
                                        roleFilter === value
                                            ? "bg-zinc-700 text-white"
                                            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                                    }
                                `}
                            >
                                {label}
                            </button>

                        ))}

                    </div>

                </div>


                {/* CONTENT */}

                <div
                    className="
                        flex-1
                        px-6
                        pb-6
                    "
                >

                    {/* LOADING */}

                    {loading && (

                        <div
                            className="
                                flex
                                h-40
                                items-center
                                justify-center
                                text-sm
                                text-zinc-400
                            "
                        >
                            Loading team members...
                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div
                            className="
                                flex
                                h-40
                                items-center
                                justify-center
                                text-sm
                                text-red-400
                            "
                        >
                            {error}
                        </div>

                    )}


                    {/* MEMBERS */}

                    {!loading &&
                        !error &&
                        filteredMembers.length > 0 && (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    md:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                "
                            >

                                {filteredMembers.map(
                                    (member) => (

                                        <TeamMemberCard
                                            key={member._id}
                                            member={member}
                                            onEdit={handleEdit}
                                        />

                                    )
                                )}

                            </div>

                        )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        filteredMembers.length === 0 && (

                            <div
                                className="
                                    flex
                                    h-48
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-2
                                    text-zinc-500
                                "
                            >

                                <IoPeopleOutline
                                    size={32}
                                    className="text-zinc-700"
                                />

                                <p className="text-sm">
                                    No team members found.
                                </p>

                            </div>

                        )}

                </div>
            </div>
            

            <CreateTeamMemberForm
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />

            <EditTeamMemberForm
                isOpen={showEditModal}
                member={selectedMember}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedMember(null);
                }}
                onMemberUpdated={fetchTeamMembers}
            />


        </section>

    );

}


export default Team;