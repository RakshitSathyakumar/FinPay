import moment from "moment";

export const getLastDays = (numDays: number) => {
  const currentDate = moment();
  const lastDays = [];

  for (let i = 0; i < numDays; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("DD/MM/YY");
    lastDays.unshift(dayName);
  }

  return lastDays;
};

export const getLastMonthsAndDays = () => {
  const currentDate = moment();
  currentDate.date(1);

  const last6Months = [];
  const last12Months = [];
  const last6Years = [];

  for (let i = 0; i < 6; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMMM");
    last6Months.unshift(monthName);
  }

  for (let i = 0; i < 12; i++) {
    const monthDate = currentDate.clone().subtract(i, "months");
    const monthName = monthDate.format("MMMM");
    last12Months.unshift(monthName);
  }

  for (let i = 0; i < 6; i++) {
    const yearDate = currentDate.clone().subtract(i, "years");
    const yearName = yearDate.format("YYYY");
    last6Years.unshift(yearName);
  }

  const last7Days = getLastDays(7);
  const last30Days = getLastDays(30);

  return {
    last12Months,
    last6Months,
    last6Years,
    last7Days,
    last30Days,
  };
};
