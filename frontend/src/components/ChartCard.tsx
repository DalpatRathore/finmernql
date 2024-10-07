"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
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
import Loader from "./Loader";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS_STATISTICS } from "@/graphql/queries/transaction.query";

export const description = "A donut chart with text";

// Define valid category keys
type Category = "saving" | "investment" | "expense";

// Chart configuration (with strict types)
const chartConfig: Record<Category, { label: string; color: string }> = {
  saving: {
    label: "Saving",
    color: "green",
  },
  investment: {
    label: "Investment",
    color: "blue",
  },
  expense: {
    label: "Expense",
    color: "red",
  },
};

const ChartCard = () => {
  const [chartData, setChartData] = useState<
    { category: Category; totalAmount: number; fill: string }[]
  >([]);
  const { data: statsData, loading: statsLoading } = useQuery(
    GET_TRANSACTIONS_STATISTICS
  );

  useEffect(() => {
    if (statsData?.categoryStatistics) {
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
    }
  }, [statsData]);

  // Calculate total transactions
  const totalTransactions = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Transactions Overview</CardTitle>
        <CardDescription>
          Jan 7, 2024 -{" "}
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
            <Loader />
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
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalTransactions.toLocaleString()}
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
          Trending up by 5.2%
          <>
            <TrendingUpIcon className="h-4 w-4 text-green-600" />
            <TrendingDownIcon className="h-4 w-4 text-rose-600" />
          </>
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total transactions for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartCard;
