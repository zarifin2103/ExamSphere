import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Activity,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalExams: 0,
    totalQuestionBanks: 0,
    totalUsers: 0,
    activeExams: 0,
  });

  // Simulating data fetching from Firebase
  useEffect(() => {
    // In a real implementation, this would fetch data from Firebase
    const fetchDashboardData = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      setStats({
        totalExams: 12,
        totalQuestionBanks: 8,
        totalUsers: 156,
        activeExams: 3,
      });
    };

    fetchDashboardData();
  }, []);

  // Recent activity mock data
  const recentActivity = [
    {
      id: 1,
      action: "New exam created",
      name: "Final Mathematics Exam",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Question bank updated",
      name: "Science Fundamentals",
      time: "5 hours ago",
    },
    {
      id: 3,
      action: "New user registered",
      name: "Sarah Johnson",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "Exam completed",
      name: "English Literature Test",
      time: "2 days ago",
    },
  ];

  // Upcoming exams mock data
  const upcomingExams = [
    {
      id: 1,
      name: "Physics Final Exam",
      date: "Tomorrow, 10:00 AM",
      participants: 45,
    },
    {
      id: 2,
      name: "Computer Science Midterm",
      date: "Oct 15, 2023, 2:00 PM",
      participants: 32,
    },
    {
      id: 3,
      name: "Mathematics Assessment",
      date: "Oct 20, 2023, 9:00 AM",
      participants: 78,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 bg-gray-50">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your examination system and activities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Exams"
            value={stats.totalExams}
            icon={FileText}
            description="All exams in the system"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Question Banks"
            value={stats.totalQuestionBanks}
            icon={BookOpen}
            description="Available question banks"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Registered Users"
            value={stats.totalUsers}
            icon={Users}
            description="Total system users"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Active Exams"
            value={stats.activeExams}
            icon={Activity}
            description="Currently active exams"
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/exams">
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50"
            >
              <FileText className="h-6 w-6" />
              <span>Manage Exams</span>
            </Button>
          </Link>
          <Link to="/admin/question-banks">
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50"
            >
              <BookOpen className="h-6 w-6" />
              <span>Question Banks</span>
            </Button>
          </Link>
          <Link to="/admin/exam-config">
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50"
            >
              <Settings className="h-6 w-6" />
              <span>Configure Exams</span>
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50"
            >
              <Users className="h-6 w-6" />
              <span>User Management</span>
            </Button>
          </Link>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.name}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>
                  Exams scheduled in the near future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{exam.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          <Users className="h-4 w-4 inline mr-1" />
                          {exam.participants}
                        </span>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
