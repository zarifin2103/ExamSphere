import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Database } from "lucide-react";
import QuestionList from "@/components/questions/QuestionList";
import QuestionForm from "@/components/questions/QuestionForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestoreDocument } from "@/hooks/useFirestoreDocument";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { where } from "firebase/firestore";
import {
  getQuestionBankById,
  QuestionBank,
} from "@/lib/firebase/questionBanks";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  Question,
} from "@/lib/firebase/questions";


// Using the Question type from firebase/questions.ts

interface QuestionFormValues {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  score: number;
}

const QuestionBankDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Get question bank details
  const {
    document: questionBank,
    loading: bankLoading,
    error: bankError,
  } = useFirestoreDocument<QuestionBank>("questionBanks", id);

  // Get questions for this bank
  const {
    documents: questions,
    loading: questionsLoading,
    error: questionsError,
  } = useFirestoreCollection<Question>(
    "questions",
    id ? [where("questionBankId", "==", id)] : [],
  );
  
  useEffect(() => {
    if (bankError) {
      toast({
        title: "Error",
        description: "Failed to load question bank details.",
        variant: "destructive",
      });
    }

    if (questionsError) {
      toast({
        title: "Error",
        description: "Failed to load questions.",
        variant: "destructive",
      });
    }
  }, [bankError, questionsError]);

  // No mock data needed as we're using Firebase hooks

  const handleAddQuestion = () => {
    setCurrentQuestion(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleViewQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setIsViewOpen(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
      toast({
        title: "Success",
        description: "Question deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (data: QuestionFormValues) => {
    try {
      if (!currentUser) {
        throw new Error("You must be logged in to perform this action");
      }

      if (!id) {
        throw new Error("Question bank ID is missing");
      }

      const questionData = {
        text: data.questionText,
        type: "Multiple Choice",
        score: data.score,
        options: {
          A: data.optionA,
          B: data.optionB,
          C: data.optionC,
          D: data.optionD,
          E: data.optionE,
        },
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        questionBankId: id,
      };

      if (isEditing && currentQuestion) {
        // Update existing question
        await updateQuestion(currentQuestion.id as string, questionData);
        toast({
          title: "Success",
          description: "Question updated successfully.",
        });
      } else {
        // Add new question
        await createQuestion(questionData, currentUser.uid);
        toast({
          title: "Success",
          description: "Question added successfully.",
        });
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving question:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} question.`,
        variant: "destructive",
      });
    }
  };

  const mapQuestionToFormValues = (question: Question): QuestionFormValues => {
    return {
      questionText: question.text,
      optionA: question.options.A,
      optionB: question.options.B,
      optionC: question.options.C,
      optionD: question.options.D,
      optionE: question.options.E,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      score: question.score,
    };
  };

  if (bankLoading || questionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!questionBank) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Question bank not found. It may have been deleted or you don't have
          permission to view it.
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/question-banks")}
          className="mt-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Question Banks
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/question-banks")}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Question Banks
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold">{questionBank.name}</h1>
        </div>
        <p className="text-gray-600">
          {questionBank.description || "No description available"}
        </p>
      </div>

      <QuestionList
        questions={questions}
        onAddQuestion={handleAddQuestion}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onViewQuestion={handleViewQuestion}
        questionBankId={id}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Question" : "Add New Question"}
            </DialogTitle>
          </DialogHeader>
          <QuestionForm
            initialData={
              currentQuestion
                ? mapQuestionToFormValues(currentQuestion)
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            questionBankId={id}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <div className="space-y-4 p-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Question:</h3>
                <p className="p-3 bg-gray-50 rounded-md">
                  {currentQuestion.text}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Options:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(currentQuestion.options).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-md ${currentQuestion.correctAnswer === key ? "bg-green-100 border border-green-300" : "bg-gray-50"}`}
                      >
                        <span className="font-medium">{key}:</span> {value}
                        {currentQuestion.correctAnswer === key && (
                          <span className="ml-2 text-green-600 text-sm font-medium">
                            (Correct)
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Explanation:</h3>
                <p className="p-3 bg-gray-50 rounded-md">
                  {currentQuestion.explanation}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Score:</h3>
                <p className="p-3 bg-gray-50 rounded-md">
                  {currentQuestion.score} points
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsViewOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionBankDetailPage;
