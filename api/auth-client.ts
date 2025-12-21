// api/auth-client.ts - CLIENT SIDE ONLY
import { supabase } from "@/lib/supabase/client";
import { SignInFormData, SignInResult, SignUpFormData } from "@/types";
import { User } from "@/types";

/**
 * Sign in with email and password (CLIENT SIDE)
 */
async function signIn(signInData: SignInFormData): Promise<SignInResult> {
  // Sign in with Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: signInData.email,
      password: signInData.password,
    });

  if (authError) {
    console.error("Auth sign in error:", authError);
    throw authError;
  }

  if (!authData.user) {
    throw new Error("No user returned from sign in");
  }

  // Get user profile from public.users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (userError) {
    console.error("Error fetching user profile:", userError);
    throw new Error("Failed to fetch user profile");
  }

  if (!userData) {
    throw new Error("User profile not found");
  }

  // Check if user is approved (admin users are always approved)
  const approvalStatus = userData.approval_status || "pending";
  if (userData.role !== "admin" && approvalStatus !== "approved") {
    // Don't sign out, but throw error with status to redirect to appropriate page
    if (approvalStatus === "rejected") {
      await supabase.auth.signOut();
      throw new Error(
        "REJECTED: Votre compte a été rejeté. Veuillez contacter l'administrateur."
      );
    } else {
      // For pending status, we'll redirect to pending-approval page
      throw new Error(
        "PENDING: Votre compte est en attente d'approbation par un administrateur."
      );
    }
  }

  // Check if user is active
  if (!userData.is_active) {
    await supabase.auth.signOut();
    throw new Error(
      "Votre compte a été désactivé. Veuillez contacter l'administrateur."
    );
  }

  return {
    user: userData as User,
    session: authData.session,
  };
}

/**
 * Sign up new user (CLIENT SIDE)
 */
async function signUp(signUpData: SignUpFormData): Promise<SignInResult> {
  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: signUpData.email,
    password: signUpData.password,
    options: {
      data: {
        full_name: signUpData.fullName,
        role: signUpData.role,
      },
    },
  });

  if (authError) {
    console.error("Auth sign up error:", authError);
    throw authError;
  }

  if (!authData.user) {
    throw new Error("No user returned from sign up");
  }

  // The trigger should have created the user profile automatically
  // Let's verify it exists
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (userError) {
    console.error("Error fetching user profile after signup:", userError);
    throw new Error("Failed to create user profile");
  }

  return {
    user: userData as User,
    session: authData.session,
  };
}

/**
 * Sign out (CLIENT SIDE)
 */
async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Get current user (CLIENT SIDE)
 */
async function getCurrentUser(): Promise<User | null> {
  try {
    // Get auth user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return null;
    }

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user profile:", userError);
      return null;
    }

    // Check approval status (admin users are always approved)
    const approvalStatus = userData.approval_status || "pending";
    if (userData.role !== "admin" && approvalStatus !== "approved") {
      // User is not approved, sign them out
      await supabase.auth.signOut();
      return null;
    }

    // Check if user is active
    if (!userData.is_active) {
      await supabase.auth.signOut();
      return null;
    }

    return userData as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export const auth = {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
};
