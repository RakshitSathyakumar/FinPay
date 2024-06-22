"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have a utility for conditional classes

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 bg-[#232F3E] text-white w-full z-10 h-20">
      <nav className="flex justify-between items-center h-full">
        <div className="flex items-center gap-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/icons/Amazon.png"
              width={200}
              height={160} // Set the height to match the width for a perfect circle
              alt="Amazon logo"
            />
            <Image
              src="/icons/finPay.png"
              width={100}
              height={50} // Set the height to match the width for a perfect circle
              alt="Finpay logo"
            />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/account"
            className={cn("text-gray-300 hover:underline", {
              "text-white": pathname === "/account",
            })}
          >
            Account & Lists
          </Link>
          <Link
            href="/orders"
            className={cn("text-gray-300 hover:underline", {
              "text-white": pathname === "/orders",
            })}
          >
            Returns & Orders
          </Link>
          <Link
            href="/cart"
            className={cn("text-gray-300 hover:underline", {
              "text-white": pathname === "/cart",
            })}
          >
            Cart
          </Link>
        </div>
      </nav>
    </header>
  );
};
