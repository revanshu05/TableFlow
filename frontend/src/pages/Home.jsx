import Greeting from "../components/Home/Greeting";
import MiniCard from "../components/Home/MiniCard";
import { GrInProgress } from "react-icons/gr";
import { TbReportMoney } from "react-icons/tb";
import RecentOrders from "../components/Home/RecentOrders";
import TodaySpecial from "../components/Home/TodaySpecial";

function Home(){
    
    return(
        <section className="bg-zinc-800 h-[calc(100vh-6.5rem)] overflow-hidden flex">
            
            {/*Left Container*/}
            <div className="flex-3 bg-zinc-800 h-full ml-1">
                <Greeting/>
                
                <div className="flex flex-row w-full gap-3">
                    <MiniCard 
                        title="Total Earnings"
                        icon={<TbReportMoney />}
                        num={512}
                        footnum={2.3}
                        high="false"/>

                    <MiniCard 
                        title="In Progress"
                        icon={<GrInProgress />}
                        num={215}
                        footnum={3.9}
                        high="true"/>
                </div>

                <RecentOrders/>
            </div>

            {/*Right Container*/}
            <div className="my-4 mr-4 ml-1 rounded-2xl flex-2 bg-zinc-900 h-149">
                <TodaySpecial/>
            </div>
        </section>
    )
}

export default Home;