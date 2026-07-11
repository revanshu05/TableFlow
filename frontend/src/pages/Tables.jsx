import TableCard from "../components/Tables/TableCard";
import BackButton from "../components/shared/BackButton";

const tables = [
    {
        id: 1,
        tableNo: 1,
        seats: 6,
        status: "Available",
        customer: "N/A",
    },
    {
        id: 2,
        tableNo: 2,
        seats: 4,
        status: "Booked",
        customer: "RS",
    },
    {
        id: 3,
        tableNo: 3,
        seats: 5,
        status: "Available",
        customer: "N/A",
    },
    {
        id: 4,
        tableNo: 4,
        seats: 2,
        status: "Booked",
        customer: "VS",
    },
];

function Tables(){
    return(
        <section className="bg-zinc-800 h-[calc(100vh-6.5rem)] overflow-hidden flex flex-col items-center">
            <div className="w-[97%] flex flex-row items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                    <BackButton/>
                    <h1 className="text-2xl font-semibold text-zinc-200">Tables</h1>
                </div>
                <div>
                    <button className="text-zinc-300 px-5 py-2 text-md rounded bg-zinc-700">All</button>
                    <button className="text-zinc-300 px-5 py-2 text-md rounded">Booked</button>
                </div>
            </div>
            <div className="w-[97%] mx-auto mt-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-5 gap-4 pb-4">
                    {tables.map((table) => (
                        <TableCard
                            key={table.id}
                            {...table}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Tables;