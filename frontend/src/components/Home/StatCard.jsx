const colorConfig = {

    orange: {
        bg: "bg-orange-500/[0.06]",
        icon: "bg-orange-500/15 text-orange-400",
        glow: "bg-orange-500/10",
        hover: "hover:border-orange-500/40",
        value: "text-orange-400",
    },

    blue: {
        bg: "bg-blue-500/[0.06]",
        icon: "bg-blue-500/15 text-blue-400",
        glow: "bg-blue-500/10",
        hover: "hover:border-blue-500/40",
        value: "text-blue-400",
    },

    purple: {
        bg: "bg-purple-500/[0.06]",
        icon: "bg-purple-500/15 text-purple-400",
        glow: "bg-purple-500/10",
        hover: "hover:border-purple-500/40",
        value: "text-purple-400",
    },

    amber: {
        bg: "bg-amber-500/[0.06]",
        icon: "bg-amber-500/15 text-amber-400",
        glow: "bg-amber-500/10",
        hover: "hover:border-amber-500/40",
        value: "text-amber-400",
    },

    red: {
        bg: "bg-red-500/[0.06]",
        icon: "bg-red-500/15 text-red-400",
        glow: "bg-red-500/10",
        hover: "hover:border-red-500/40",
        value: "text-red-400",
    },

    green: {
        bg: "bg-green-500/[0.06]",
        icon: "bg-green-500/15 text-green-400",
        glow: "bg-green-500/10",
        hover: "hover:border-green-500/40",
        value: "text-green-400",
    },

};


function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "orange",
}) {

    const config =
        colorConfig[color] || colorConfig.orange;


    return (

        <div
            className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-zinc-800
                p-5
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-lg
                ${config.bg}
                ${config.hover}
            `}
        >

            {/* Glow */}

            <div
                className={`
                    absolute
                    -right-12
                    -top-12
                    h-32
                    w-32
                    rounded-full
                    blur-3xl
                    opacity-40
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                    ${config.glow}
                `}
            />


            {/* Card */}

            <div className="
                relative
                flex
                items-start
                justify-between
            ">

                <div>

                    <p className="
                        text-sm
                        text-zinc-500
                        transition-colors
                        group-hover:text-zinc-400
                    ">
                        {title}
                    </p>


                    <h2 className={`
                        mt-3
                        text-2xl
                        font-bold
                        tracking-tight
                        text-zinc-100
                        transition-colors
                        ${config.value}
                    `}>
                        {value}
                    </h2>


                    {subtitle && (

                        <p className="
                            mt-2
                            text-xs
                            text-zinc-600
                        ">
                            {subtitle}
                        </p>

                    )}

                </div>


                {Icon && (

                    <div
                        className={`
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            transition-all
                            duration-300
                            group-hover:scale-105
                            ${config.icon}
                        `}
                    >
                        <Icon className="text-xl" />
                    </div>

                )}

            </div>

        </div>

    );

}


export default StatCard;