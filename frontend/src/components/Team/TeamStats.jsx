function TeamStats({ team }) {

    const stats = [
        {
            label: "Admins",
            role: "admin",
            number: team.filter(
                (member) => member.role === "admin"
            ).length,
            style: "bg-orange-500/10 border-orange-500/20 text-orange-400",
        },
        {
            label: "Waiters",
            role: "waiter",
            number: team.filter(
                (member) => member.role === "waiter"
            ).length,
            style: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        },
        {
            label: "Kitchen",
            role: "kitchen",
            number: team.filter(
                (member) => member.role === "kitchen"
            ).length,
            style: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        },
        {
            label: "Cashiers",
            role: "cashier",
            number: team.filter(
                (member) => member.role === "cashier"
            ).length,
            style: "bg-green-500/10 border-green-500/20 text-green-400",
        },
    ];


    return (

        <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            mx-6
            my-4
        ">

            {stats.map((stat) => (

                <div
                    key={stat.role}
                    className={`
                        rounded-xl
                        border
                        px-5
                        py-4
                        ${stat.style}
                    `}
                >

                    <p className="
                        text-3xl
                        font-semibold
                    ">
                        {stat.number}
                    </p>

                    <p className="
                        mt-1
                        text-sm
                        text-zinc-400
                    ">
                        {stat.label}
                    </p>

                </div>

            ))}

        </div>

    );

}


export default TeamStats;