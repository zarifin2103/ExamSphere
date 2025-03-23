import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "examConfigs";

// Types
export interface ScoringRule {
  correctPoints: number;
  incorrectPoints: number;
  unansweredPoints: number;
}

export interface ExamQuestionBank {
  questionBankId: string;
  scoringRule: ScoringRule;
}

export interface ExamConfig {
  id?: string;
  examId: string;
  questionBanks: ExamQuestionBank[];
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

// Create or update exam configuration
export const saveExamConfig = async (
  examId: string,
  questionBanks: ExamQuestionBank[],
  userId: string,
) => {
  try {
    // Check if config already exists
    const q = query(
      collection(db, COLLECTION_NAME),
      where("examId", "==", examId),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing config
      const configDoc = querySnapshot.docs[0];
      const configRef = doc(db, COLLECTION_NAME, configDoc.id);

      await updateDoc(configRef, {
        questionBanks,
        updatedAt: serverTimestamp(),
      });

      return { id: configDoc.id, examId, questionBanks };
    } else {
      // Create new config
      const configData = {
        examId,
        questionBanks,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), configData);
      return { id: docRef.id, ...configData };
    }
  } catch (error) {
    console.error("Error saving exam configuration:", error);
    throw error;
  }
};

// Get exam configuration by exam ID
export const getExamConfigByExamId = async (examId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("examId", "==", examId),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const configDoc = querySnapshot.docs[0];
      return { id: configDoc.id, ...configDoc.data() } as ExamConfig;
    } else {
      return null; // No configuration found for this exam
    }
  } catch (error) {
    console.error("Error getting exam configuration:", error);
    throw error;
  }
};

// Add a question bank to an exam
export const addQuestionBankToExam = async (
  examId: string,
  questionBank: ExamQuestionBank,
  userId: string,
) => {
  try {
    const config = await getExamConfigByExamId(examId);

    if (config) {
      // Update existing config
      const updatedQuestionBanks = [...config.questionBanks, questionBank];
      return await saveExamConfig(examId, updatedQuestionBanks, userId);
    } else {
      // Create new config with this question bank
      return await saveExamConfig(examId, [questionBank], userId);
    }
  } catch (error) {
    console.error("Error adding question bank to exam:", error);
    throw error;
  }
};

// Remove a question bank from an exam
export const removeQuestionBankFromExam = async (
  examId: string,
  questionBankId: string,
  userId: string,
) => {
  try {
    const config = await getExamConfigByExamId(examId);

    if (!config) {
      throw new Error("Exam configuration not found");
    }

    const updatedQuestionBanks = config.questionBanks.filter(
      (bank) => bank.questionBankId !== questionBankId,
    );

    return await saveExamConfig(examId, updatedQuestionBanks, userId);
  } catch (error) {
    console.error("Error removing question bank from exam:", error);
    throw error;
  }
};

// Update scoring rule for a question bank in an exam
export const updateQuestionBankScoringRule = async (
  examId: string,
  questionBankId: string,
  scoringRule: ScoringRule,
  userId: string,
) => {
  try {
    const config = await getExamConfigByExamId(examId);

    if (!config) {
      throw new Error("Exam configuration not found");
    }

    const updatedQuestionBanks = config.questionBanks.map((bank) => {
      if (bank.questionBankId === questionBankId) {
        return { ...bank, scoringRule };
      }
      return bank;
    });

    return await saveExamConfig(examId, updatedQuestionBanks, userId);
  } catch (error) {
    console.error("Error updating scoring rule:", error);
    throw error;
  }
};
