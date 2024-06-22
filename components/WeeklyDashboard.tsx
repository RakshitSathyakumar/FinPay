import { getLastMonthsAndDays } from "@/lib/specials";
import React from "react";
import { BarChart } from "./Charts";

interface MonthlyDashboardProps {
  typeOfData: string;
}
const WeeklyDashboard: React.FC<MonthlyDashboardProps> = ({ typeOfData }) => {
  const { last6Months, last7Days, last30Days } = getLastMonthsAndDays();
  return (
    <section className="flex flex-row gap-8 p-0 pr-8 pb-8">
      <div className="bg-white rounded-lg w-full p-2 px-12">
        <h2 className="text-2xl font-semibold text-center mb-8 mt-4 ml-1">
          Orders from last {typeOfData}
        </h2>
        <BarChart
          labels={last7Days}
          data_1={[1, 0, 1, 0, 0, 0, 3]}
          data_2={[2310, 0, 3330, 0, 0, 0, 5630]}
          title_1="Orders"
          title_2="Amount Spent"
          bgColor_1="#FF9900"
          bgColor_2="#000000"
        />
      </div>
    </section>
  );
};

export default WeeklyDashboard;
