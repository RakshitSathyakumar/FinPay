"use client";

import { BarChart, DoughnutChart, LineChart } from "@/components/Charts";
import { WidgetItem } from "@/components/Widget";
import { getLastMonthsAndDays } from "@/lib/specials";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Category from "./Category";
import MonthlyDashboard from "./MonthlyDashboard";
import WeeklyDashboard from "./WeeklyDashboard";
import MonthlyDashboardSixMonths from "./MonthlyDashboardSixMonths";
import YearlyOneYearData from "./YearlyOneYearData";
import YearlySixYearData from "./YearlySixYearData";

type DashboardProps = {
  type: string;
  notify: string;
  budget: string;
};

const Dashboard = ({ type, notify, budget }: DashboardProps) => {
  const [isNotified, setIsNotified] = useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const { last6Months, last7Days, last30Days } = getLastMonthsAndDays();

  const categories: CategoryCount[] = [
    { name: "Household Appliances", count: 5, totalCount: 20 },
    { name: "Electronics", count: 7, totalCount: 20 },
    { name: "Accessories", count: 4, totalCount: 20 },
    { name: "Other", count: 4, totalCount: 20 },
  ];

  const amountMonthlySpent: number = 22635;
  const downloadPDF = () => {
    const input = pdfRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4", true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        let imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        let imgY = 10;
        const imgX = (pdfWidth - imgWidth * ratio) / 2;

        // Calculate the total height in pages needed
        let pageHeightRemaining = pdfHeight - 20; // Subtract initial margin

        // If the content overflows the first page, add more pages
        while (pageHeightRemaining < imgHeight * ratio) {
          pdf.addImage(
            imgData,
            "PNG",
            imgX,
            imgY,
            imgWidth * ratio,
            pageHeightRemaining
          );
          imgHeight -= pageHeightRemaining / ratio;
          imgY = 10;
          pdf.addPage();
          pageHeightRemaining = pdfHeight - 20; // Reset for new page
        }

        // Add the remaining part of the image
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );

        pdf.save("budget.pdf");
      });
    }
  };

  const htmlTemplate = `
 <!DOCTYPE html><html lang=\"en\"><head>  <meta charset=\"UTF-8\">  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">  <style>    body { font-family: ,Arial sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; }    .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e7e7e7; }    .header { background-color: #232f3e; color: white; padding: 20px; text-align: center; }    .header h1 { margin: 0; font-size: 24px; }    .content { padding: 20px; }    .content h1 { color: #232f3e; font-size: 20px; }    .content p { color: #555555; line-height: 1.6; }    .content ul { padding: 0; list-style-type: none; }    .content li { margin-bottom: 10px; color: #232f3e; }    .footer { background-color: #f7f7f7; color: #555555; text-align: center; padding: 10px; font-size: 12px; border-top: 1px solid #e7e7e7; }    .button { display: inline-block; background-color: #ff9900; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; }  </style></head><body>  <div class=\"container\">    <div class=\"header\">      <h1>Amazon Expenditure Alert</h1>    </div>    <div class=\"content\">      <h1>Hello Rakshit,</h1>      <p>We hope this email finds you well.</p>      <p>We wanted to inform you that your recent expenditures have exceeded your specified limit. Here are the details:</p>      <ul>        <li>Total Expenditure: ₹[Amount]</li>        <li>Limit:  ₹[amountMonthlySpent]</li>      </ul>      <p>Please review your expenditures and take the necessary actions to manage your budget effectively.</p>      <p>If you have any questions or need further assistance, feel free to contact our support team.</p>      <p>Thank you for your attention.</p>      <p>Best regards,</p>      <p>Amazon Team</p>      <a href=\"http://your-support-url.com\" class=\"button\">Contact Support</a>    </div>    <div class=\"footer\">      <p>&copy; 2024 Amazon. All rights reserved.</p>    </div>  </div></body></html>
`;

  useEffect(() => {
    if (
      notify === "yes" &&
      !isNotified &&
      Number(budget) <= amountMonthlySpent
    ) {
      const url = "https://node-mailer-9775.onrender.com/api/sendMail";
      const params = {
        toMail: "21bec085@iiitdmj.ac.in",
        subject: "Budget Balance Update from Amazon",
        html: htmlTemplate,
      };

      axios
        .post(url, params)
        .then((response) => {
          console.log(response);
          setIsNotified(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [notify, isNotified]);

  const budgetValue = Number(budget);
  const truncateToTwoDecimals = (num: number) => {
    return Math.trunc(num * 100) / 100;
  };
  const stats = {}; // You should fetch or define this data based on your requirements
  let typeOfData: string = "";
  if (type === "weekly") {
    typeOfData = "Week";
  }
  if (type === "monthly") {
    typeOfData = "Month";
  }
  if (type == "yearly") {
    typeOfData = "Year";
  }
  return (
    <>
      <div className="flex flex-col gap-8 bg-gray-25 p-8 xl:py-12 overflow-y-scroll overflow-x-scroll no-scrollbar">
        <div className="flex flex-col justify-between items-stretch gap-8 p-8 pr-0">
          <div className="flex flex-row justify-between items-stretch gap-8 p-8 pr-0">
            <WidgetItem
              percent={12}
              amount={true}
              value={budgetValue}
              heading="Total Budget"
              color="rgb(0, 185, 255)"
            />
            <WidgetItem
              percent={4}
              amount={true}
              value={truncateToTwoDecimals(amountMonthlySpent)}
              heading="Amount Spent"
              color="rgb(0, 115, 255)"
            />
            <WidgetItem
              percent={-5}
              amount={true}
              value={truncateToTwoDecimals(budgetValue * 0.15)}
              heading="Remaining Amount"
              color="rgb(0, 115, 255)"
            />
          </div>
        </div>

        {typeOfData === "Week" ? (
          <WeeklyDashboard typeOfData={typeOfData} />
        ) : typeOfData === "Month" ? (
          <MonthlyDashboard typeOfData={typeOfData} />
        ) : (
          <YearlyOneYearData typeOfData={typeOfData} />
        )}

        <div className="flex flex-col justify-center gap-8 p-8">
          <div className="flex flex-row justify-center items-center gap-80">
            <WidgetItem
              percent={22}
              value={435}
              amount={true}
              color="rgb(76, 0, 255)"
              heading="Discount Availed"
            />
            <WidgetItem
              percent={-32}
              value={5}
              color="rgb(76, 0, 255)"
              heading="Total Transactions"
            />
          </div>
          <section className="flex flex-col items-center">
            <div className="flex justify-center items-center w-80">
              <DoughnutChart
                labels={[
                  "Axis-Bank",
                  "SBI-Credit Card",
                  "Amazon-Pay-Wallet",
                  "HDFC-Credit-Card",
                ]}
                data={[1, 1, 2, 1]}
                backgroundColor={["#52D3D8", "#3887BE", "#200E3A", "#38419D"]}
                legends={false}
                cutout={"50%"}
              />
            </div>
            <h2 className="text-gray-500 py-7">Different Payment Modes</h2>
          </section>
        </div>

        {/* <div className="flex flex-col justify-center gap-8 p-8">
          <div className="flex flex-row justify-center items-center gap-80">
            <WidgetItem
              percent={-42}
              value={123}
              amount={true}
              color="rgb(76, 0, 255)"
              heading="Discount Availed"
            />
            <WidgetItem
              percent={32}
              amount={true}
              value={32}
              color="rgb(76, 0, 255)"
              heading="Total Savings"
            />
          </div>

          <section className="flex flex-col items-center">
            <div className="flex justify-center items-center w-80">
              <DoughnutChart
                labels={["Discount", "Savings"]}
                data={[14, 52]}
                backgroundColor={["#FF6384", "#36A2EB"]}
                legends={false}
                cutout={"50%"}
              />
            </div>
          </section>
        </div> */}

        <div className="flex flex-col justify-center gap-8 p-8">
          <div className="flex flex-row justify-between items-stretch gap-8 p-8 pr-0">
            <WidgetItem
              percent={122}
              amount={true}
              value={6500}
              heading="Amazon Ecommerce"
              color="rgb(0, 115, 255)"
            />
            <WidgetItem
              percent={12}
              value={3810}
              amount={true}
              color="rgb(255, 196, 0)"
              heading="Amazon Fresh"
            />
            <WidgetItem
              percent={-2}
              value={2000}
              amount={true}
              color="rgb(255, 196, 0)"
              heading="Amazon Prime"
            />
          </div>
          <section className="flex flex-col items-center">
            <div className="flex justify-center items-center w-80">
              <DoughnutChart
                labels={["Amazon-Eccomerce", "Fresh", "Prime"]}
                data={[6500, 3810, 2000]}
                backgroundColor={["#52D3D8", "#3887BE", "52D3D8"]}
                legends={false}
                cutout={"50%"}
              />
            </div>
            <h2 className="text-gray-500 py-7">Amazon Payment Channel</h2>
          </section>

          <section>
            <div className="mt-10 flex flex-1 flex-col gap-6">
              <h2 className="header-2">Top categories</h2>

              <div className="space-y-5">
                {categories.map((category, index) => (
                  <Category key={category.name} category={category} />
                ))}
              </div>
            </div>
          </section>
        </div>
        {typeOfData === "Week" ? (
          <MonthlyDashboard typeOfData={typeOfData} />
        ) : typeOfData === "Month" ? (
          <MonthlyDashboardSixMonths typeOfData={typeOfData} />
        ) : (
          <YearlySixYearData typeOfData={typeOfData} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
