"use client";

import OrderAnalytics from "@/components/Analytics/OrderAnalytics";
import AllPrompts from "@/components/Prompts/AllPrompts";
import ShopAllOrders from "@/components/Shop/ShopAllOrders";
import { styles } from "@/utils/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { BiBorderLeft } from "react-icons/bi";
import { Card } from "@nextui-org/react";

const ShopRoot = ({
  ordersData,
  promptsData,
}: {
  ordersData: any;
  promptsData: any;
}) => {
  const totalSales = ordersData?.reduce(
    (total: number, item: any) => (item?.prompt?.price || 0) + total,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110b30] to-[#1a0f3a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#835DED]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF7E5F]/10 rounded-full filter blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-Monserrat">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
              Dashboard
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Monitor your sales performance and manage your AI prompts
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] mx-auto rounded-full mt-4"></div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {/* Analytics Section */}
            <div className="xl:col-span-3 animate-fade-in-up">
              <Card className="p-6 bg-[#130f23]/80 border border-[#835DED]/20 backdrop-blur-sm hover:border-[#835DED]/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20">
                <OrderAnalytics isDashboard={true} />
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="xl:col-span-1 flex flex-col gap-6 animate-fade-in-up">
              <Card className="p-5 bg-gradient-to-br from-[#835DED]/15 to-[#9B59B6]/20 border border-[#835DED]/25 backdrop-blur-sm hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-full flex flex-col items-center text-center">
                  <div className="p-3 bg-[#835DED]/20 rounded-full mb-4">
                    <BiBorderLeft className="text-[#9B59B6] text-[32px]" />
                  </div>
                  <h5 className="text-2xl font-bold text-white mb-2">
                    {ordersData?.length || 0}
                  </h5>
                  <h5 className="text-[#835DED] text-lg font-semibold">
                    Total Orders
                  </h5>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-[#835DED]/15 to-[#9B59B6]/20 border border-[#835DED]/25 backdrop-blur-sm hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-full flex flex-col items-center text-center">
                  <div className="p-3 bg-[#835DED]/20 rounded-full mb-4">
                    <AiOutlineMoneyCollect className="text-[#9B59B6] text-[32px]" />
                  </div>
                  <h5 className="text-2xl font-bold text-white mb-2">
                    ${totalSales || 0}
                  </h5>
                  <h5 className="text-[#9B59B6] text-lg font-semibold">
                    Total Revenue
                  </h5>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* All Prompts */}
            <div className="lg:col-span-2 animate-fade-in-up">
              <Card className="p-6 bg-[#130f23]/80 border border-[#835DED]/20 backdrop-blur-sm hover:border-[#835DED]/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                      All Prompts
                    </span>
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full"></div>
                </div>
                <div className="overflow-hidden rounded-lg">
                  <AllPrompts promptsData={promptsData} isDashboard={true} />
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-1 animate-fade-in-up">
              <Card className="p-6 bg-[#130f23]/80 border border-[#835DED]/20 backdrop-blur-sm hover:border-[#835DED]/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/20 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                      Recent Orders
                    </span>
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full"></div>
                </div>
                <div className="overflow-hidden">
                  <ShopAllOrders isDashboard={true} ordersData={ordersData} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRoot;
