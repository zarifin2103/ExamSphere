import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ExamList from "@/components/exams/ExamList";
import ExamForm from "@/components/exams/ExamForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Supervisor {
  id: string;
  name: string;
}

interface Exam {
  id: string;
  name: string;
  institution: string;
  address: string;
  materials: string[];
  supervisors: Supervisor[];
  notes?: string;
}

const ExamsPage = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock exams data
  const [exams, setExams] = useState<Exam[]>([
    {
      id: "1",
      name: "Mathematics Final Exam",
      institution: "Springfield High School",
      address: "123 Education St, Springfield",
      materials: ["Calculator", "Ruler", "Graph paper"],
      supervisors: [
        { id: "s1", name: "John Smith" },
        { id: "s2", name: "Jane Doe" },
      ],
      notes: "Standard 2-hour exam format",
    },
    {
      id: "2",
      name: "Science Midterm",
      institution: "Riverside Academy",
      address: "456 Learning Ave, Riverside",
      materials: ["Periodic Table", "Calculator"],
      supervisors: [{ id: "s3", name: "Robert Johnson" }],
    },
    {
      id: "3",
      name: "English Literature Assessment",
      institution: "Central University",
      address: "789 Knowledge Blvd, Central City",
      materials: ["Dictionary"],
      supervisors: [
        { id: "s4", name: "Emily Wilson" },
        { id: "s5", name: "Michael Brown" },
      ],
      notes: "Open book examination",
    },
  ]);

  const handleCreateExam = () => {
    setCurrentExam(null);
    setIsFormOpen(true);
  };

  const handleEditExam = (examId: string) => {
    const examToEdit = exams.find((exam) => exam.id === examId);
    if (examToEdit) {
      // Convert to form values format
      const formValues = {
        name: examToEdit.name,
        institution: examToEdit.institution,
        address: examToEdit.address,
        materials: examToEdit.materials,
        supervisors: examToEdit.supervisors.map((s) => s.name),
        notes: examToEdit.notes || "",
      };
      setCurrentExam(examToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDeleteExam = (examId: string) => {
    // In a real app, this would call an API to delete the exam
    setExams(exams.filter((exam) => exam.id !== examId));
  };

  const handleViewExam = (examId: string) => {
    // Navigate to exam detail page
    // In a real app, this would navigate to a detailed view
    console.log(`Viewing exam ${examId}`);
  };

  const handleFormSubmit = (data: any) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (currentExam) {
        // Update existing exam
        setExams(
          exams.map((exam) => {
            if (exam.id === currentExam.id) {
              return {
                ...exam,
                name: data.name,
                institution: data.institution,
                address: data.address,
                materials: data.materials,
                supervisors: data.supervisors.map(
                  (name: string, index: number) => ({
                    id: `s${index + 1}`,
                    name,
                  }),
                ),
                notes: data.notes,
              };
            }
            return exam;
          }),
        );
      } else {
        // Create new exam
        const newExam: Exam = {
          id: `${exams.length + 1}`,
          name: data.name,
          institution: data.institution,
          address: data.address,
          materials: data.materials,
          supervisors: data.supervisors.map((name: string, index: number) => ({
            id: `s${Date.now()}-${index}`,
            name,
          })),
          notes: data.notes,
        };
        setExams([...exams, newExam]);
      }

      setIsLoading(false);
      setIsFormOpen(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto bg-gray-50">
        {isFormOpen ? (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setIsFormOpen(false)}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Exam List
            </Button>

            <ExamForm
              exam={
                currentExam
                  ? {
                      name: currentExam.name,
                      institution: currentExam.institution,
                      address: currentExam.address,
                      materials: currentExam.materials,
                      supervisors: currentExam.supervisors.map((s) => s.name),
                      notes: currentExam.notes || "",
                    }
                  : undefined
              }
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <ExamList
            exams={exams}
            onCreateExam={handleCreateExam}
            onEditExam={handleEditExam}
            onDeleteExam={handleDeleteExam}
            onViewExam={handleViewExam}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamsPage;
