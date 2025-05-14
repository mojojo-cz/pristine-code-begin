
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/providers/SupabaseProvider";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        navigate("/login");
        return;
      }

      // If a specific role is required, check it
      if (requiredRole) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionData.session.user.id)
          .single();

        if (!profileData || profileData.role !== requiredRole) {
          if (requiredRole === "admin") {
            navigate("/dashboard"); // Regular users go to dashboard
          } else {
            navigate("/login"); // If something's wrong with permissions
          }
          return;
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [supabase, navigate, requiredRole]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">验证中...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
