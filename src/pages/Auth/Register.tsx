
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
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "用户名至少需要3个字符" })
    .max(50, { message: "用户名不能超过50个字符" }),
  password: z
    .string()
    .min(6, { message: "密码至少需要6个字符" })
    .max(100, { message: "密码不能超过100个字符" }),
  phone: z
    .string()
    .min(11, { message: "手机号格式不正确" })
    .max(11, { message: "手机号格式不正确" }),
  school: z.string().optional(),
  college: z.string().optional(),
  major: z.string().optional(),
  grade: z.string().optional(),
});

const Register = () => {
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
      phone: "",
      school: "",
      college: "",
      major: "",
      grade: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", values.username)
        .single();

      if (existingUser) {
        setError("用户名已被使用，请选择其他用户名");
        setLoading(false);
        return;
      }

      // 2. Generate a unique email for Supabase Auth
      // Since Supabase Auth requires email, but we're using usernames
      // we'll generate a unique random email that won't be visible to users
      const randomEmail = `${values.username}_${uuidv4()}@example.com`;
      
      // 3. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: randomEmail,
        password: values.password,
      });

      if (authError) {
        setError("注册失败: " + authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("注册失败：用户创建异常");
        setLoading(false);
        return;
      }

      // 4. Create user profile with additional data
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: randomEmail,
        username: values.username,
        phone: values.phone,
        school: values.school || null,
        college: values.college || null,
        major: values.major || null,
        grade: values.grade || null,
        role: "user",
        subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      });

      if (profileError) {
        // Try to delete the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        setError("创建用户资料失败: " + profileError.message);
        setLoading(false);
        return;
      }

      toast({
        title: "注册成功！",
        description: "您已获得30天的访问权限",
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("注册过程中出现错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">注册新账号</CardTitle>
          <CardDescription className="text-center">
            创建您的账号以访问系统
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
                    <FormLabel>用户名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入唯一用户名" {...field} />
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
                    <FormLabel>密码 *</FormLabel>
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
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手机号 *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="请输入11位手机号" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学校</FormLabel>
                      <FormControl>
                        <Input placeholder="可选" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学院</FormLabel>
                      <FormControl>
                        <Input placeholder="可选" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>专业</FormLabel>
                      <FormControl>
                        <Input placeholder="可选" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>年级/届</FormLabel>
                      <FormControl>
                        <Input placeholder="可选" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "注册中..." : "注册"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-gray-500">
            已有账号?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => navigate("/login")}
            >
              登录
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
