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
import {
  incrementQuestionCount,
  decrementQuestionCount,
} from "./questionBanks";

const COLLECTION_NAME = "questions";

// Types
export interface Question {
  id?: string;
  text: string;
  type: string;
  score: number;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  questionBankId: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

// Create a new question
export const createQuestion = async (
  questionData: Omit<Question, "id">,
  userId: string,
) => {
  try {
    const questionWithMetadata = {
      ...questionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    };

    const docRef = await addDoc(
      collection(db, COLLECTION_NAME),
      questionWithMetadata,
    );

    // Increment the question count in the associated question bank
    await incrementQuestionCount(questionData.questionBankId);

    return { id: docRef.id, ...questionWithMetadata };
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

// Get all questions
export const getAllQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Question[];
  } catch (error) {
    console.error("Error getting questions:", error);
    throw error;
  }
};

// Get questions by question bank ID
export const getQuestionsByBankId = async (bankId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("questionBankId", "==", bankId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Question[];
  } catch (error) {
    console.error("Error getting questions by bank ID:", error);
    throw error;
  }
};

// Get a single question by ID
export const getQuestionById = async (questionId: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, questionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Question;
    } else {
      throw new Error("Question not found");
    }
  } catch (error) {
    console.error("Error getting question:", error);
    throw error;
  }
};

// Update a question
export const updateQuestion = async (
  questionId: string,
  questionData: Partial<Question>,
) => {
  try {
    const questionRef = doc(db, COLLECTION_NAME, questionId);
    const updateData = {
      ...questionData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(questionRef, updateData);
    return { id: questionId, ...updateData };
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (questionId: string) => {
  try {
    // Get the question to find its question bank ID
    const questionRef = doc(db, COLLECTION_NAME, questionId);
    const questionDoc = await getDoc(questionRef);

    if (!questionDoc.exists()) {
      throw new Error("Question not found");
    }

    const questionData = questionDoc.data();
    const questionBankId = questionData.questionBankId;

    // Delete the question
    await deleteDoc(questionRef);

    // Decrement the question count in the associated question bank
    await decrementQuestionCount(questionBankId);

    return true;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};
