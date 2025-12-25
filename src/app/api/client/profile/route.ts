import { NextRequest, NextResponse } from "next/server";
import { typedTable, typedUpdate, typedInsert } from "@/lib/supabase/typed-client";
import { createAppRouteClient } from "@/lib/supabase/app-route-client";
import type { UserRow, UserUpdate } from "@/types/supabase-database.types";
import type { ClientRow, ClientInsert, ClientUpdate } from "@/types/supabase-database.types";

/**
 * Check if the current user is a client and get their ID
 */
async function getCurrentClientId(): Promise<string | null> {
  try {
    const supabase = await createAppRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: userData } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    if (userData?.role === "client") {
      return userData.id;
    }

    return null;
  } catch (error) {
    console.error("Error checking client:", error);
    return null;
  }
}

/**
 * GET /api/client/profile
 * Get current client's profile information
 */
export async function GET(request: NextRequest) {
  const clientId = await getCurrentClientId();

  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    // Get user information
    const userResult = await typedTable("users")
      .select("*")
      .eq("id", clientId)
      .single();

    const { data: user, error: userError } = userResult as {
      data: UserRow | null;
      error: any;
    };

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get client profile information
    const clientResult = await typedTable("clients")
      .select("*")
      .eq("user_id", clientId)
      .single();

    const { data: client, error: clientError } = clientResult as {
      data: ClientRow | null;
      error: any;
    };

    // Client profile might not exist yet, that's okay
    const profile = {
      // User fields
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone || null,
      avatar_url: user.avatar_url || null,
      // Client profile fields
      city: client?.city || null,
      address: client?.address || null,
      postal_code: client?.postal_code || null,
      company_name: client?.company_name || null,
      tax_id: client?.tax_id || null,
    };

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/client/profile
 * Update current client's profile information
 */
export async function PUT(request: NextRequest) {
  const clientId = await getCurrentClientId();

  if (!clientId) {
    return NextResponse.json(
      { error: "Forbidden: Client access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const {
      full_name,
      phone,
      avatar_url,
      city,
      address,
      postal_code,
      company_name,
      tax_id,
    } = body;

    // Update user information
    const userUpdate: UserUpdate = {};
    if (full_name !== undefined) userUpdate.full_name = full_name;
    if (phone !== undefined) userUpdate.phone = phone || null;
    if (avatar_url !== undefined) userUpdate.avatar_url = avatar_url || null;

    if (Object.keys(userUpdate).length > 0) {
      const userResult = await typedUpdate("users", userUpdate)
        .eq("id", clientId)
        .select()
        .single();

      const { error: userError } = userResult as {
        data: UserRow | null;
        error: any;
      };

      if (userError) {
        console.error("Error updating user:", userError);
        return NextResponse.json(
          { error: userError.message || "Failed to update user information" },
          { status: 500 }
        );
      }
    }

    // Check if client profile exists
    const clientCheck = await typedTable("clients")
      .select("id")
      .eq("user_id", clientId)
      .single();

    const { data: existingClient } = clientCheck as {
      data: { id: string } | null;
      error: any;
    };

    // Update or create client profile
    const clientUpdate: ClientUpdate = {};
    if (city !== undefined) clientUpdate.city = city || null;
    if (address !== undefined) clientUpdate.address = address || null;
    if (postal_code !== undefined) clientUpdate.postal_code = postal_code || null;
    if (company_name !== undefined) clientUpdate.company_name = company_name || null;
    if (tax_id !== undefined) clientUpdate.tax_id = tax_id || null;

    if (Object.keys(clientUpdate).length > 0) {
      if (existingClient) {
        // Update existing client profile
        const clientResult = await typedUpdate("clients", clientUpdate)
          .eq("user_id", clientId)
          .select()
          .single();

        const { error: clientError } = clientResult as {
          data: ClientRow | null;
          error: any;
        };

        if (clientError) {
          console.error("Error updating client profile:", clientError);
          return NextResponse.json(
            { error: clientError.message || "Failed to update client profile" },
            { status: 500 }
          );
        }
      } else {
        // Create new client profile
        const clientInsert: ClientInsert = {
          user_id: clientId,
          city: clientUpdate.city || null,
          address: clientUpdate.address || null,
          postal_code: clientUpdate.postal_code || null,
          company_name: clientUpdate.company_name || null,
          tax_id: clientUpdate.tax_id || null,
        };

        const clientResult = await typedInsert("clients", clientInsert)
          .select()
          .single();

        const { error: clientError } = clientResult as {
          data: ClientRow | null;
          error: any;
        };

        if (clientError) {
          console.error("Error creating client profile:", clientError);
          return NextResponse.json(
            { error: clientError.message || "Failed to create client profile" },
            { status: 500 }
          );
        }
      }
    }

    // Fetch updated profile
    const userResult = await typedTable("users")
      .select("*")
      .eq("id", clientId)
      .single();

    const { data: user } = userResult as {
      data: UserRow | null;
      error: any;
    };

    const clientResult = await typedTable("clients")
      .select("*")
      .eq("user_id", clientId)
      .single();

    const { data: client } = clientResult as {
      data: ClientRow | null;
      error: any;
    };

    const profile = {
      id: user?.id,
      email: user?.email,
      full_name: user?.full_name,
      phone: user?.phone || null,
      avatar_url: user?.avatar_url || null,
      city: client?.city || null,
      address: client?.address || null,
      postal_code: client?.postal_code || null,
      company_name: client?.company_name || null,
      tax_id: client?.tax_id || null,
    };

    return NextResponse.json({
      profile,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

