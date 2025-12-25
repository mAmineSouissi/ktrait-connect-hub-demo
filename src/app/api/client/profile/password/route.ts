import { NextRequest, NextResponse } from "next/server";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Check if the current user is a client and get their ID and email
 */
async function getCurrentClientInfo(): Promise<{ id: string; email: string } | null> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: userData } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("id", user.id)
      .single();

    if (userData?.role === "client") {
      return { id: userData.id, email: userData.email };
    }

    return null;
  } catch (error) {
    console.error("Error checking client:", error);
    return null;
  }
}

/**
 * POST /api/client/profile/password
 * Verify current password and update to new password
 */
export async function POST(request: NextRequest) {
  const clientInfo = await getCurrentClientInfo();

  if (!clientInfo) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { current_password, new_password } = body;

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (new_password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Verify current password by attempting to sign in
    const supabase = await createAppRouteClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: clientInfo.email,
      password: current_password,
    });

    if (signInError || !signInData.user) {
      return NextResponse.json(
        { error: "Le mot de passe actuel est incorrect" },
        { status: 401 }
      );
    }

    // Current password is correct, now update to new password using admin client
    const supabaseAdmin = getSupabaseAdmin();
    const { error: updateError } = await (supabaseAdmin.auth.admin as any).updateUserById(
      clientInfo.id,
      {
        password: new_password,
      }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json(
        { error: updateError.message || "Erreur lors de la mise à jour du mot de passe" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

