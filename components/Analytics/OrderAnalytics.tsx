"use client";
import { generateLast12MonthsOrderData } from "@/actions/analytics/getOrdersAnalytics";
import { styles } from "@/utils/styles";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  isDashboard?: boolean;
};

const OrderAnalytics = ({ isDashboard }: Props) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    generateLast12MonthsOrderData()
      .then((res) => {
        setData(res.last12Months);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  data?.last12Months?.forEach((item: any) => {
    data?.last12Months?.push({ month: item.month, count: item.count });
  });

  return (
    <>
      <div
        className={`${
          !isDashboard
            ? "mt-[50px]"
            : "mt-0"
        }`}
      >
        <div className={`${isDashboard ? "mb-6" : ""}`}>
          <h1
            className={`${
              isDashboard 
                ? "text-2xl font-bold text-white mb-2" 
                : `${styles.label} px-5 !text-start`
            }`}
          >
            {isDashboard ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                Orders Analytics
              </span>
            ) : (
              "Orders Analytics"
            )}
          </h1>
          {!isDashboard && (
            <p className={`${styles.label} px-5`}>
              Last 12 months analytics data{" "}
            </p>
          )}
          {isDashboard && (
            <div className="w-24 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full"></div>
          )}
        </div>

        <div
          className={`w-full ${
            isDashboard ? "h-[35vh]" : "h-screen"
          } flex items-center justify-center`}
        >
           {data ? (
            <>
              <ResponsiveContainer
                width={isDashboard ? "100%" : "90%"}
                height={!isDashboard ? "50%" : "100%"}
              >
                <AreaChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#130f23',
                      border: '1px solid #835DED',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#835DED"
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#835DED" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#835DED" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#835DED] mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading analytics...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderAnalytics;
