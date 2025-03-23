import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  questionBankId: z.string({
    required_error: "Please select a question bank",
  }),
  scoringRule: z.object({
    correctPoints: z.coerce.number().min(0, "Points must be a positive number"),
    incorrectPoints: z.coerce.number().default(0),
    unansweredPoints: z.coerce.number().default(0),
  }),
});

interface LinkQuestionBankFormProps {
  examId?: string;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  onCancel?: () => void;
  questionBanks?: Array<{ id: string; name: string }>;
}

const LinkQuestionBankForm = ({
  examId = "",
  onSubmit = () => {},
  onCancel = () => {},
  questionBanks = [
    { id: "qb1", name: "General Knowledge" },
    { id: "qb2", name: "Mathematics" },
    { id: "qb3", name: "Science" },
    { id: "qb4", name: "English" },
  ],
}: LinkQuestionBankFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionBankId: "",
      scoringRule: {
        correctPoints: 1,
        incorrectPoints: 0,
        unansweredPoints: 0,
      },
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <PlusCircle className="h-6 w-6 mr-2 text-primary" />
        <h2 className="text-2xl font-semibold">Link Question Bank to Exam</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="questionBankId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Bank</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a question bank" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {questionBanks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a question bank to link to this exam.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Scoring Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="scoringRule.correctPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer Points</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" step="0.5" />
                    </FormControl>
                    <FormDescription>
                      Points awarded for correct answers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scoringRule.incorrectPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incorrect Answer Points</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} step="0.5" />
                    </FormControl>
                    <FormDescription>
                      Points for incorrect answers (can be negative)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scoringRule.unansweredPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unanswered Points</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} step="0.5" />
                    </FormControl>
                    <FormDescription>
                      Points for unanswered questions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Link Question Bank</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LinkQuestionBankForm;
