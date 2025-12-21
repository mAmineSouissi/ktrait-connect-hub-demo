import { NextRequest, NextResponse } from "next/server";
import { typedTable } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { ChantierNoteUpdate } from "@/types/supabase-database.types";

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    return userData?.role === "admin";
  } catch (error) {
    return false;
  }
}

/**
 * PUT /api/admin/chantiers/[id]/notes/[noteId]
 * Update a note
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; noteId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { noteId } = params;
    const data = await request.json();

    const updateData: ChantierNoteUpdate = {};
    if (data.author !== undefined) updateData.author = data.author;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.date !== undefined) updateData.date = data.date;

    const { data: note, error } = await typedTable("chantier_notes")
      .update(updateData)
      .eq("id", noteId)
      .select()
      .single();

    if (error) {
      console.error("Error updating note:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ note });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/chantiers/[id]/notes/[noteId]
 * Delete a note
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; noteId: string } }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { noteId } = params;

    const { error } = await typedTable("chantier_notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      console.error("Error deleting note:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
