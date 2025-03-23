import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ParticipantExams = () => {
  // Mock data - in a real app, this would come from Firebase
  const availableExams = [
    {
      id: "1",
      title: "Mathematics Final",
      date: "2023-12-15",
      duration: "3 hours",
      status: "Upcoming",
    },
    {
      id: "2",
      title: "Physics Midterm",
      date: "2023-11-20",
      duration: "2 hours",
      status: "Upcoming",
    },
    {
      id: "3",
      title: "Chemistry Quiz",
      date: "2023-10-25",
      duration: "1 hour",
      status: "Completed",
    },
    {
      id: "4",
      title: "Biology Test",
      date: "2023-10-10",
      duration: "1.5 hours",
      status: "Completed",
    },
  ];

  return (
    <DashboardLayout userRole="participant" userName="Student User">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Available Exams</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {availableExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{exam.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:gap-6">
                      <p className="text-sm text-muted-foreground">
                        Date: {exam.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {exam.duration}
                      </p>
                    </div>
                    <div className="mt-2">
                      <Badge
                        variant={
                          exam.status === "Upcoming" ? "outline" : "secondary"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    {exam.status === "Upcoming" ? (
                      <Button asChild>
                        <Link to={`/participant/exams/${exam.id}`}>
                          View Details
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline">
                        <Link to={`/participant/results/${exam.id}`}>
                          View Results
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParticipantExams;
