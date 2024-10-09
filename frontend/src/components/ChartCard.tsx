"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDaysIcon,
  MinusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS_STATISTICS } from "@/graphql/queries/transaction.query";
import SpinnerSvg from "./SpinnerSvg";
import { cn } from "@/lib/utils";

export const description = "A donut chart with text";

// Define valid category keys
type Category = "saving" | "investment" | "expense";

// Chart configuration (with strict types)
const chartConfig: Record<Category, { label: string; color: string }> = {
  saving: {
    label: "Saving",
    color: "#086e2f",
  },
  investment: {
    label: "Investment",
    color: "#0b86cd",
  },
  expense: {
    label: "Expense",
    color: "#a90808",
  },
};

// Corrected helper function to calculate percentage and trend direction
const calculateTrend = (
  investment: number,
  saving: number,
  expense: number
) => {
  const totalIncome = investment + saving + expense;
  const comparison = investment + saving;

  if (expense > comparison) {
    const downwardPercentage = ((expense - comparison) / totalIncome) * 100;
    return {
      percentage: downwardPercentage.toFixed(2),
      trendingUp: false, // Downward trend
    };
  } else {
    const upwardPercentage = ((comparison - expense) / totalIncome) * 100;
    return {
      percentage: upwardPercentage.toFixed(2),
      trendingUp: true, // Upward trend
    };
  }
};

// Helper function to calculate the difference in months
const getMonthDifference = (startDate: Date, currentDate: Date) => {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  return (currentYear - startYear) * 12 + (currentMonth - startMonth);
};

// Use chartConfig to set up the initial state correctly
const initialChartData: {
  category: Category;
  totalAmount: number;
  fill: string;
}[] = [
  { category: "saving", totalAmount: 1, fill: chartConfig.saving.color },
  {
    category: "investment",
    totalAmount: 1,
    fill: chartConfig.investment.color,
  },
  { category: "expense", totalAmount: 1, fill: chartConfig.expense.color },
];

const ChartCard = ({ createdAt }: { createdAt: string }) => {
  const [chartData, setChartData] =
    useState<{ category: Category; totalAmount: number; fill: string }[]>(
      initialChartData
    );
  const { data: statsData, loading: statsLoading } = useQuery(
    GET_TRANSACTIONS_STATISTICS
  );

  useEffect(() => {
    if (
      statsData?.categoryStatistics &&
      statsData.categoryStatistics.length > 0
    ) {
      const formattedData = statsData.categoryStatistics.map(
        (stat: { category: string; totalAmount: number }) => {
          // Type check to ensure the category is valid
          if (stat.category in chartConfig) {
            return {
              ...stat,
              category: stat.category as Category, // cast to Category
              fill: chartConfig[stat.category as Category].color,
            };
          }
          return { category: "expense", totalAmount: 0, fill: "grey" }; // fallback case
        }
      );
      setChartData(formattedData);
    } else {
      setChartData(initialChartData);
    }
  }, [statsData]);
  // Calculate total transactions
  const totalTransactions = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [chartData]);

  // Get total saving, investment, and expense
  const saving =
    chartData.find(item => item.category === "saving")?.totalAmount || 0;
  const investment =
    chartData.find(item => item.category === "investment")?.totalAmount || 0;
  const expense =
    chartData.find(item => item.category === "expense")?.totalAmount || 0;

  // Calculate the trend
  const { percentage, trendingUp } = calculateTrend(
    investment,
    saving,
    expense
  );

  const startDate = new Date(Number(createdAt));

  // Get the difference in months
  const monthDifference = getMonthDifference(startDate, new Date());

  return (
    <Card className="flex flex-col relative">
      <span className="absolute flex h-3 w-3 -top-1 -right-1">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full  opacity-75",

            trendingUp ? "bg-green-500" : "bg-rose-500"
          )}
        ></span>
        <span
          className={cn(
            "absolute inline-flex rounded-full h-3 w-3",

            trendingUp ? "bg-green-600" : "bg-rose-600"
          )}
        ></span>
      </span>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">Transactions Overview</CardTitle>
        <CardDescription className="flex items-center">
          <CalendarDaysIcon className="w-4 h-4 mr-1"></CalendarDaysIcon>
          {startDate.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          <MinusIcon className="w-4 h-4 mx-1"></MinusIcon>
          {new Date().toLocaleDateString("default", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {statsLoading ? (
          <div className="mx-auto aspect-square max-h-[250px]">
            <div className="flex items-center justify-center h-full w-full px-5">
              <SpinnerSvg></SpinnerSvg>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="totalAmount"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className={cn(
                              "fill-foreground text-3xl font-bold",

                              totalTransactions > 10000 && "text-2xl",
                              totalTransactions > 100000 && "text-xl"
                            )}
                          >
                            ${totalTransactions.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Transactions
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {trendingUp ? (
            <>
              Trending up by {percentage}%
              <TrendingUpIcon className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <>
              Trending down by {percentage}%
              <TrendingDownIcon className="h-4 w-4 text-rose-600" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          <div className="leading-none text-muted-foreground">
            {monthDifference
              ? ` Showing total transactions for the last ${monthDifference} months`
              : "Showing total transactions for current month"}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartCard;
