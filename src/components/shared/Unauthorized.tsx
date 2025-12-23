import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Unauthorized() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Your current role (
            {user?.role || "unknown"}) does not grant access to this resource.
          </p>

          {/* Error Details */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Role:</strong> {user.role}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleGoHome} variant="default" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 mt-6">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
