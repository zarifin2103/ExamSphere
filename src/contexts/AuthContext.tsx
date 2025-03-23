import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCurrentUserProfile, UserProfile } from "@/lib/firebase/users";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  checkUserRole: () => Promise<string | null>;
  user: User | null; // Add user property for backward compatibility
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  checkUserRole: async () => null,
  user: null, // Add user property for backward compatibility
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const profile = await getCurrentUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Function to check user role from Firestore
  const checkUserRole = async (): Promise<string | null> => {
    if (!currentUser) return null;
    
    try {
      const profile = await getCurrentUserProfile();
      return profile?.role || null;
    } catch (error) {
      console.error("Error checking user role:", error);
      return null;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    checkUserRole,
    user: currentUser, // Add user property for backward compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
