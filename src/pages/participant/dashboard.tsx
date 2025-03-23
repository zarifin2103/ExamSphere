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
import { FileText, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const ParticipantDashboard = () => {
  // Mock data - in a real app, this would come from Firebase
  const upcomingExams = [
    {
      id: "1",
      title: "Mathematics Final",
      date: "2023-12-15",
      status: "Scheduled",
    },
    {
      id: "2",
      title: "Physics Midterm",
      date: "2023-11-20",
      status: "Scheduled",
    },
  ];

  const recentResults = [
    { id: "3", title: "Chemistry Quiz", date: "2023-10-25", score: "85/100" },
    { id: "4", title: "Biology Test", date: "2023-10-10", score: "92/100" },
  ];

  return (
    <DashboardLayout userRole="participant" userName="Student User">
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Exams</CardTitle>
              <CardDescription>Exams scheduled for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingExams.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingExams.length} exams scheduled
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/participant/exams">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Exams
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Results</CardTitle>
              <CardDescription>Your recent exam results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentResults.length}</div>
              <p className="text-xs text-muted-foreground">
                {recentResults.length} results available
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/participant/results">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All Results
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length > 0 ? (
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium">{exam.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {exam.date}
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/participant/exams/${exam.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No upcoming exams scheduled.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            {recentResults.length > 0 ? (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium">{result.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {result.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{result.score}</span>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/participant/results/${result.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No recent results available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParticipantDashboard;
