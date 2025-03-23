import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";

const COLLECTION_NAME = "examResults";

// Types
export interface QuestionAnswer {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  points: number;
}

export interface ExamResult {
  id?: string;
  examId: string;
  userId: string;
  startTime: any;
  endTime: any;
  totalScore: number;
  maxPossibleScore: number;
  answers: QuestionAnswer[];
  createdAt?: any;
}

// Submit exam result
export const submitExamResult = async (
  resultData: Omit<ExamResult, "id" | "createdAt">,
) => {
  try {
    const resultWithMetadata = {
      ...resultData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, COLLECTION_NAME),
      resultWithMetadata,
    );
    return { id: docRef.id, ...resultWithMetadata };
  } catch (error) {
    console.error("Error submitting exam result:", error);
    throw error;
  }
};

// Get result by ID
export const getResultById = async (resultId: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, resultId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ExamResult;
    } else {
      throw new Error("Result not found");
    }
  } catch (error) {
    console.error("Error getting result:", error);
    throw error;
  }
};

// Get results by user ID
export const getResultsByUserId = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExamResult[];
  } catch (error) {
    console.error("Error getting results by user ID:", error);
    throw error;
  }
};

// Get results by exam ID
export const getResultsByExamId = async (examId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("examId", "==", examId),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExamResult[];
  } catch (error) {
    console.error("Error getting results by exam ID:", error);
    throw error;
  }
};

// Get user's result for a specific exam
export const getUserExamResult = async (userId: string, examId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      where("examId", "==", examId),
      orderBy("createdAt", "desc"),
      limit(1),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const resultDoc = querySnapshot.docs[0];
      return { id: resultDoc.id, ...resultDoc.data() } as ExamResult;
    } else {
      return null; // No result found
    }
  } catch (error) {
    console.error("Error getting user exam result:", error);
    throw error;
  }
};

// Get recent results
export const getRecentResults = async (limit_count = 10) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
      limit(limit_count),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExamResult[];
  } catch (error) {
    console.error("Error getting recent results:", error);
    throw error;
  }
};
