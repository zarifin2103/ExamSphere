import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ParticipantResults = () => {
  // Mock data - in a real app, this would come from Firebase
  const examResults = [
    {
      id: "3",
      title: "Chemistry Quiz",
      date: "2023-10-25",
      score: "85/100",
      percentage: 85,
      status: "Passed",
    },
    {
      id: "4",
      title: "Biology Test",
      date: "2023-10-10",
      score: "92/100",
      percentage: 92,
      status: "Passed",
    },
  ];

  return (
    <DashboardLayout userRole="participant" userName="Student User">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Results</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exam Results</CardTitle>
          </CardHeader>
          <CardContent>
            {examResults.length > 0 ? (
              <div className="space-y-6">
                {examResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">{result.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {result.date}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{result.score}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.status}
                        </div>
                      </div>
                      <Button asChild variant="outline">
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
                No exam results available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParticipantResults;
