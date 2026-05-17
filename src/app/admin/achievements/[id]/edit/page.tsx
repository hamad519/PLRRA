"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trophy } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Reveal } from '@/components/animations/Reveal';
import { HierarchicalBulletsField, HierarchicalBullet } from '@/components/forms/HierarchicalBulletsField';

const formSchema = z.object({
  year: z.string().optional(),
  title: z.string().min(3, 'Title is required'),
  sortOrder: z.number().optional(),
});

export default function EditAchievementPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? '');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bullets, setBullets] = useState<HierarchicalBullet[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { year: '', title: '', sortOrder: 0 },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/achievements/${id}`);
        const data = await res.json();
        if (data.success) {
          form.reset({
            year: data.data.year || '',
            title: data.data.title || '',
            sortOrder: data.data.sortOrder ?? 0,
          });
          const raw = Array.isArray(data.data.bullets) ? data.data.bullets : [];
          setBullets(
            raw.map((b: any) => ({
              text: typeof b?.text === 'string' ? b.text : '',
              children: Array.isArray(b?.children) ? b.children.map((c: any) => String(c ?? '')) : [],
            }))
          );
        } else {
          toast.error(data.message || 'Failed to load');
          router.push('/admin/achievements/manage');
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to load');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) load();
  }, [id, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const cleanedBullets = bullets
      .map((b) => ({
        text: b.text.trim(),
        children: (b.children || []).map((c) => c.trim()).filter(Boolean),
      }))
      .filter((b) => b.text.length > 0);

    if (cleanedBullets.length === 0) {
      toast.error('Add at least one bullet point');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: values.year || '',
          title: values.title,
          sortOrder: values.sortOrder ?? 0,
          bullets: cleanedBullets,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Achievement updated!');
        router.push('/admin/achievements/manage');
      } else {
        toast.error(data.message || 'Failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="text-center py-20 text-admin-text-secondary">Loading achievement...</div>;

  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Edit <span className="text-admin-accent">Achievement</span>
          </h1>
        </Reveal>
      </header>

      <Card className="max-w-3xl mx-auto bg-white border-admin-border shadow-xl rounded-[2rem]">
        <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <Trophy className="text-admin-accent" /> Update Achievement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Year (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2025 or 2023–2024" {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="bg-admin-bg border-none h-12 rounded-xl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <HierarchicalBulletsField value={bullets} onChange={setBullets} />

              <Button type="submit" disabled={isSaving} className="w-full h-11 rounded-lg bg-admin-accent text-white text-sm font-semibold hover:bg-admin-accent/90 transition-colors">
                {isSaving ? 'Saving...' : 'Update Achievement'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
