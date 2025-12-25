import React from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@/types/user.types";
import {
  AuthContextType,
  SignInFormData,
  SignUpFormData,
  SignInResult,
} from "@/types/auth.types";
import { useRouter } from "next/router";
import { api } from "@/api";

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: () => {},
  signIn: async () => {
    throw new Error("signIn not implemented");
  },
  signUp: async () => {
    throw new Error("signUp not implemented");
  },
  signOut: async () => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const isAuthenticated = !!user;

  const setUserWithLoading = React.useCallback((user: User | null) => {
    setUser(user);
    if (user) {
      setLoading(false);
    }
  }, []);

  const signIn = React.useCallback(
    async (data: SignInFormData): Promise<SignInResult> => {
      const result = await api.auth.signIn(data);
      setUserWithLoading(result.user);
      return result;
    },
    []
  );

  const signUp = React.useCallback(
    async (data: SignUpFormData): Promise<SignInResult> => {
      const result = await api.auth.signUp(data);
      setUserWithLoading(result.user);
      return result;
    },
    []
  );

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    router.replace("/");
  }, [router]);

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          setLoading(false);
          return;
        }

        const authUser = session?.user;

        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (userError) {
          console.error("Error fetching user profile:", userError);
          setUser(null);
        } else if (userData) {
          // Check approval status (admin users are always approved)
          const approvalStatus = userData.approval_status || "pending";
          if (userData.role !== "admin" && approvalStatus !== "approved") {
            // Redirect to appropriate page based on status
            if (approvalStatus === "rejected") {
              await supabase.auth.signOut();
              setUser(null);
              router.push("/");
            } else {
              // Pending status - redirect to pending approval page
              setUser(userData as User); // Set user so page can display info
              router.push("/pending-approval");
            }
            return;
          }

          // Check if user is active
          if (!userData.is_active) {
            await supabase.auth.signOut();
            setUser(null);
            router.push("/");
            return;
          }

          setUser(userData as User);
        }
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
        return;
      }

      const authUser = session?.user;

      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .single();

          if (userError) {
            console.error(
              "Error fetching user profile on auth change:",
              userError
            );
            setUser(null);
          } else if (userData) {
            // Check approval status (admin users are always approved)
            const approvalStatus = userData.approval_status || "pending";
            if (userData.role !== "admin" && approvalStatus !== "approved") {
              // Redirect to appropriate page based on status
              if (approvalStatus === "rejected") {
                await supabase.auth.signOut();
                setUser(null);
                router.push("/");
              } else {
                // Pending status - redirect to pending approval page
                setUser(userData as User); // Set user so page can display info
                router.push("/pending-approval");
              }
              return;
            }

            // Check if user is active
            if (!userData.is_active) {
              await supabase.auth.signOut();
              setUser(null);
              router.push("/");
              return;
            }

            setUser(userData as User);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        setUser: setUserWithLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
