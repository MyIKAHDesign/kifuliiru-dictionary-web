import { useState } from "react";
import {
  Activity,
  Filter,
  User,
  BookOpen,
  RotateCw,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";

interface ActivityItem {
  id: string;
  type: "new" | "edit" | "review" | "approved";
  user: string;
  word: string;
  time: string;
  description: string;
}

export default function RecentActivity() {
  const [filter, setFilter] = useState<
    "all" | "new" | "edit" | "review" | "approved"
  >("all");

  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "new",
      user: "Kabemba A.",
      word: "akasiisa",
      time: "2 hours ago",
      description: "Added a new word",
    },
    {
      id: "2",
      type: "edit",
      user: "Marie K.",
      word: "umuganho",
      time: "4 hours ago",
      description: "Updated translations",
    },
    {
      id: "3",
      type: "review",
      user: "John D.",
      word: "ubuzima",
      time: "5 hours ago",
      description: "Started review",
    },
    {
      id: "4",
      type: "approved",
      user: "Sarah M.",
      word: "amahano",
      time: "6 hours ago",
      description: "Approved entry",
    },
  ];

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "new":
        return <BookOpen className="h-4 w-4" />;
      case "edit":
        return <RotateCw className="h-4 w-4" />;
      case "review":
        return <Activity className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "new":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
      case "edit":
        return "text-orange-500 bg-orange-100 dark:bg-orange-900/20";
      case "review":
        return "text-purple-500 bg-purple-100 dark:bg-purple-900/20";
      case "approved":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
    }
  };

  const filteredActivities = activities.filter(
    (activity) => filter === "all" || activity.type === filter
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter("all")}>
              All Activities
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("new")}>
              New Entries
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("edit")}>
              Edits
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("review")}>
              Reviews
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("approved")}>
              Approved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div
              className={`p-2 rounded-full ${getActivityColor(activity.type)}`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activity.word}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {activity.description}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <User className="h-3 w-3 mr-1" />
                {activity.user}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
