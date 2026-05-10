"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validators";
import { Globe, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async () => {
    setSent(true);
    toast.success("Password reset link sent!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center"><Globe size={22} className="text-white" /></div>
            <span className="text-2xl font-bold gradient-text">Traveloop</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Reset password</h1>
          <p className="text-muted text-sm">We&apos;ll send you a reset link</p>
        </div>
        <div className="glass rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-lg font-semibold mb-2">Check your email</h3>
              <p className="text-muted text-sm mb-6">We&apos;ve sent a password reset link to your email address.</p>
              <Link href="/login" className="btn-primary">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-muted mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input {...register("email")} type="email" placeholder="you@example.com" className="input-field pl-10" />
                </div>
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" className="btn-primary w-full py-3">Send Reset Link</button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
