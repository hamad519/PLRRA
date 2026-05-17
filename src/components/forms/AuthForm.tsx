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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const authSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['user', 'admin']).optional(),
});

interface AuthFormProps {
  type: 'login' | 'register';
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: type === 'register' ? "" : undefined, // Only initialize username for register
      email: "", 
      password: "",
      role: type === 'register' ? 'user' : undefined,
    },
  });

  // Log form errors on every render to help debug validation issues
  React.useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Current form errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  async function onSubmit(values: z.infer<typeof authSchema>) {
    console.log("onSubmit triggered with values:", values); // Log to confirm if onSubmit is called
    setIsLoading(true);
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        if (type === 'login') {
          router.push('/admin/dashboard');
        } else {
          form.reset();
        }
      } else {
        toast.error(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Network error or server unreachable.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6 max-w-md mx-auto">
      <CardHeader className="pb-6 text-center">
        <CardTitle className="text-admin-accent text-lg font-semibold uppercase tracking-wider mb-2">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <h2 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary">
          {type === 'login' ? 'Admin Login' : 'Register User'}
        </h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {type === 'register' && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-admin-text-primary text-lg">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
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
                  <FormLabel className="text-admin-text-primary text-lg">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === 'register' && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-admin-text-primary text-lg">Role</FormLabel>
                    <FormControl>
                      <select {...field} className="flex h-10 w-full rounded-md border border-admin-input-border bg-admin-input-bg px-3 py-2 text-sm text-admin-text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" variant="default" className="w-full h-10 rounded-lg text-sm font-semibold shadow-sm transition-colors bg-admin-accent text-white hover:bg-admin-accent/90" disabled={isLoading}>
              {isLoading ? 'Processing...' : (type === 'login' ? 'Login' : 'Register')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};