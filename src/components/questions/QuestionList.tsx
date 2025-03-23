import React, { useState } from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface QuestionListProps {
  questions?: Question[];
  onAddQuestion?: () => void;
  onEditQuestion?: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onViewQuestion?: (question: Question) => void;
  questionBankId?: string;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions = [
    {
      id: "1",
      text: "What is the capital of France?",
      type: "Multiple Choice",
      score: 5,
      options: {
        A: "London",
        B: "Berlin",
        C: "Paris",
        D: "Madrid",
        E: "Rome",
      },
      correctAnswer: "C",
      explanation: "Paris is the capital and most populous city of France.",
    },
    {
      id: "2",
      text: "Which planet is known as the Red Planet?",
      type: "Multiple Choice",
      score: 3,
      options: {
        A: "Venus",
        B: "Mars",
        C: "Jupiter",
        D: "Saturn",
        E: "Mercury",
      },
      correctAnswer: "B",
      explanation:
        "Mars is called the Red Planet because of the reddish color of its surface.",
    },
    {
      id: "3",
      text: "What is the chemical symbol for gold?",
      type: "Multiple Choice",
      score: 4,
      options: {
        A: "Au",
        B: "Ag",
        C: "Fe",
        D: "Cu",
        E: "Pt",
      },
      correctAnswer: "A",
      explanation:
        'The chemical symbol for gold is Au, derived from the Latin word "aurum".',
    },
  ],
  onAddQuestion = () => {},
  onEditQuestion = () => {},
  onDeleteQuestion = () => {},
  onViewQuestion = () => {},
  questionBankId = "",
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuestion) {
      onDeleteQuestion(selectedQuestion.id);
      setDeleteDialogOpen(false);
      setSelectedQuestion(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        <Button onClick={onAddQuestion} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      <Table>
        <TableCaption>List of questions in this question bank</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Question</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No questions found. Click "Add Question" to create one.
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">
                  {question.text.length > 100
                    ? `${question.text.substring(0, 100)}...`
                    : question.text}
                </TableCell>
                <TableCell>{question.type}</TableCell>
                <TableCell>{question.score}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewQuestion(question)}
                      title="View Question"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditQuestion(question)}
                      title="Edit Question"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(question)}
                      title="Delete Question"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionList;
