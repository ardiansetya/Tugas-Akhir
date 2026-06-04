"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit,
  Save,
  X,
  Key,
  Cake,
  Activity,
  Terminal,
  Lock,
  ChevronRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile, useUpdateProfile } from "@/hooks";
import type { UserProfile } from "@/types/api";
import { toast } from "sonner";
import ChangePasswordModal from "@/components/shared/modal/ChangePasswordModal";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { BentoCard } from "@/components/shared/BentoCard";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: profileData, isLoading: loading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserProfile>>({});
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    if (profileData) {
      setEditedData({
        username: profileData.username,
        email: profileData.email,
        phone_number: profileData.phone_number,
        age: profileData.age,
      });
    }
  }, [profileData]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (profileData) {
      setEditedData({
        username: profileData.username,
        email: profileData.email,
        phone_number: profileData.phone_number,
        age: profileData.age,
      });
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editedData.username || !editedData.email || !editedData.phone_number || editedData.age === undefined) {
      toast.error("Semua kolom harus diisi.");
      return;
    }

    updateProfile(
      {
        username: editedData.username,
        email: editedData.email,
        phone_number: editedData.phone_number,
        age: editedData.age,
      },
      {
        onSuccess: () => {
          toast.success("Profil berhasil disimpan.");
          setIsEditing(false);
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || "Gagal menyimpan. Coba lagi.";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleChange = (field: keyof Partial<UserProfile>, value: string | number) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; bg: string; text: string }> = {
      ADMIN: { label: "Admin", bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
      MODERATOR: { label: "Moderator", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
      DRIVER: { label: "Driver", bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
      OWNER: { label: "Pemilik", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    };
    return roles[role] || { label: role, bg: "bg-secondary", text: "text-muted-foreground" };
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="h-14 w-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Memuat profil...</p>
      </div>
    );
  }

  if (!profileData || !editedData) return null;

  const roleInfo = getRoleBadge(profileData.role);

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Header Halaman */}
      <MotionWrapper className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
          Profil Saya
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Lihat dan ubah data profil Anda.
        </p>
      </MotionWrapper>

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Bento Card Identitas Utama */}
        <MotionWrapper delay={0.1}>
          <BentoCard className="p-0 overflow-hidden">
             <div className="bg-primary/5 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-8 border-b">
                <div className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/20 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                   <Avatar className="h-40 w-40 rounded-3xl border-4 border-background shadow-2xl relative">
                     <AvatarImage src="" />
                     <AvatarFallback className="text-4xl font-bold bg-background text-primary">
                        {getInitials(profileData.username)}
                     </AvatarFallback>
                   </Avatar>
                   <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 border-4 border-background rounded-full items-center justify-center flex">
                      <Zap className="h-3 w-3 text-white" />
                   </div>
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                   <div className="space-y-1">
                      <h2 className="text-3xl font-bold tracking-tight">{profileData.username}</h2>
                      <p className="text-sm font-medium text-muted-foreground">{profileData.email}</p>
                   </div>
                   <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                      <div className={cn("px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest", roleInfo.bg, roleInfo.text)}>
                        {roleInfo.label}
                      </div>
                      <div className="px-4 py-1.5 rounded-xl text-[10px] font-bold text-muted-foreground bg-secondary/50 uppercase tracking-widest border border-border/40">
                        ID: {profileData.id.slice(0, 8)}
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                   {!isEditing ? (
                     <Button size="lg" className="rounded-2xl h-14 px-8 font-bold gap-3 shadow-lg shadow-primary/20" onClick={handleEdit}>
                        <Edit className="h-4 w-4" />
                        Ubah Profil
                     </Button>
                   ) : (
                     <div className="flex gap-2">
                        <Button variant="ghost" className="rounded-2xl h-14 px-6 font-bold gap-3" onClick={handleCancel}>
                           <X className="h-4 w-4" />
                           Batal
                        </Button>
                        <Button className="rounded-2xl h-14 px-8 font-bold gap-3 shadow-lg shadow-primary/20" onClick={handleSave} disabled={isPending}>
                           <Save className="h-4 w-4" />
                           {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                     </div>
                   )}
                </div>
             </div>

             <div className="p-8 md:p-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: User, label: "Nama", field: "username", value: profileData.username },
                  { icon: Mail, label: "Email", field: "email", value: profileData.email },
                  { icon: Phone, label: "No. HP", field: "phone_number", value: profileData.phone_number },
                  { icon: Cake, label: "Usia", field: "age", value: `${profileData.age} Tahun` },
                ].map((item, i) => (
                  <div key={i} className="space-y-3 group">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                     </div>
                     {isEditing ? (
                       <input
                         type={item.field === "age" ? "number" : "text"}
                         value={editedData[item.field as keyof Partial<UserProfile>]}
                         onChange={(e) => handleChange(item.field as any, item.field === "age" ? parseInt(e.target.value) : e.target.value)}
                         className="w-full px-5 h-14 rounded-2xl border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold transition-all"
                       />
                     ) : (
                       <div className="w-full px-5 h-14 flex items-center rounded-2xl border bg-secondary/5 group-hover:bg-secondary/10 font-bold transition-all text-foreground/80">
                         {item.value}
                       </div>
                     )}
                  </div>
                ))}
                
                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <Shield className="h-3.5 w-3.5" />
                      Peran
                   </div>
                   <div className="w-full px-5 h-14 flex items-center justify-between rounded-2xl border bg-primary/5 font-bold text-primary">
                      {roleInfo.label}
                      <Lock className="h-4 w-4" />
                   </div>
                </div>
             </div>
          </BentoCard>
        </MotionWrapper>

        {/* Bagian Bento Grid Keamanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <MotionWrapper delay={0.2}>
              <BentoCard 
                title="Ganti Password" 
                subtitle="Keamanan akun" 
                icon={<Key className="h-5 w-5" />}
              >
                 <div className="mt-4 space-y-6">
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                       Ganti password secara berkala untuk menjaga keamanan akun.
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-14 rounded-2xl font-bold gap-3 border-border/60 hover:bg-primary/5 hover:text-primary transition-all"
                      onClick={() => setChangePasswordModalOpen(true)}
                    >
                      <Terminal className="h-5 w-5" />
                      Ganti Password
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                 </div>
              </BentoCard>
           </MotionWrapper>

           <MotionWrapper delay={0.3}>
              <BentoCard
                title="Aktivitas Terbaru"
                subtitle="Riwayat aktivitas"
                icon={<Activity className="h-5 w-5" />}
              >
                  <div className="mt-4 space-y-4">
                     {[
                       { event: "Login Berhasil", time: "2j yang lalu" },
                       { event: "Profil Diperbarui", time: "1h yang lalu" },
                       { event: "Password Diganti", time: "30h yang lalu" },
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 border border-border/20">
                          <span className="text-xs font-bold text-foreground/70">{item.event}</span>
                          <span className="text-[10px] font-medium text-muted-foreground">{item.time}</span>
                       </div>
                     ))}
                  </div>
              </BentoCard>
           </MotionWrapper>
        </div>
      </div>

      <ChangePasswordModal
        open={changePasswordModalOpen}
        onOpenChange={setChangePasswordModalOpen}
      />
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}
