import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  questionText: z.string().min(1, { message: "Question text is required" }),
  optionA: z.string().min(1, { message: "Option A is required" }),
  optionB: z.string().min(1, { message: "Option B is required" }),
  optionC: z.string().min(1, { message: "Option C is required" }),
  optionD: z.string().min(1, { message: "Option D is required" }),
  optionE: z.string().min(1, { message: "Option E is required" }),
  correctAnswer: z.enum(["A", "B", "C", "D", "E"], {
    required_error: "Please select the correct answer",
  }),
  explanation: z.string().min(1, { message: "Explanation is required" }),
  score: z.coerce.number().min(1, { message: "Score must be at least 1" }),
});

type QuestionFormValues = z.infer<typeof formSchema>;

interface QuestionFormProps {
  initialData?: QuestionFormValues;
  onSubmit?: (data: QuestionFormValues) => void;
  onCancel?: () => void;
  questionBankId?: string;
}

const QuestionForm = ({
  initialData,
  onSubmit,
  onCancel,
  questionBankId = "default-bank-id",
}: QuestionFormProps) => {
  const defaultValues: QuestionFormValues = initialData || {
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    optionE: "",
    correctAnswer: "A",
    explanation: "",
    score: 1,
  };

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: QuestionFormValues) => {
    onSubmit?.(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Question" : "Add New Question"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="questionText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the question text"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the full text of the question.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="optionA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option A</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter option A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="optionB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option B</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter option B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="optionC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option C</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter option C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="optionD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option D</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter option D" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="optionE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option E</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter option E" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the correct answer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">Option A</SelectItem>
                      <SelectItem value="B">Option B</SelectItem>
                      <SelectItem value="C">Option C</SelectItem>
                      <SelectItem value="D">Option D</SelectItem>
                      <SelectItem value="E">Option E</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the explanation for the correct answer"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide an explanation for why the correct answer is correct.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter the score for this question"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the number of points this question is worth.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save Question
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionForm;
