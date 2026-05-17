"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Reveal } from '@/components/animations/Reveal';
import { HierarchicalBulletsField, HierarchicalBullet } from '@/components/forms/HierarchicalBulletsField';

const ICON_OPTIONS = ['History', 'TrendingUp', 'Rocket', 'Landmark', 'Globe', 'Calendar', 'Flag', 'Trophy', 'Target'];

const formSchema = z.object({
  year: z.string().optional(),
  title: z.string().optional(),
  intro: z.string().optional(),
  iconName: z.string().optional(),
  sortOrder: z.number().optional(),
});

export default function AddHistorySectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bullets, setBullets] = useState<HierarchicalBullet[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { year: '', title: '', intro: '', iconName: 'History', sortOrder: 0 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const cleanedBullets = bullets
      .map((b) => ({
        text: b.text.trim(),
        children: (b.children || []).map((c) => c.trim()).filter(Boolean),
      }))
      .filter((b) => b.text.length > 0);

    if (!values.title?.trim() && !values.intro?.trim() && cleanedBullets.length === 0) {
      toast.error('Provide a title, intro, or at least one bullet');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: values.year || '',
          title: values.title || '',
          intro: values.intro || '',
          iconName: values.iconName || '',
          sortOrder: values.sortOrder ?? 0,
          bullets: cleanedBullets,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('History section added!');
        router.push('/admin/history/manage');
      } else {
        toast.error(data.message || 'Failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Add <span className="text-admin-accent">History Section</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">
            Add an entry to the &ldquo;History of Long-Range Shooting in Pakistan&rdquo;. All fields are optional &mdash; fill in only what applies.
          </p>
        </Reveal>
      </header>

      <Card className="max-w-3xl mx-auto bg-white border-admin-border shadow-xl rounded-[2rem]">
        <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <History className="text-admin-accent" /> New History Section
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
                      <FormLabel className="font-bold">Year / Period (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2005 or 2009–2011" {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
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
                    <FormLabel className="font-bold">Title (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Foundations Laid" {...field} className="bg-admin-bg border-none h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="intro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Intro Paragraph (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short paragraph shown above the bullets (e.g., the section overview)."
                        {...field}
                        className="bg-admin-bg border-none min-h-[100px] rounded-xl"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Icon (optional)</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full bg-admin-bg border-none h-12 rounded-xl px-4 text-sm"
                      >
                        <option value="">— No icon —</option>
                        {ICON_OPTIONS.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <HierarchicalBulletsField value={bullets} onChange={setBullets} />

              <Button type="submit" disabled={isLoading} className="w-full h-11 rounded-lg bg-admin-accent text-white text-sm font-semibold hover:bg-admin-accent/90 transition-colors">
                {isLoading ? 'Saving...' : 'Save History Section'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
