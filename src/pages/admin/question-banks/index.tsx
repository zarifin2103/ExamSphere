 } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuestionBankList from "@/components/question-banks/QuestionBankList";
import QuestionBankForm from "@/components/question-banks/QuestionBankForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  createdAt: string;
}

const QuestionBanksPage = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentQuestionBank, setCurrentQuestionBank] =
    useState<QuestionBank | null>(null);

  // Mock data - in a real app, this would come from Firebase
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([
    {
      id: "1",
      name: "Mathematics Grade 10",
      description: "Basic algebra and geometry questions for 10th grade",
      questionCount: 25,
      createdAt: "2023-05-15",
    },
    {
      id: "2",
      name: "English Literature",
      description: "Questions about classic novels and poetry",
      questionCount: 30,
      createdAt: "2023-06-20",
    },
    {
      id: "3",
      name: "Computer Science Fundamentals",
      description: "Basic programming concepts and algorithms",
      questionCount: 40,
      createdAt: "2023-07-10",
    },
  ]);

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

  const handleDeleteQuestionBank = (id: string) => {
    // In a real app, this would delete from Firebase
    setQuestionBanks(questionBanks.filter((bank) => bank.id !== id));
    toast({
      title: "Success",
      description: "Question bank deleted successfully.",
    });
  };

  const handleViewQuestions = (id: string) => {
    // Navigate to the question management page for this bank
    navigate(`/admin/question-banks/${id}`);
  };

  const handleFormSubmit = (data: { name: string; description?: string }) => {
    if (currentQuestionBank) {
      // Update existing question bank
      setQuestionBanks(
        questionBanks.map((bank) =>
          bank.id === currentQuestionBank.id
            ? { ...bank, name: data.name, description: data.description || "" }
            : bank,
        ),
      );
    } else {
      // Create new question bank
      const newQuestionBank: QuestionBank = {
        id: `${Date.now()}`, // In a real app, this would be a Firebase ID
        name: data.name,
        description: data.description || "",
        questionCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setQuestionBanks([...questionBanks, newQuestionBank]);
    }
    setIsFormOpen(false);
  };

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
};

export default QuestionBanksPage;
