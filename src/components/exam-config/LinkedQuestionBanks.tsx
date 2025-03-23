import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Settings, Plus } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface QuestionBank {
  id: string;
  name: string;
  questionCount: number;
  scoringRule: string;
}

interface LinkedQuestionBanksProps {
  examId?: string;
  questionBanks?: QuestionBank[];
  onRemove?: (id: string) => void;
  onConfigureScoring?: (id: string) => void;
}

const LinkedQuestionBanks = ({
  examId = "exam-1",
  questionBanks = [
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
  ],
  onRemove = (id) => console.log(`Remove question bank ${id}`),
  onConfigureScoring = (id) => console.log(`Configure scoring for ${id}`),
}: LinkedQuestionBanksProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setSelectedBankId(id);
    // In a real implementation, this would open a confirmation dialog
    onRemove(id);
  };

  const handleConfigureScoring = (id: string) => {
    setSelectedBankId(id);
    // In a real implementation, this would open a scoring configuration dialog
    onConfigureScoring(id);
  };

  return (
    <div className="w-full bg-white rounded-md shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Linked Question Banks</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Link Question Bank
        </Button>
      </div>

      {questionBanks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No question banks linked to this exam yet.</p>
          <p className="mt-2">
            Click the "Link Question Bank" button to add question banks to this
            exam.
          </p>
        </div>
      ) : (
        <Table>
          <TableCaption>
            List of question banks linked to this exam
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Question Bank</TableHead>
              <TableHead className="w-[150px]">Questions</TableHead>
              <TableHead className="w-[250px]">Scoring Rule</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionBanks.map((bank) => (
              <TableRow key={bank.id}>
                <TableCell className="font-medium">{bank.name}</TableCell>
                <TableCell>{bank.questionCount}</TableCell>
                <TableCell>{bank.scoringRule}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfigureScoring(bank.id)}
                      className="flex items-center gap-1"
                    >
                      <Settings size={14} />
                      Scoring
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(bank.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LinkedQuestionBanks;
