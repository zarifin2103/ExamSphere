import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2 } from "lucide-react";

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
  name: z
    .string()
    .min(2, { message: "Exam name must be at least 2 characters" }),
  institution: z.string().min(2, { message: "Institution name is required" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  materials: z
    .array(z.string())
    .min(1, { message: "At least one material is required" }),
  supervisors: z
    .array(z.string())
    .min(1, { message: "At least one supervisor is required" }),
  notes: z.string().optional(),
});

type ExamFormValues = z.infer<typeof formSchema>;

interface ExamFormProps {
  exam?: ExamFormValues;
  onSubmit: (data: ExamFormValues) => void;
  isLoading?: boolean;
}

const ExamForm = ({
  exam = {
    name: "",
    institution: "",
    address: "",
    materials: [""],
    supervisors: [""],
    notes: "",
  },
  onSubmit = () => {},
  isLoading = false,
}: ExamFormProps) => {
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: exam,
  });

  const handleSubmit = (data: ExamFormValues) => {
    onSubmit(data);
  };

  const addMaterial = () => {
    const currentMaterials = form.getValues().materials || [];
    form.setValue("materials", [...currentMaterials, ""]);
  };

  const removeMaterial = (index: number) => {
    const currentMaterials = form.getValues().materials || [];
    if (currentMaterials.length > 1) {
      form.setValue(
        "materials",
        currentMaterials.filter((_, i) => i !== index),
      );
    }
  };

  const addSupervisor = () => {
    const currentSupervisors = form.getValues().supervisors || [];
    form.setValue("supervisors", [...currentSupervisors, ""]);
  };

  const removeSupervisor = (index: number) => {
    const currentSupervisors = form.getValues().supervisors || [];
    if (currentSupervisors.length > 1) {
      form.setValue(
        "supervisors",
        currentSupervisors.filter((_, i) => i !== index),
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {exam.name ? "Edit Exam" : "Create New Exam"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter exam name" {...field} />
                  </FormControl>
                  <FormDescription>The name of the examination</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter institution name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Company, government, or school name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter institution address"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The physical address of the institution
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Exam Materials</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMaterial}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Material
              </Button>
            </div>

            {form.watch("materials")?.map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`materials.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Material ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("materials").length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMaterial(index)}
                    className="h-9 w-9"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Exam Supervisors</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSupervisor}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Supervisor
              </Button>
            </div>

            {form.watch("supervisors")?.map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`supervisors.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Supervisor ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("supervisors").length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSupervisor(index)}
                    className="h-9 w-9"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about the exam"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Any additional information about the exam
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : exam.name
                  ? "Update Exam"
                  : "Create Exam"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ExamForm;
