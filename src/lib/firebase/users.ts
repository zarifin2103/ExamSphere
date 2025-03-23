import { db, auth } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";

const COLLECTION_NAME = "users";

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "supervisor" | "participant" | "user";
  institution?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: "admin" | "supervisor" | "participant" | "user",
  institution?: string,
): Promise<UserProfile> => {
  try {
    // Create the user in Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user: User = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName });

    // Create the user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email,
      displayName,
      role,
      institution: institution || null, // Use null instead of undefined
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, COLLECTION_NAME, user.uid), userProfile);

    return userProfile;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return null;
    }

    const userDoc = await getDoc(doc(db, COLLECTION_NAME, user.uid));

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting current user profile:", error);
    throw error;
  }
};

// Get user profile by ID
export const getUserProfileById = async (
  uid: string,
): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTION_NAME, uid));

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

// Get users by role
export const getUsersByRole = async (
  role: "admin" | "supervisor" | "participant",
): Promise<UserProfile[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("role", "==", role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error getting users by role:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  profileData: Partial<UserProfile>,
): Promise<UserProfile> => {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    const updateData = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, updateData);

    // If display name is being updated, also update it in Auth
    if (
      profileData.displayName &&
      auth.currentUser &&
      auth.currentUser.uid === uid
    ) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
      });
    }

    const updatedUserDoc = await getDoc(userRef);
    return updatedUserDoc.data() as UserProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUserProfile = async (uid: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, uid));
    // Note: This only deletes the Firestore document
    // Deleting the actual Auth user requires admin SDK or callable functions
    return true;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
};
