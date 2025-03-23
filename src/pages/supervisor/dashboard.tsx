import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const SupervisorDashboard = () => {
  // Mock data - in a real app, this would come from Firebase
  const assignedExams = [
    {
      id: "1",
      title: "Mathematics Final",
      date: "2023-12-15",
      participants: 45,
      status: "Scheduled",
    },
    {
      id: "2",
      title: "Physics Midterm",
      date: "2023-11-20",
      participants: 32,
      status: "Scheduled",
    },
  ];

  const activeExams = [
    { 
      id: "3", 
      title: "Chemistry Quiz", 
      date: "2023-10-25", 
      participants: 28,
      status: "In Progress" 
    },
  ];

  return (
    <DashboardLayout userRole="supervisor" userName="Supervisor User">
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Assigned Exams</CardTitle>
              <CardDescription>Exams you are supervising</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedExams.length}</div>
              <p className="text-xs text-muted-foreground">
                {assignedExams.length} exams assigned
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/supervisor/exams">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Assigned Exams
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Exams</CardTitle>
              <CardDescription>Currently running exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeExams.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeExams.length} exams in progress
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/supervisor/monitor">
                    <Activity className="mr-2 h-4 w-4" />
                    Monitor Active Exams
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedExams.length > 0 ? (
              <div className="space-y-4">
                {assignedExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium">{exam.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {exam.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Participants: {exam.participants}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/supervisor/exams/${exam.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No exams assigned yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {activeExams.length > 0 ? (
              <div className="space-y-4">
                {activeExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium">{exam.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {exam.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Participants: {exam.participants}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        {exam.status}
                      </p>
                    </div>
                    <Button asChild variant="default" size="sm">
                      <Link to={`/supervisor/monitor/${exam.id}`}>
                        <Users className="mr-2 h-4 w-4" />
                        Monitor
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No active exams at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;