import { useState, useEffect } from "react";
import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * A hook to subscribe to a single Firestore document with real-time updates
 * @param collectionName The name of the collection containing the document
 * @param documentId The ID of the document to subscribe to
 * @returns An object containing the document data, loading state, and any error
 */
export function useFirestoreDocument<T>(
  collectionName: string,
  documentId: string | undefined,
) {
  const [document, setDocument] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentId) {
      setDocument(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    let unsubscribe: Unsubscribe;

    try {
      const docRef = doc(db, collectionName, documentId);

      unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setDocument({ id: snapshot.id, ...snapshot.data() } as T);
          } else {
            setDocument(null);
          }
          setLoading(false);
        },
        (err) => {
          console.error(
            `Error fetching document ${documentId} from ${collectionName}:`,
            err,
          );
          setError(err as Error);
          setLoading(false);
        },
      );
    } catch (err) {
      console.error(
        `Error setting up document listener for ${documentId} in ${collectionName}:`,
        err,
      );
      setError(err as Error);
      setLoading(false);
    }

    // Clean up the subscription when the component unmounts or the document ID changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, documentId]);

  return { document, loading, error };
}
