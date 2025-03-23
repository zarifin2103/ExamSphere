import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionBankList from "@/components/question-banks/QuestionBankList";
import QuestionBankForm from "@/components/question-banks/QuestionBankForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import {
  getAllQuestionBanks,
  createQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
  QuestionBank,
} from "@/lib/firebase/questionBanks";

const QuestionBankListWithFirebase = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentQuestionBank, setCurrentQuestionBank] =
    useState<QuestionBank | null>(null);

  // Use our custom hook to get real-time updates from Firestore
  const {
    documents: questionBanks,
    loading,
    error,
  } = useFirestoreCollection<QuestionBank>("questionBanks");

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load question banks. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleAddQuestionBank = () => {
    setCurrentQuestionBank(null);
    setIsFormOpen(true);
  };

  const handleEditQuestionBank = (id: string) => {
    const questionBank = questionBanks.find((bank) => bank.id === id);
    if (questionBank) {
      setCurrentQuestionBank(questionBank);
      setIsFormOpen(true);
    }
  };

  const handleDeleteQuestionBank = async (id: string) => {
    try {
      await deleteQuestionBank(id);
      toast({
        title: "Success",
        description: "Question bank deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting question bank:", error);
      toast({
        title: "Error",
        description: "Failed to delete question bank.",
        variant: "destructive",
      });
    }
  };

  const handleViewQuestions = (id: string) => {
    navigate(`/admin/question-banks/${id}`);
  };

  const handleFormSubmit = async (data: {
    name: string;
    description?: string;
  }) => {
    try {
      if (!currentUser) {
        throw new Error("You must be logged in to perform this action");
      }

      if (currentQuestionBank) {
        // Update existing question bank
        await updateQuestionBank(currentQuestionBank.id as string, {
          name: data.name,
          description: data.description || "",
        });
        toast({
          title: "Success",
          description: "Question bank updated successfully.",
        });
      } else {
        // Create new question bank
        await createQuestionBank(
          {
            name: data.name,
            description: data.description || "",
          },
          currentUser.uid,
        );
        toast({
          title: "Success",
          description: "Question bank created successfully.",
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving question bank:", error);
      toast({
        title: "Error",
        description: `Failed to ${currentQuestionBank ? "update" : "create"} question bank.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading question banks...
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <QuestionBankList
        questionBanks={questionBanks}
        onAdd={handleAddQuestionBank}
        onEdit={handleEditQuestionBank}
        onDelete={handleDeleteQuestionBank}
        onView={handleViewQuestions}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <QuestionBankForm
            questionBank={currentQuestionBank || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionBankListWithFirebase;
