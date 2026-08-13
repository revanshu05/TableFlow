
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    featured = false,
}) {
    return (
        <div
            className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-zinc-700
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-orange-500/50
                hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]
            `}
        >

            {/* Background glow */}
            {featured && (
                <div
                    className="
                        absolute
                        -right-10
                        -top-10
                        w-32
                        h-32
                        bg-orange-500/10
                        rounded-full
                        blur-3xl
                    "
                />
            )}


            <div className="relative flex items-start justify-between">

                <div>

                    <p className="
                        text-md
                        text-zinc-400
                        group-hover:text-zinc-200
                    ">
                        {title}
                    </p>


                    <h2
                        className={`
                            mt-3
                            font-bold
                            tracking-tight
                            ${
                                featured
                                    ? "text-3xl text-zinc-50"
                                    : "text-2xl text-zinc-100"
                            }
                        `}
                    >
                        {value}
                    </h2>


                    {subtitle && (
                        <p className="
                            mt-2
                            text-xs
                            text-zinc-500
                        ">
                            {subtitle}
                        </p>
                    )}

                </div>


                {Icon && (
                    <div
                        className={`
                            flex
                            items-center
                            justify-center
                            w-11
                            h-11
                            rounded-xl

                            ${
                                featured
                                    ? `
                                        bg-orange-500/15
                                        text-orange-400
                                      `
                                    : `
                                        bg-zinc-800
                                        text-zinc-400
                                      `
                            }
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