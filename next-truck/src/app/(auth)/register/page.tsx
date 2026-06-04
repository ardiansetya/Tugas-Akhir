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
import { useRegister } from "@/hooks/useAuth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  Box,
  UserPlus2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BentoCard } from "@/components/shared/BentoCard";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { Separator } from "@/components/ui/separator";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: register, isPending, isError, error } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone_number: "",
      age: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    register(registerData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent py-16">
      <MotionWrapper className="w-full max-w-[550px]">
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
              Buat akun baru
            </p>
          </div>
        </div>

        <BentoCard 
          title="Daftar Akun" 
          subtitle="Isi data di bawah untuk mendaftar"
          delay={0.1}
        >
          <div className="pt-4">
            {isError && (
              <Alert variant="destructive" className="mb-8 bg-destructive/5 border-destructive/20 text-destructive rounded-2xl">
                <AlertDescription className="text-xs font-semibold">
                  {error instanceof Error
                    ? error.message
                    : "Pendaftaran gagal. Cek kembali data Anda."}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Username</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-all" />
                            <Input
                              placeholder="johndoe"
                              className="pl-11 h-12 bg-secondary/20 border-border/40 focus:bg-secondary/40 rounded-2xl transition-all font-medium text-sm"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Email</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-all" />
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="pl-11 h-12 bg-secondary/20 border-border/40 focus:bg-secondary/40 rounded-2xl transition-all font-medium text-sm"
                              disabled={isPending}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">No. HP</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-all" />
                            <Input
                              placeholder="+123456789"
                              className="pl-11 h-12 bg-secondary/20 border-border/40 focus:bg-secondary/40 rounded-2xl transition-all font-medium text-sm"
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
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Usia</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-all" />
                            <Input
                              type="number"
                              placeholder="25"
                              className="pl-11 h-12 bg-secondary/20 border-border/40 focus:bg-secondary/40 rounded-2xl transition-all font-medium text-sm"
                              disabled={isPending}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                              value={field.value ?? ""}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="py-2">
                   <Separator className="opacity-40" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-all" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-11 pr-11 h-12 bg-secondary/20 border-border/40 focus:bg-secondary/40 rounded-2xl transition-all font-medium text-sm"
                              disabled={isPending}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all"
                            >
                              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold ml-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Ulangi Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-all" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-11 pr-11 h-12 bg-secondary/20 border-border/40 focus:bg-secondary/40 rounded-2xl transition-all font-medium text-sm"
                              disabled={isPending}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 mt-4 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]" 
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Mendaftar...
                    </div>
                  ) : (
                    "Daftar"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </BentoCard>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-bold transition-all decoration-primary underline-offset-4 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </MotionWrapper>
    </div>
  );
};

export default RegisterPage;
