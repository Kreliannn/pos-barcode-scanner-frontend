"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ResponsiveContainer } from "recharts"



const chartConfig = {
  sales: {
    label: "Sales",
    color: "#10b981", // Dark green (Tailwind's emerald-800)
  },
} satisfies ChartConfig


export function MonthlyChart({ data } : { data : {date : string, sales : number}[]}) {
  return (
    <Card className="h-full">
        <CardHeader className="pb-2">
        <CardTitle className="text-sm">Monthly Sales Chart</CardTitle>
        <CardDescription className="text-xs">
            Showing sales history for this month
        </CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] p-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={2}
                tick={{ fontSize: 11 }}
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                dataKey="sales"
                type="natural"
                fill="var(--color-sales)"
                fillOpacity={0.4}
                stroke="var(--color-sales)"
                />
            </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
        </CardContent>
     </Card>
  )
}

export default MonthlyChart