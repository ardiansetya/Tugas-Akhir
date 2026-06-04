import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username wajib diisi")
      .min(3, "Username minimal 3 karakter")
      .max(20, "Username maksimal 20 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh mengandung huruf, angka, dan underscore"
      ),
    email: z
      .email('Email tidak valid'),
    phone_number: z
      .string()
      .min(1, "Nomor telepon wajib diisi")
      .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid")
      .min(10, "Nomor telepon minimal 10 digit"),
    age: z
      .number(
        "Umur harus berupa angka"
      )
      .min(13, "Umur minimal 13 tahun")
      .max(120, "Umur tidak valid"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password maksimal 50 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
