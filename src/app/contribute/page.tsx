"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Plus,
  Search,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Languages,
  Sparkles,
} from "lucide-react";
import ContributeContent from "./ContributeContent";

export default function ContributorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for contributions count
  const contributionCounts = {
    pending: 3,
    in_review: 2,
    needs_revision: 1,
    approved: 12,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Contribute to the Dictionary
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Help preserve and grow the Kifuliiru language by adding new words
            and their translations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            {
              icon: BookOpen,
              label: "Total Contributions",
              value: "247",
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: Languages,
              label: "Languages Covered",
              value: "4",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: Sparkles,
              label: "Quality Score",
              value: "98%",
              color: "from-emerald-500 to-emerald-600",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="flex space-x-2 overflow-x-auto p-1 mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <TabsTrigger
                value="new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-purple-50 text-purple-700 hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                New Entry
              </TabsTrigger>
              {["pending", "in_review", "needs_revision", "approved"].map(
                (status) => (
                  <TabsTrigger
                    key={status}
                    value={status}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-gray-50 text-gray-700 hover:opacity-90"
                  >
                    {status === "pending" && <Clock className="h-4 w-4" />}
                    {status === "in_review" && (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {status === "needs_revision" && (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {status === "approved" && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>
                      {status
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                    <Badge
                      variant="secondary"
                      className="ml-1.5 bg-white bg-opacity-20"
                    >
                      {
                        contributionCounts[
                          status as keyof typeof contributionCounts
                        ]
                      }
                    </Badge>
                  </TabsTrigger>
                )
              )}
            </TabsList>

            <TabsContent value="new">
              <ContributeContent />
            </TabsContent>

            {["pending", "in_review", "needs_revision", "approved"].map(
              (status) => (
                <TabsContent key={status} value={status}>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder="Search entries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-12"
                          />
                        </div>
                      </div>
                      <ScrollArea className="h-[600px]">
                        <div className="text-center text-gray-500">
                          Content for {status} tab will go here
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
