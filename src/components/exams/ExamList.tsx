import React, { useState } from "react";
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
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";

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

interface ExamListProps {
  exams?: Exam[];
  onCreateExam?: () => void;
  onEditExam?: (examId: string) => void;
  onDeleteExam?: (examId: string) => void;
  onViewExam?: (examId: string) => void;
}

const ExamList: React.FC<ExamListProps> = ({
  exams = [
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
  ],
  onCreateExam = () => console.log("Create exam clicked"),
  onEditExam = (id) => console.log(`Edit exam ${id}`),
  onDeleteExam = (id) => console.log(`Delete exam ${id}`),
  onViewExam = (id) => console.log(`View exam ${id}`),
}) => {
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (exam: Exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (examToDelete) {
      onDeleteExam(examToDelete.id);
      setDeleteDialogOpen(false);
      setExamToDelete(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Exam Management</h2>
        <Button onClick={onCreateExam} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Exam
        </Button>
      </div>

      <Table>
        <TableCaption>List of all exams in the system</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Materials</TableHead>
            <TableHead>Supervisors</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium">{exam.name}</TableCell>
              <TableCell>
                <div>
                  <div>{exam.institution}</div>
                  <div className="text-xs text-gray-500">{exam.address}</div>
                </div>
              </TableCell>
              <TableCell>
                {exam.materials.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {exam.materials.map((material, index) => (
                      <li key={index} className="text-sm">
                        {material}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400 text-sm">
                    No materials required
                  </span>
                )}
              </TableCell>
              <TableCell>
                {exam.supervisors.map((supervisor) => (
                  <div key={supervisor.id} className="text-sm">
                    {supervisor.name}
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewExam(exam.id)}
                    title="View Exam"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditExam(exam.id)}
                    title="Edit Exam"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(exam)}
                    title="Delete Exam"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the exam "{examToDelete?.name}"?
              This action cannot be undone.
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

export default ExamList;
