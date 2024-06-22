import { getLastMonthsAndDays } from "@/lib/specials";
import React from "react";
import { BarChart } from "./Charts";

interface MonthlyDashboardProps {
  typeOfData: string;
}

const MonthlyDashboard: React.FC<MonthlyDashboardProps> = ({ typeOfData }) => {
  const { last6Months, last7Days, last30Days } = getLastMonthsAndDays();
  return (
    <section className="flex flex-row gap-8 p-0 pr-8 pb-8">
      <div className="bg-white rounded-lg w-full p-4 px-12">
        <h2 className="text-2xl font-semibold text-center mb-8 mt-4 ml-1">
          Orders Across {typeOfData}s
        </h2>
        <BarChart
          labels={last30Days}
          data_1={[
            0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 2, 0, 0,
            1, 0, 1, 0, 0, 0, 3,
          ]}
          data_2={[
            0, 0, 0, 1022, 0, 0, 0, 0, 2122, 0, 0, 0, 3243, 0, 0, 1332, 0, 0, 0,
            1323, 2323, 0, 0, 2310, 0, 3330, 0, 0, 0, 5630,
          ]}
          title_1="Order"
          title_2="Amount Spent"
          bgColor_1="#FF9900"
          bgColor_2="#000000"
        />
      </div>
    </section>
  );
};

export default MonthlyDashboard;
