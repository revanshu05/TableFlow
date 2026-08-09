function OrderActivity({
    activeOrders,
    paymentPendingOrders,
}) {

    const totalTrackedOrders =
        activeOrders + paymentPendingOrders;


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
                        Order Activity
                    </h2>

                    <p className="
                        text-xs
                        text-zinc-500
                        mt-1
                    ">
                        Current order workload
                    </p>

                </div>


                <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-orange-500/10
                    flex
                    items-center
                    justify-center
                    text-orange-400
                    font-semibold
                ">
                    {totalTrackedOrders}
                </div>

            </div>


            <div className="
                space-y-5
            ">

                {/* Active orders */}
                <div>

                    <div className="
                        flex
                        justify-between
                        text-sm
                        mb-2
                    ">

                        <span className="text-zinc-400">
                            Active Orders
                        </span>

                        <span className="
                            text-zinc-100
                            font-medium
                        ">
                            {activeOrders}
                        </span>

                    </div>


                    <div className="
                        h-2
                        bg-zinc-800
                        rounded-full
                        overflow-hidden
                    ">

                        <div
                            className="
                                h-full
                                bg-orange-500
                                rounded-full
                                transition-all
                                duration-700
                            "
                            style={{
                                width: totalTrackedOrders
                                    ? `${(activeOrders / totalTrackedOrders) * 100}%`
                                    : "0%",
                            }}
                        />

                    </div>

                </div>


                {/* Payment pending */}
                <div>

                    <div className="
                        flex
                        justify-between
                        text-sm
                        mb-2
                    ">

                        <span className="text-zinc-400">
                            Payment Pending
                        </span>

                        <span className="
                            text-zinc-100
                            font-medium
                        ">
                            {paymentPendingOrders}
                        </span>

                    </div>


                    <div className="
                        h-2
                        bg-zinc-800
                        rounded-full
                        overflow-hidden
                    ">

                        <div
                            className="
                                h-full
                                bg-zinc-500
                                rounded-full
                                transition-all
                                duration-700
                            "
                            style={{
                                width: totalTrackedOrders
                                    ? `${(paymentPendingOrders / totalTrackedOrders) * 100}%`
                                    : "0%",
                            }}
                        />

                    </div>

                </div>

            </div>


            <div className="
                mt-6
                pt-4
                border-t
                border-zinc-800
            ">

                <p className="
                    text-xs
                    text-zinc-500
                ">
                    Keep an eye on pending orders to keep
                    the billing flow moving.
                </p>

            </div>

        </div>
    );
}


export default OrderActivity;