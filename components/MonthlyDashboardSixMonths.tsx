import { getLastMonthsAndDays } from "@/lib/specials";
import React from "react";
import { BarChart } from "./Charts";

interface MonthlyDashboardProps {
  typeOfData: string;
}
const MonthlyDashboardSixMonths: React.FC<MonthlyDashboardProps> = ({
  typeOfData,
}) => {
  const { last6Months } = getLastMonthsAndDays();
  return (
    <section className="flex flex-row gap-8 p-0 pr-8 pb-8">
      <div className="bg-white rounded-lg w-full p-2 px-12">
        <h2 className="text-2xl font-semibold text-center mb-8 mt-4 ml-1">
          Orders from last {typeOfData}
        </h2>
        <BarChart
          labels={last6Months}
          data_1={[5, 7, 4, 20, 3, 12]}
          data_2={[2102, 3404, 1402, 8200, 1200, 5630]}
          title_1="Orders"
          title_2="Amount Spent"
          bgColor_1="#FF9900"
          bgColor_2="#000000"
        />
      </div>
    </section>
  );
};

export default MonthlyDashboardSixMonths;
