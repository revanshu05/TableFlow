function TableOverview({
    occupiedTables,
    availableTables,
}) {

    const totalTables = occupiedTables + availableTables;

    const occupiedPercentage =
        totalTables > 0
            ? Math.round((occupiedTables / totalTables) * 100)
            : 0;


    return (
        <div className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-6
        ">

            <div className="
                flex
                items-center
                justify-between
                mb-6
            ">

                <div>

                    <h2 className="
                        text-lg
                        font-semibold
                        text-zinc-100
                    ">
                        Table Overview
                    </h2>

                    <p className="
                        text-xs
                        text-zinc-500
                        mt-1
                    ">
                        Current restaurant occupancy
                    </p>

                </div>


                <div className="
                    text-right
                ">

                    <p className="
                        text-2xl
                        font-bold
                        text-zinc-100
                    ">
                        {occupiedPercentage}%
                    </p>

                    <p className="
                        text-xs
                        text-zinc-500
                    ">
                        occupied
                    </p>

                </div>

            </div>


            {/* Progress */}
            <div className="
                h-3
                w-full
                bg-zinc-800
                rounded-full
                overflow-hidden
            ">

                <div
                    className="
                        h-full
                        bg-linear-to-r
                        from-orange-600
                        to-orange-400
                        rounded-full
                        transition-all
                        duration-700
                    "
                    style={{
                        width: `${occupiedPercentage}%`,
                    }}
                />

            </div>


            {/* Stats */}
            <div className="
                grid
                grid-cols-2
                gap-4
                mt-6
            ">

                <div className="
                    bg-zinc-800/60
                    rounded-xl
                    p-4
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <span className="
                            w-2.5
                            h-2.5
                            rounded-full
                            bg-orange-500"
                        />

                        <span className="
                            text-xs
                            text-zinc-400
                        ">
                            Occupied
                        </span>

                    </div>

                    <p className="
                        mt-2
                        text-xl
                        font-semibold
                        text-zinc-100
                    ">
                        {occupiedTables}
                    </p>

                </div>


                <div className="
                    bg-zinc-800/60
                    rounded-xl
                    p-4
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <span className="
                            w-2.5
                            h-2.5
                            rounded-full
                            bg-zinc-500"
                        />

                        <span className="
                            text-xs
                            text-zinc-400
                        ">
                            Available
                        </span>

                    </div>

                    <p className="
                        mt-2
                        text-xl
                        font-semibold
                        text-zinc-100
                    ">
                        {availableTables}
                    </p>

                </div>

            </div>

        </div>
    );
}


export default TableOverview;