import { getLastMonthsAndDays } from "@/lib/specials";
import React from "react";
import { BarChart } from "./Charts";

interface MonthlyDashboardProps {
  typeOfData: string;
}
const YearlySixYearData: React.FC<MonthlyDashboardProps> = ({ typeOfData }) => {
  const { last6Years } = getLastMonthsAndDays();
  return (
    <section className="flex flex-row gap-8 p-0 pr-8 pb-8">
      <div className="bg-white rounded-lg w-full p-2 px-12">
        <h2 className="text-2xl font-semibold text-center mb-8 mt-4 ml-1">
          Orders from last {typeOfData}
        </h2>
        <BarChart
          labels={last6Years}
          data_1={[25, 24, 54, 32, 35, 58]}
          data_2={[21000, 32000, 43000, 21000, 34000, 62000]}
          title_1="Orders"
          title_2="Amount Spent"
          bgColor_1="rgb(0, 115, 255)"
          bgColor_2="rgba(53, 162, 235, 0.8)"
        />
      </div>
    </section>
  );
};

export default YearlySixYearData;
