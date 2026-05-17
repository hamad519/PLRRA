"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Welcome back!");
        router.push('/admin/dashboard');
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-950">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-plra-accent-purple/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-plra-gold/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />
      </div>

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col items-center justify-center p-16">
        <div className="max-w-md text-center space-y-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image src="/plra_logo.png" alt="PLRA" fill className="object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
          </div>
          <div>
            <p className="text-plra-gold text-xs font-black tracking-[0.4em] uppercase mb-2">Pakistan</p>
            <h1 className="text-white text-4xl font-black tracking-tight leading-tight">
              Long Range Rifle<br />Association
            </h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            The official administrative portal for managing events, competitions, records, and membership.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-plra-gold/50" />
            <span className="text-plra-gold/60 text-[10px] font-black tracking-[0.3em] uppercase">Admin Panel</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-plra-gold/50" />
          </div>
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Image src="/plra_logo.png" alt="PLRA" fill className="object-contain" />
            </div>
            <p className="text-plra-gold text-[10px] font-black tracking-[0.3em] uppercase">Admin Panel</p>
          </div>

          {/* Frosted glass card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-plra-accent-purple to-plra-accent-pink flex items-center justify-center mx-auto mb-5 shadow-[0_10px_30px_rgba(139,92,246,0.3)]">
                <Lock size={24} className="text-white" />
              </div>
              <h2 className="text-white text-2xl font-black tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-2">Sign in to your admin account</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="email"
                            placeholder="Email address"
                            {...field}
                            className="h-14 pl-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-plra-accent-purple focus:ring-1 focus:ring-plra-accent-purple/50 transition-all"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...field}
                            className="h-14 pl-12 pr-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-plra-accent-purple focus:ring-1 focus:ring-plra-accent-purple/50 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-plra-accent-purple to-plra-accent-pink hover:opacity-90 text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg group"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-xs">
                Authorized personnel only. All access is logged.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-700 text-xs mt-8">
            &copy; {new Date().getFullYear()} Pakistan Long Range Rifle Association
          </p>
        </div>
      </div>
    </div>
  );
}
