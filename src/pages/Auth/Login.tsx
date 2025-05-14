
import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/providers/SupabaseProvider";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "用户名至少需要3个字符" })
    .max(50, { message: "用户名不能超过50个字符" }),
  password: z
    .string()
    .min(6, { message: "密码至少需要6个字符" })
    .max(100, { message: "密码不能超过100个字符" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    try {
      // 1. First, we need to get the email associated with this username
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", values.username)
        .single();

      if (profileError || !profileData?.email) {
        setError("用户名不存在");
        setLoading(false);
        return;
      }

      // 2. Now we can sign in with the email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: values.password,
      });

      if (error) {
        setError("登录失败，请检查用户名和密码");
        setLoading(false);
        return;
      }

      // 3. If successful, check user role to redirect appropriately
      const { data: userData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      toast({
        title: "登录成功",
        description: "欢迎回来！",
      });

      // Redirect based on user role
      if (userData?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("登录过程中出现错误");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
          <CardDescription className="text-center">
            输入您的用户名和密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            没有账号?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => navigate("/register")}
            >
              注册
            </Button>
          </div>
          <div className="text-xs text-center text-gray-400">
            忘记密码请联系管理员
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
