"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, ShieldAlert, Save } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';

const settingsSchema = z.object({
  address: z.string().min(5, "Address is required"),
  contactNo: z.string().min(5, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  workingHours: z.string().min(2, "Working hours are required"),
  facebookLink: z.string().url("Invalid Facebook URL"),
  instagramLink: z.string().url("Invalid Instagram URL"),
  isMaintenanceMode: z.boolean(),
});

export const SiteSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      address: "",
      contactNo: "",
      email: "",
      workingHours: "",
      facebookLink: "",
      instagramLink: "",
      isMaintenanceMode: false,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success) {
          form.reset(data.data);
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [form]);

  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="text-center py-20">Loading settings...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Reveal direction="up">
            <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden h-full">
              <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <MapPin className="text-admin-accent" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Physical Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Contact Number</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
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
                        <FormLabel className="font-bold">Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="workingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Working Hours</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </Reveal>

          {/* Social Media & Maintenance */}
          <div className="space-y-8">
            <Reveal direction="up" delay={0.1}>
              <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <Facebook className="text-admin-accent" /> Social Media Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <FormField
                    control={form.control}
                    name="facebookLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Facebook URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagramLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Instagram URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <Card className="bg-slate-950 text-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/10">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <ShieldAlert className="text-plra-gold" /> System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <FormField
                    control={form.control}
                    name="isMaintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-white/10 p-6">
                        <div className="space-y-0.5">
                          <FormLabel className="text-lg font-black">Maintenance Mode</FormLabel>
                          <FormDescription className="text-gray-400">
                            When enabled, visitors will see a maintenance page.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-plra-gold"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>

        <Reveal direction="up" delay={0.3}>
          <Button
            type="submit"
            disabled={isSaving}
            className="mx-auto flex h-10 px-6 rounded-lg bg-admin-accent hover:bg-admin-accent/90 text-white text-sm font-semibold shadow-sm transition-colors items-center gap-2"
          >
            {isSaving ? "Saving..." : <><Save className="h-4 w-4" /> Save Site Settings</>}
          </Button>
        </Reveal>
      </form>
    </Form>
  );
};