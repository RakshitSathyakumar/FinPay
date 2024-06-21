import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

export const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="flex flex-row justify-between items-stretch w-[25%] bg-white shadow-md p-8 rounded-lg ">
    <div className="flex flex-col">
      <p className="opacity-70 text-lg mb-1">{heading}</p>
      <h4 className="text-2xl mb-2">{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="text-green-500 flex items-center space-x-1">
          +{percent}%{" "}
        </span>
      ) : (
        <span className="text-red-500 flex items-center space-x-1">
          {percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="relative w-20 h-20 rounded-full grid place-items-center"
      style={{
        background: `conic-gradient(
          ${color} ${(Math.abs(percent) / 100) * 360}deg,
          rgb(82, 97, 107) 0
        )`,
      }}
    >
      <div className="absolute w-16 h-16 bg-white rounded-full"></div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="relative cursor-pointer" style={{ color }}>
            {percent}%
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="w-50 bg-green-50">
          <div className="flex justify-center space-x-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{percent}%</h4>
              {percent > 0 ? (
                <p className="text-sm text-blue-800">Increase from last Week</p>
              ) : (
                <p className="text-sm text-red-600">Decrease from last Week</p>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  </article>
);

// <HoverCard>
//   <HoverCardTrigger>Hover</HoverCardTrigger>
//   <HoverCardContent>
//     The React Framework – created and maintained by @vercel.
//   </HoverCardContent>
// </HoverCard>
