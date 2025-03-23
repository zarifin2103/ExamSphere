import React, { useState, useEffect } from "react";
import { Cog, PlusCircle, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { getAllExams, Exam } from "@/lib/firebase/exams";
import { getAllQuestionBanks, QuestionBank } from "@/lib/firebase/questionBanks";
import {
  getExamConfigByExamId,
  addQuestionBankToExam,
  removeQuestionBankFromExam,
  updateQuestionBankScoringRule,
  ExamConfig,
  ExamQuestionBank,
  ScoringRule,
} from "@/lib/firebase/examConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ExamConfigTableRow {
  exam: Exam;
  questionBank: QuestionBank | null;
  scoringRule: ScoringRule | null;
  isConfigured: boolean;
}

const ExamConfigPage = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [examConfigs, setExamConfigs] = useState<ExamConfig[]>([]);
  const [configRows, setConfigRows] = useState<ExamConfigTableRow[]>([]);
  const [selectedQuestionBankId, setSelectedQuestionBankId] = useState<string>("");
  const [scoringRule, setScoringRule] = useState<ScoringRule>({
    correctPoints: 1,
    incorrectPoints: 0,
    unansweredPoints: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string>("");

  // Load exams and question banks
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const examsData = await getAllExams();
        const questionBanksData = await getAllQuestionBanks();
        
        setExams(examsData);
        setQuestionBanks(questionBanksData);
        
        // Load exam configurations for each exam
        const configPromises = examsData.map(exam => getExamConfigByExamId(exam.id || ""));
        const configs = await Promise.all(configPromises);
        const validConfigs = configs.filter(config => config !== null) as ExamConfig[];
        setExamConfigs(validConfigs);
        
        // Create table rows
        const rows: ExamConfigTableRow[] = [];
        
        examsData.forEach(exam => {
          const examConfig = validConfigs.find(config => config.examId === exam.id);
          
          if (examConfig && examConfig.questionBanks.length > 0) {
            // For each question bank in this exam's config
            examConfig.questionBanks.forEach(configQB => {
              const questionBank = questionBanksData.find(qb => qb.id === configQB.questionBankId);
              
              if (questionBank) {
                rows.push({
                  exam,
                  questionBank,
                  scoringRule: configQB.scoringRule,
                  isConfigured: true
                });
              }
            });
          } else {
            // Exam has no configured question banks
            rows.push({
              exam,
              questionBank: null,
              scoringRule: null,
              isConfigured: false
            });
          }
        });
        
        setConfigRows(rows);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load exam configuration data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleAddQuestionBank = (examId: string) => {
    setCurrentExamId(examId);
    setSelectedQuestionBankId("");
    setScoringRule({
      correctPoints: 1,
      incorrectPoints: 0,
      unansweredPoints: 0,
    });
    setIsDialogOpen(true);
  };

  const handleSaveQuestionBank = async () => {
    if (!currentUser || !currentExamId || !selectedQuestionBankId) {
      toast({
        title: "Error",
        description: "Please select a question bank.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const questionBankConfig: ExamQuestionBank = {
        questionBankId: selectedQuestionBankId,
        scoringRule,
      };

      await addQuestionBankToExam(
        currentExamId,
        questionBankConfig,
        currentUser.uid
      );

      // Refresh data
      const updatedConfig = await getExamConfigByExamId(currentExamId);
      if (updatedConfig) {
        setExamConfigs(prev => {
          const newConfigs = prev.filter(c => c.examId !== currentExamId);
          return [...newConfigs, updatedConfig];
        });

        // Update rows
        const exam = exams.find(e => e.id === currentExamId);
        const questionBank = questionBanks.find(qb => qb.id === selectedQuestionBankId);

        if (exam && questionBank) {
          setConfigRows(prev => {
            // Remove any existing row for this exam-questionbank pair
            const filteredRows = prev.filter(
              row => !(row.exam.id === currentExamId && row.questionBank?.id === selectedQuestionBankId)
            );
            
            // Add the new row
            return [
              ...filteredRows,
              {
                exam,
                questionBank,
                scoringRule,
                isConfigured: true
              }
            ];
          });
        }
      }

      toast({
        title: "Success",
        description: "Question bank linked to exam successfully.",
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving question bank:", error);
      toast({
        title: "Error",
        description: "Failed to link question bank to exam.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveQuestionBank = async (examId: string, questionBankId: string) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await removeQuestionBankFromExam(examId, questionBankId, currentUser.uid);

      // Update local state
      setConfigRows(prev => 
        prev.filter(row => !(row.exam.id === examId && row.questionBank?.id === questionBankId))
      );

      // If this was the last question bank for this exam, add a row with no question bank
      const examStillHasQuestionBanks = configRows.some(
        row => row.exam.id === examId && row.questionBank && row.questionBank.id !== questionBankId
      );

      if (!examStillHasQuestionBanks) {
        const exam = exams.find(e => e.id === examId);
        if (exam) {
          setConfigRows(prev => [
            ...prev,
            {
              exam,
              questionBank: null,
              scoringRule: null,
              isConfigured: false
            }
          ]);
        }
      }

      toast({
        title: "Success",
        description: "Question bank removed from exam successfully.",
      });
    } catch (error) {
      console.error("Error removing question bank:", error);
      toast({
        title: "Error",
        description: "Failed to remove question bank from exam.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Exam Configuration</h1>
            <p className="text-gray-500 mt-1">
              Link question banks to exams and configure scoring rules
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exam and Question Bank Pairings</CardTitle>
            <CardDescription>
              Configure which question banks are used in each exam and set scoring rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading exam configurations...</p>
              </div>
            ) : configRows.length > 0 ? (
              <Table>
                <TableCaption>List of exam and question bank pairings</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Exam</TableHead>
                    <TableHead className="w-[250px]">Question Bank</TableHead>
                    <TableHead className="w-[200px]">Scoring Rule</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configRows.map((row, index) => (
                    <TableRow key={`${row.exam.id}-${row.questionBank?.id || index}`}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{row.exam.name}</div>
                          <div className="text-xs text-gray-500">{row.exam.institution}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {row.questionBank ? (
                          <div>
                            <div>{row.questionBank.name}</div>
                            <div className="text-xs text-gray-500">
                              {row.questionBank.questionCount || 0} questions
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No question bank linked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.scoringRule ? (
                          <div className="text-sm">
                            <div>Correct: +{row.scoringRule.correctPoints} points</div>
                            <div>Incorrect: {row.scoringRule.incorrectPoints} points</div>
                            <div>Unanswered: {row.scoringRule.unansweredPoints} points</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No scoring rule</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {row.questionBank ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveQuestionBank(row.exam.id || "", row.questionBank?.id || "")}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddQuestionBank(row.exam.id || "")}
                              disabled={isLoading}
                              className="flex items-center gap-1"
                            >
                              <PlusCircle className="h-4 w-4" />
                              Link Question Bank
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Cog size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Exam Configurations
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no exams or question banks configured yet. Please add exams and question banks first.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Link Question Bank to Exam</DialogTitle>