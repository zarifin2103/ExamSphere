import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  createdAt: string;
}

interface QuestionBankListProps {
  questionBanks?: QuestionBank[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onAdd?: () => void;
}

const QuestionBankList = ({
  questionBanks = [
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
  ],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onAdd = () => {},
}: QuestionBankListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredQuestionBanks = questionBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Question Banks</h1>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Question Bank
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search question banks..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Question Banks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Questions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestionBanks.length > 0 ? (
                filteredQuestionBanks.map((bank) => (
                  <TableRow key={bank.id}>
                    <TableCell className="font-medium">{bank.name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {bank.description}
                    </TableCell>
                    <TableCell className="text-center">
                      {bank.questionCount}
                    </TableCell>
                    <TableCell>
                      {new Date(bank.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onView(bank.id)}
                          title="View Questions"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(bank.id)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            setDeleteId(bank.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-gray-500"
                  >
                    No question banks found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              question bank and all its questions from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionBankList;
