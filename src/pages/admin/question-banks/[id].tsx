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

interface Question {
  id: string;
  text: string;
  type: string;
  score: number;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
}

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
  const [questionBank, setQuestionBank] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from Firebase
    setQuestionBank({
      id: id || "default-id",
      name: "Mathematics Question Bank",
      description: "Collection of mathematics questions for high school exams",
    });

    setQuestions([
      {
        id: "1",
        text: "What is the value of π (pi) to two decimal places?",
        type: "Multiple Choice",
        score: 5,
        options: {
          A: "3.10",
          B: "3.14",
          C: "3.16",
          D: "3.18",
          E: "3.20",
        },
        correctAnswer: "B",
        explanation: "The value of π (pi) to two decimal places is 3.14.",
      },
      {
        id: "2",
        text: "Solve for x: 2x + 5 = 15",
        type: "Multiple Choice",
        score: 3,
        options: {
          A: "x = 3",
          B: "x = 4",
          C: "x = 5",
          D: "x = 6",
          E: "x = 7",
        },
        correctAnswer: "C",
        explanation:
          "To solve for x: 2x + 5 = 15, subtract 5 from both sides: 2x = 10, then divide both sides by 2: x = 5.",
      },
      {
        id: "3",
        text: "What is the area of a circle with radius 4 units?",
        type: "Multiple Choice",
        score: 4,
        options: {
          A: "16π square units",
          B: "8π square units",
          C: "4π square units",
          D: "64π square units",
          E: "32π square units",
        },
        correctAnswer: "A",
        explanation:
          "The area of a circle is calculated using the formula A = πr². With r = 4, A = π(4)² = 16π square units.",
      },
    ]);
  }, [id]);

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

  const handleDeleteQuestion = (questionId: string) => {
    // In a real app, this would delete from Firebase
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleFormSubmit = (data: QuestionFormValues) => {
    // In a real app, this would save to Firebase
    if (isEditing && currentQuestion) {
      // Update existing question
      const updatedQuestions = questions.map((q) => {
        if (q.id === currentQuestion.id) {
          return {
            ...q,
            text: data.questionText,
            options: {
              A: data.optionA,
              B: data.optionB,
              C: data.optionC,
              D: data.optionD,
              E: data.optionE,
            },
            correctAnswer: data.correctAnswer,
            explanation: data.explanation,
            score: data.score,
          };
        }
        return q;
      });
      setQuestions(updatedQuestions);
    } else {
      // Add new question
      const newQuestion: Question = {
        id: Date.now().toString(), // Generate a temporary ID
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
      };
      setQuestions([...questions, newQuestion]);
    }
    setIsFormOpen(false);
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
          <h1 className="text-2xl font-bold">
            {questionBank?.name || "Question Bank"}
          </h1>
        </div>
        <p className="text-gray-600">
          {questionBank?.description || "No description available"}
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
