import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
});

type QuestionBankFormValues = z.infer<typeof formSchema>;

interface QuestionBankFormProps {
  questionBank?: {
    id?: string;
    name: string;
    description?: string;
  };
  onSubmit: (data: QuestionBankFormValues) => void;
  onCancel: () => void;
}

const QuestionBankForm = ({
  questionBank = {
    name: "",
    description: "",
  },
  onSubmit,
  onCancel = () => {},
}: QuestionBankFormProps) => {
  const form = useForm<QuestionBankFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: questionBank.name,
      description: questionBank.description,
    },
  });

  const handleSubmit = (data: QuestionBankFormValues) => {
    try {
      onSubmit(data);
      toast({
        title: "Success",
        description: `Question bank ${questionBank.id ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${questionBank.id ? "update" : "create"} question bank.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {questionBank.id ? "Edit" : "Create"} Question Bank
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter question bank name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this question bank.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for this question bank"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide additional details about this question
                    bank.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {questionBank.id ? "Update" : "Create"} Question Bank
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuestionBankForm;
