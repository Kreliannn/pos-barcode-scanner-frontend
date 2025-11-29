"use client";
import { CardTempalte } from "./components/cardTemplate";
import { CategoryPieChart } from "./components/categoryPieChart";
import { MonthlyChart } from "./components/montlyGraph";
import { WeeklyChart } from "./components/weeklyGraph";
import { YearlyBarChart } from "./components/yearlyGraph";
import { TodaySalesChart } from "./components/todaySalesChart";
import MenuBarChart from "./components/menuChart";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import LoadingState from "./components/loadingState";
import { errorAlert } from "@/app/utils/alert";
import {Button} from "@/components/ui/button";

interface dataType {
  totalTransaction : number;
  totalSales: number;
  totalTax: number;
  thisMonthSales: {
    date: string;
    sales: number;
  }[];
  thisWeekSales :{
    date: string;
    sales: number;
  }[];
  todaySales :{
    date: string;
    sales: number;
  }[];
  yearlySales: {
    month: string;
    sales: number;
  }[];
}

export default function Home() {
 
  const [type, setType] = useState<"month" | "week" | "today">("month");


  const { data, isFetching } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => axiosInstance.get(`/transaction/analytics/${type}`),
  });

  const [analytics, setAnalytics] = useState<dataType | null>(null);

  useEffect(() => {
    if (data?.data) setAnalytics(data.data);
  }, [data]);


  const mutation = useMutation({
    mutationFn : () => axiosInstance.get(`/transaction/analytics/${type}`),
    onSuccess : (response) => {
      setAnalytics(response.data)
    }, onError : () => errorAlert("error accour")
  })


  const changeType = (value : "month" | "week" | "today") => {
    setType(value)
    mutation.mutate()
  }

  if (!analytics || isFetching) return <LoadingState />;

  return (
    <div className="w-full h-dvh space-y-6 p-4 ">

      
        <div className="w-full h-10 items-center top-0 left-0 flex justify-between">
          <h1 className="md:text-2xl text-lg font-bold text-green-700">
             Dashboard
          </h1>

          <div className="flex gap-2">
            <Button variant="outline"  className={`${type === "month" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => changeType("month")}>Month</Button>
            <Button variant="outline"  className={`${type === "week" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => changeType("week")}>Week</Button>
            <Button variant="outline"  className={`${type === "today" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => changeType("today")}>Today</Button>
          </div>
        </div>
      
     

      <div className="grid md:grid-cols-3  grid-cols-1 gap-4">
        <div className="h-32  rounded">
          <CardTempalte hasPhp={true} title={"Total Sales"} value={analytics.totalSales} />
        </div>
        <div className="h-32  rounded">
          <CardTempalte hasPhp={false} title={"Total Transactions"} value={analytics.totalTransaction} />
        </div>
        <div className="h-32  rounded">
          <CardTempalte hasPhp={true} title={"Total Vat"} value={analytics.totalTax} />
        </div>
      </div>

      <div className="grid   md:grid-cols-4  grid-cols-1 gap-4">
        <div className="col-span-2 h-[300px]  rounded">
          {type === "month" && (
            <MonthlyChart data={analytics.thisMonthSales} />
          )}
          {type === "week" && (
            <WeeklyChart data={analytics.thisWeekSales} />
          )}
          {type === "today" && (
            <TodaySalesChart data={analytics.todaySales} />
          )}
        </div>


        <div className="col-span-2 h-[300px]  rounded ">
          <YearlyBarChart data={analytics.yearlySales} />
        </div>
      </div>

    </div>
  );
}
