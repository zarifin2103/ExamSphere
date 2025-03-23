import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Exam {
  id: string;
  name: string;
  institution: string;
}

interface ExamSelectorProps {
  exams?: Exam[];
  selectedExamId?: string;
  onExamSelect?: (examId: string) => void;
}

const ExamSelector = ({
  exams = [
    { id: "1", name: "Mathematics Final Exam", institution: "ABC High School" },
    { id: "2", name: "Physics Midterm", institution: "XYZ University" },
    {
      id: "3",
      name: "English Proficiency Test",
      institution: "Language Institute",
    },
    {
      id: "4",
      name: "Programming Skills Assessment",
      institution: "Tech Academy",
    },
    {
      id: "5",
      name: "Civil Service Examination",
      institution: "Government Agency",
    },
  ],
  selectedExamId = "",
  onExamSelect = () => {},
}: ExamSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedExamId);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onExamSelect(currentValue);
    setOpen(false);
  };

  const selectedExam = exams.find((exam) => exam.id === value);

  return (
    <div className="w-full max-w-md bg-white p-4 rounded-md shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select an Exam to Configure
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedExam ? (
              <span>
                {selectedExam.name}{" "}
                <span className="text-gray-500 text-sm">
                  ({selectedExam.institution})
                </span>
              </span>
            ) : (
              "Select an exam..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search exams..." />
            <CommandEmpty>No exams found.</CommandEmpty>
            <CommandGroup>
              {exams.map((exam) => (
                <CommandItem
                  key={exam.id}
                  value={exam.id}
                  onSelect={(value) => handleSelect(value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === exam.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div>
                    <div>{exam.name}</div>
                    <div className="text-xs text-gray-500">
                      {exam.institution}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExamSelector;
