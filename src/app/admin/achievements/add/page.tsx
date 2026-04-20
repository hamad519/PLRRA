"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trophy, Plus, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Reveal } from '@/components/animations/Reveal';

const formSchema = z.object({
  year: z.string().min(4, "Year is required"),
  title: z.string().min(3, "Title is required"),
  subtitle: z.string().optional(),
  details: z.array(z.object({ value: z.string().min(1, "Cannot be empty") })).min(1, "Add at least one detail"),
  sortOrder: z.number(),
});

export default function AddAchievementPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { year: "", title: "", subtitle: "", details: [{ value: "" }], sortOrder: 0 },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "details" });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          details: values.details.map((d) => d.value),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Achievement added!");
        router.push('/admin/achievements/manage');
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Add <span className="text-admin-accent">Achievement</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">Add a year of international achievement for the FTR team.</p>
        </Reveal>
      </header>

      <Card className="max-w-2xl mx-auto bg-white border-admin-border shadow-xl rounded-[2rem]">
        <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <Trophy className="text-admin-accent" /> New Achievement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="year" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Year</FormLabel>
                    <FormControl><Input placeholder="e.g., 2025" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="sortOrder" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Sort Order</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(Number(e.target.value))} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Global Supremacy" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="subtitle" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Subtitle / Championship Name</FormLabel>
                  <FormControl><Input placeholder="e.g., South African Open Championship" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                </FormItem>
              )} />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-bold text-sm">Details / Bullet Points</label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => append({ value: "" })} className="text-admin-accent">
                    <Plus size={16} className="mr-1" /> Add Point
                  </Button>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField control={form.control} name={`details.${index}.value`} render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl><Input placeholder={`Detail ${index + 1}`} {...field} className="bg-admin-bg border-none h-10 rounded-xl text-sm" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 shrink-0">
                          <XCircle size={18} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full py-8 rounded-xl bg-admin-accent text-white font-black uppercase tracking-widest">
                {isLoading ? "Saving..." : "Save Achievement"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
