
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        navigate("/login");
        return;
      }
      
      // Fetch user profile data
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("username, subscription_ends_at")
        .eq("id", sessionData.session.user.id)
        .single();
      
      if (error || !profileData) {
        toast({
          title: "错误",
          description: "获取用户资料失败",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      setUsername(profileData.username);
      setSubscriptionEnd(profileData.subscription_ends_at ? new Date(profileData.subscription_ends_at) : null);
      setLoading(false);
    };
    
    checkUser();
  }, [supabase, navigate, toast]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "已登出",
      description: "您已成功退出登录",
    });
    navigate("/login");
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">用户面板</h1>
          <Button onClick={handleLogout}>退出登录</Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900">欢迎, {username}!</h2>
            {subscriptionEnd && (
              <p className="mt-3 text-sm text-gray-600">
                您的访问权限将于 {subscriptionEnd.toLocaleDateString()} 到期
              </p>
            )}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">用户服务</h3>
              <p className="mt-2 text-sm text-gray-600">这里将显示用户可以访问的服务</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
