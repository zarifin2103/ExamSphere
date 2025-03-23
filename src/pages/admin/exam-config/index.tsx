import React, { useState } from "react";
import { Cog, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ExamSelector from "@/components/exam-config/ExamSelector";
import LinkedQuestionBanks from "@/components/exam-config/LinkedQuestionBanks";
import LinkQuestionBankForm from "@/components/exam-config/LinkQuestionBankForm";

interface QuestionBank {
  id: string;
  name: string;
  questionCount: number;
  scoringRule: string;
}

const ExamConfigPage = () => {
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [linkedQuestionBanks, setLinkedQuestionBanks] = useState<
    QuestionBank[]
  >([
    {
      id: "qb-1",
      name: "Mathematics Fundamentals",
      questionCount: 25,
      scoringRule: "1 point per question",
    },
    {
      id: "qb-2",
      name: "Physics Principles",
      questionCount: 15,
      scoringRule: "2 points per question",
    },
    {
      id: "qb-3",
      name: "Chemistry Basics",
      questionCount: 20,
      scoringRule: "1.5 points per question",
    },
  ]);

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    // In a real app, this would fetch the linked question banks for the selected exam
  };

  const handleRemoveQuestionBank = (id: string) => {
    // In a real app, this would call an API to remove the link
    setLinkedQuestionBanks(
      linkedQuestionBanks.filter((bank) => bank.id !== id),
    );
  };

  const handleConfigureScoring = (id: string) => {
    // In a real app, this would open a dialog to configure scoring
    console.log(`Configure scoring for question bank ${id}`);
  };

  const handleLinkQuestionBank = (data: any) => {
    // In a real app, this would call an API to link the question bank
    const newBank = {
      id: data.questionBankId,
      name: `Question Bank ${data.questionBankId}`,
      questionCount: Math.floor(Math.random() * 30) + 10,
      scoringRule: `${data.scoringRule.correctPoints} points per correct answer`,
    };
    setLinkedQuestionBanks([...linkedQuestionBanks, newBank]);
    setIsLinkFormOpen(false);
  };

  return (
    <div className="container mx-auto py-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Exam Configuration</h1>
          <p className="text-gray-500 mt-1">
            Link question banks to exams and configure scoring rules
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Cog size={16} />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Exam</CardTitle>
            <CardDescription>
              Choose an exam to configure its question banks and scoring rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExamSelector
              selectedExamId={selectedExamId}
              onExamSelect={handleExamSelect}
            />
          </CardContent>
        </Card>

        {selectedExamId && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Question Banks</CardTitle>
                <CardDescription>
                  Manage question banks linked to this exam
                </CardDescription>
              </div>
              <Dialog open={isLinkFormOpen} onOpenChange={setIsLinkFormOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle size={16} />
                    Link Question Bank
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <LinkQuestionBankForm
                    examId={selectedExamId}
                    onSubmit={handleLinkQuestionBank}
                    onCancel={() => setIsLinkFormOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <LinkedQuestionBanks
                examId={selectedExamId}
                questionBanks={linkedQuestionBanks}
                onRemove={handleRemoveQuestionBank}
                onConfigureScoring={handleConfigureScoring}
              />
            </CardContent>
          </Card>
        )}

        {!selectedExamId && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Cog size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Exam Selected
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Please select an exam from the dropdown above to configure its
              question banks and scoring rules.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamConfigPage;
