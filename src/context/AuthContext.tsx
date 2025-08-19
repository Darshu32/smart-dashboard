import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase";

// STEP 1: Updated interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  displayName: string;
  setDisplayName: (name: string) => void;
}

// STEP 2: Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  displayName: "",
  setDisplayName: () => {},
});

// STEP 3: AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setDisplayName(firebaseUser?.displayName || ""); // update local displayName
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setDisplayName("");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, displayName, setDisplayName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// STEP 4: useAuth hook
export const useAuth = () => useContext(AuthContext);   