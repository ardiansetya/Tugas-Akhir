"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2, Lock, UserCircle2, Box, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BentoCard } from "@/components/shared/BentoCard";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, isError, error } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent">
      <MotionWrapper className="w-full max-w-[450px]">
        {/* Branding Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex p-4 bg-primary/10 rounded-3xl border border-primary/20 mb-2 relative">
             <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl animate-pulse" />
             <Box className="h-10 w-10 text-primary relative z-10" />
          </div>
          <div className="space-y-1">
            <h1 className="font-bold text-3xl tracking-tight text-foreground/90">
              Next<span className="text-primary">Truck</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Sistem Manajemen Truk
            </p>
          </div>
        </div>

        <BentoCard 
          title="Masuk" 
          subtitle="Masuk ke akun Anda"
          delay={0.1}
        >
          <div className="pt-4">
            {isError && (
              <Alert variant="destructive" className="mb-6 bg-destructive/5 border-destructive/20 text-destructive rounded-2xl">
                <AlertDescription className="text-xs font-semibold">
                  {error instanceof AxiosError
                    ? error.response?.data.errors
                    : "Login gagal. Cek username dan password Anda."}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Username</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all" />
                          <Input
                            placeholder="Ketik username"
                            className="pl-12 h-14 bg-secondary/20 border-border/40 focus:bg-secondary/40 focus:ring-primary/20 rounded-2xl transition-all font-medium"
                            disabled={isPending}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between ml-1">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Password</FormLabel>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-12 pr-12 h-14 bg-secondary/20 border-border/40 focus:bg-secondary/40 focus:ring-primary/20 rounded-2xl transition-all font-medium"
                            disabled={isPending}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all"
                            disabled={isPending}>
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold ml-1" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]" 
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sedang masuk...
                    </div>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </BentoCard>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-bold transition-all decoration-primary underline-offset-4 hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
        
        {/* Verification indicator */}
        <div className="mt-16 flex items-center justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <Globe className="h-3.5 w-3.5" />
            Online
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" />
            Aman
          </div>
        </div>
      </MotionWrapper>
    </div>
  );
};

export default LoginPage;
