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

const COLLECTION_NAME = "questionBanks";

// Types
export interface QuestionBank {
  id?: string;
  name: string;
  description: string;
  questionCount?: number;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

// Create a new question bank
export const createQuestionBank = async (
  bankData: Omit<QuestionBank, "id">,
  userId: string,
) => {
  try {
    const bankWithMetadata = {
      ...bankData,
      questionCount: 0, // Initialize with zero questions
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    };

    const docRef = await addDoc(
      collection(db, COLLECTION_NAME),
      bankWithMetadata,
    );
    return { id: docRef.id, ...bankWithMetadata };
  } catch (error) {
    console.error("Error creating question bank:", error);
    throw error;
  }
};

// Get all question banks
export const getAllQuestionBanks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QuestionBank[];
  } catch (error) {
    console.error("Error getting question banks:", error);
    throw error;
  }
};

// Get question banks by creator
export const getQuestionBanksByCreator = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("createdBy", "==", userId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QuestionBank[];
  } catch (error) {
    console.error("Error getting question banks by creator:", error);
    throw error;
  }
};

// Get a single question bank by ID
export const getQuestionBankById = async (bankId: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, bankId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as QuestionBank;
    } else {
      throw new Error("Question bank not found");
    }
  } catch (error) {
    console.error("Error getting question bank:", error);
    throw error;
  }
};

// Update a question bank
export const updateQuestionBank = async (
  bankId: string,
  bankData: Partial<QuestionBank>,
) => {
  try {
    const bankRef = doc(db, COLLECTION_NAME, bankId);
    const updateData = {
      ...bankData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(bankRef, updateData);
    return { id: bankId, ...updateData };
  } catch (error) {
    console.error("Error updating question bank:", error);
    throw error;
  }
};

// Delete a question bank
export const deleteQuestionBank = async (bankId: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, bankId));
    return true;
  } catch (error) {
    console.error("Error deleting question bank:", error);
    throw error;
  }
};

// Increment question count
export const incrementQuestionCount = async (bankId: string) => {
  try {
    const bankRef = doc(db, COLLECTION_NAME, bankId);
    const bankDoc = await getDoc(bankRef);

    if (!bankDoc.exists()) {
      throw new Error("Question bank not found");
    }

    const currentCount = bankDoc.data().questionCount || 0;

    await updateDoc(bankRef, {
      questionCount: currentCount + 1,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error incrementing question count:", error);
    throw error;
  }
};

// Decrement question count
export const decrementQuestionCount = async (bankId: string) => {
  try {
    const bankRef = doc(db, COLLECTION_NAME, bankId);
    const bankDoc = await getDoc(bankRef);

    if (!bankDoc.exists()) {
      throw new Error("Question bank not found");
    }

    const currentCount = bankDoc.data().questionCount || 0;

    await updateDoc(bankRef, {
      questionCount: Math.max(0, currentCount - 1), // Ensure count doesn't go below 0
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error decrementing question count:", error);
    throw error;
  }
};
