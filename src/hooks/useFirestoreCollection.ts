import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  QueryConstraint,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * A hook to subscribe to a Firestore collection with real-time updates
 * @param collectionName The name of the collection to subscribe to
 * @param queryConstraints Optional query constraints (where, orderBy, limit, etc.)
 * @returns An object containing the documents, loading state, and any error
 */
export function useFirestoreCollection<T>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    let unsubscribe: Unsubscribe;

    try {
      const q = query(collection(db, collectionName), ...queryConstraints);

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];

          setDocuments(docs);
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching ${collectionName}:`, err);
          setError(err as Error);
          setLoading(false);
        },
      );
    } catch (err) {
      console.error(`Error setting up ${collectionName} listener:`, err);
      setError(err as Error);
      setLoading(false);
    }

    // Clean up the subscription when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { documents, loading, error };
}
