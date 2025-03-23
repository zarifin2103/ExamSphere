import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ExamList from "@/components/exams/ExamList";
import ExamForm from "@/components/exams/ExamForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createExam, updateExam, deleteExam, getAllExams, Exam, Supervisor } from "@/lib/firebase/exams";

const ExamsPage = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const { user } = useAuth();
  
  // Load exams from Firestore
  useEffect(() => {
    const loadExams = async () => {
      try {
        setIsLoading(true);
        const examsData = await getAllExams();
        setExams(examsData);
      } catch (error) {
        console.error("Error loading exams:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExams();
  }, []);

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

  const handleDeleteExam = async (examId: string) => {
    try {
      setIsLoading(true);
      // Delete exam from Firestore
      await deleteExam(examId);
      // Update local state
      setExams(exams.filter((exam) => exam.id !== examId));
    } catch (error) {
      console.error("Error deleting exam:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewExam = (examId: string) => {
    // Navigate to exam detail page
    // In a real app, this would navigate to a detailed view
    console.log(`Viewing exam ${examId}`);
  };

  const handleFormSubmit = async (data: any) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    setIsLoading(true);

    try {
      // Convert supervisors from string array to Supervisor objects
      const supervisorsData = data.supervisors.map((name: string, index: number) => ({
        id: `s${Date.now()}-${index}`,
        name,
      }));
      
      const examData = {
        name: data.name,
        institution: data.institution,
        address: data.address,
        materials: data.materials,
        supervisors: supervisorsData,
        notes: data.notes,
      };
      
      if (currentExam && currentExam.id) {
        // Update existing exam in Firestore
        await updateExam(currentExam.id, examData);
        
        // Update local state
        setExams(
          exams.map((exam) => {
            if (exam.id === currentExam.id) {
              return {
                ...exam,
                ...examData,
              };
            }
            return exam;
          })
        );
      } else {
        // Create new exam in Firestore
        const newExam = await createExam(examData, user.uid);
        
        // Update local state
        setExams([...exams, newExam]);
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving exam:", error);
    } finally {
      setIsLoading(false);
    }
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
