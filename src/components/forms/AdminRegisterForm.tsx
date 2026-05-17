"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Mail, Lock, ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['user', 'admin'], {
    required_error: "Please select a user role.",
  }),
});

export const AdminRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("New user account created successfully!");
        form.reset();
      } else {
        toast.error(data.message || 'Failed to register user.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Reveal direction="up">
      <Card className="max-w-2xl mx-auto bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 bg-slate-950 text-white relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-plra-gold/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-plra-gold flex items-center justify-center text-slate-950 shadow-lg">
              <UserPlus size={28} />
            </div>
            <div>
              <CardTitle className="text-3xl font-black tracking-tight">Create Account</CardTitle>
              <p className="text-gray-400 text-sm font-medium mt-1">Register a new member or administrator</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Username</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-plra-gold transition-colors" size={18} />
                          <Input placeholder="johndoe" {...field} className="pl-12 bg-admin-bg border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-gold transition-all font-bold" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-plra-gold transition-colors" size={18} />
                          <Input type="email" placeholder="john@example.com" {...field} className="pl-12 bg-admin-bg border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-gold transition-all font-bold" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-plra-gold transition-colors" size={18} />
                          <Input type="password" placeholder="••••••••" {...field} className="pl-12 bg-admin-bg border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-gold transition-all font-bold" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Access Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-plra-gold transition-colors z-10" size={18} />
                            <SelectTrigger className="pl-12 bg-admin-bg border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-gold transition-all font-bold">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-100 rounded-2xl shadow-2xl">
                          <SelectItem value="user" className="font-bold">Standard User</SelectItem>
                          <SelectItem value="admin" className="font-bold">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="mx-auto flex h-11 px-8 rounded-lg bg-slate-950 hover:bg-plra-gold hover:text-slate-950 text-white text-sm font-semibold shadow-sm transition-colors items-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Register User <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Reveal>
  );
};