"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Newspaper, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  title: z.string().min(3, "News title must be at least 3 characters"),
  date: z.date(),
  isActive: z.boolean().default(true),
});

export const AddLatestNewsForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      isActive: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/latest-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("News item added successfully!");
        router.push('/admin/latest-news/manage');
      } else {
        toast.error(data.message || "Failed to add news item");
      }
    } catch (error) {
      toast.error("Failed to add news item");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white border-admin-border shadow-xl rounded-[2rem]">
      <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
        <CardTitle className="text-2xl font-black flex items-center gap-3">
          <Newspaper className="text-admin-accent" /> New Latest News
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">News Text</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., The 3rd F-Class Championship 2025 registrations are now open!"
                      {...field}
                      className="bg-admin-bg border-none h-12 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left h-12 rounded-xl bg-admin-bg border-none",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between bg-admin-bg rounded-xl px-4 py-3">
                  <FormLabel className="font-bold cursor-pointer">Show in Ticker</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-8 rounded-xl bg-admin-accent text-white font-black uppercase tracking-widest"
            >
              {isLoading ? "Saving..." : "Save News Item"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
