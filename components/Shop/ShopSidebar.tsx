"use client";

import React from "react";
import { GoHome, GoArrowSwitch } from "react-icons/go";
import { BsWallet2 } from "react-icons/bs";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbMoneybag } from "react-icons/tb";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Link from "next/link";
import { styles } from "@/utils/styles";
import { Card } from "@nextui-org/react";

type Props = {
  active: number;
};

const sideBarItems = [
  {
    icon: <GoHome />,
    title: "Dashboard",
    href: "/my-shop",
  },
  {
    icon: <MdOutlineCreateNewFolder />,
    title: "Upload Prompt",
    href: "/shop/create-prompt",
  },
  {
    icon: <BsWallet2 />,
    title: "Prompts",
    href: "/shop/prompts",
  },
  {
    icon: <TbMoneybag />,
    title: "Orders",
    href: "/shop/orders",
  },
  {
    icon: <LiaFileInvoiceDollarSolid />,
    title: "Invoices",
    href: "/shop/invoices",
  },
  {
    icon: <BiMoneyWithdraw />,
    title: "Withdraw Earnings",
    href: "/shop/withdraw",
  },
  {
    icon: <GoArrowSwitch />,
    title: "Switch to user",
    href: "/",
  },
];

const ShopSidebar = ({ active }: Props) => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[280px] bg-gradient-to-br from-[#110b30] to-[#1a0f3a] border-r border-[#835DED]/20 backdrop-blur-lg z-40 overflow-y-auto hidden md:block">
      {/* Background Elements */}
      <div className="absolute top-10 left-5 w-32 h-32 bg-[#835DED]/10 rounded-full filter blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-5 w-24 h-24 bg-[#FF7E5F]/10 rounded-full filter blur-2xl animate-pulse"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-[#835DED]/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F] mb-2">
            Shop Panel
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full mx-auto"></div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="relative z-10 p-4 space-y-2">
        {sideBarItems.map((item, index) => {
          const isActive = active === index;
          
          return (
            <div key={index}>
              <Link href={item.href}>
                <Card
                  className={`p-4 transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? "bg-gradient-to-r from-[#835DED]/20 to-[#FF7E5F]/20 border-[#835DED]/50 shadow-lg shadow-purple-500/20"
                      : "bg-[#130f23]/50 border-[#835DED]/10 hover:bg-gradient-to-r hover:from-[#835DED]/10 hover:to-[#FF7E5F]/10 hover:border-[#835DED]/30"
                  } hover:scale-[1.02] hover:shadow-md hover:shadow-purple-500/10`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon Container */}
                    <div
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white"
                          : "bg-[#835DED]/10 text-[#835DED] group-hover:bg-[#835DED]/20 group-hover:text-[#835DED]"
                      }`}
                    >
                      <div className="text-xl">
                        {item.icon}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <span
                      className={`font-medium transition-all duration-300 ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#835DED] to-[#FF7E5F] rounded-l-full"></div>
                  )}
                </Card>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#835DED]/20 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Bohar's Bit
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Shop Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopSidebar;
