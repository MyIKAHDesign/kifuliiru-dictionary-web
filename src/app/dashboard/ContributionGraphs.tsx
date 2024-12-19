import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

const data = [
  { month: "Jan", contributions: 65, reviews: 40, approved: 35 },
  { month: "Feb", contributions: 75, reviews: 55, approved: 45 },
  { month: "Mar", contributions: 85, reviews: 65, approved: 55 },
  { month: "Apr", contributions: 95, reviews: 75, approved: 65 },
  { month: "May", contributions: 120, reviews: 90, approved: 80 },
  { month: "Jun", contributions: 150, reviews: 110, approved: 95 },
];

type ChartType = "line" | "bar" | "area";

export default function ContributionGraphs() {
  const [chartType, setChartType] = useState<ChartType>("line");

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="contributions"
              stroke="#6366f1"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="reviews"
              stroke="#f59e0b"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="approved"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="contributions" fill="#6366f1" />
            <Bar dataKey="reviews" fill="#f59e0b" />
            <Bar dataKey="approved" fill="#10b981" />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="contributions"
              stackId="1"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="reviews"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="approved"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contribution Overview</CardTitle>
        <Select
          value={chartType}
          onValueChange={(value: ChartType) => setChartType(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
