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

const COLLECTION_NAME = "exams";

// Types
export interface Supervisor {
  id: string;
  name: string;
}

export interface Exam {
  id?: string;
  name: string;
  institution: string;
  address: string;
  materials: string[];
  supervisors: Supervisor[];
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

// Create a new exam
export const createExam = async (
  examData: Omit<Exam, "id">,
  userId: string,
) => {
  try {
    const examWithMetadata = {
      ...examData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    };

    const docRef = await addDoc(
      collection(db, COLLECTION_NAME),
      examWithMetadata,
    );
    return { id: docRef.id, ...examWithMetadata };
  } catch (error) {
    console.error("Error creating exam:", error);
    throw error;
  }
};

// Get all exams
export const getAllExams = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exam[];
  } catch (error) {
    console.error("Error getting exams:", error);
    throw error;
  }
};

// Get exams by institution
export const getExamsByInstitution = async (institution: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("institution", "==", institution),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exam[];
  } catch (error) {
    console.error("Error getting exams by institution:", error);
    throw error;
  }
};

// Get a single exam by ID
export const getExamById = async (examId: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, examId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Exam;
    } else {
      throw new Error("Exam not found");
    }
  } catch (error) {
    console.error("Error getting exam:", error);
    throw error;
  }
};

// Update an exam
export const updateExam = async (examId: string, examData: Partial<Exam>) => {
  try {
    const examRef = doc(db, COLLECTION_NAME, examId);
    const updateData = {
      ...examData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(examRef, updateData);
    return { id: examId, ...updateData };
  } catch (error) {
    console.error("Error updating exam:", error);
    throw error;
  }
};

// Delete an exam
export const deleteExam = async (examId: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, examId));
    return true;
  } catch (error) {
    console.error("Error deleting exam:", error);
    throw error;
  }
};
