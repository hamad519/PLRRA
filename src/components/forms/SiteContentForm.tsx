"use client";

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Image as ImageIcon, Trophy, Layout, Info, Upload, XCircle, Landmark } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';
import Image from 'next/image';
import { uploadImage } from '@/lib/uploadImage';

const contentSchema = z.object({
  plraIntro: z.string().min(10, "Introduction is too short"),
  stats: z.object({
    nationalRecords: z.string(),
    internationalMedals: z.string(),
    eliteShooters: z.string(),
    growthRate: z.string(),
  }),
  accountDetails: z.object({
    bankName: z.string(),
    accountTitle: z.string(),
    accountNumber: z.string(),
    iban: z.string(),
    branchCode: z.string(),
  }),
  championMoments: z.array(z.object({
    title: z.string(),
    imageBase64: z.string(),
  })),
  heroSlides: z.array(z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    imageBase64: z.string(),
  })),
  aims: z.array(z.object({
    title: z.string(),
    description: z.string(),
    iconName: z.string().optional(),
  })),
});

const AIM_ICON_OPTIONS = ['Target', 'Users', 'Handshake', 'ShieldCheck', 'Trophy', 'Star', 'Flag', 'Globe', 'Award'];

type PendingImage = { file: File; previewUrl: string };

export const SiteContentForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Pending image files keyed by useFieldArray field.id (stable across reorders).
  const [pendingHeroImages, setPendingHeroImages] = useState<Record<string, PendingImage>>({});
  const [pendingChampionImages, setPendingChampionImages] = useState<Record<string, PendingImage>>({});

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      plraIntro: "",
      stats: { nationalRecords: "", internationalMedals: "", eliteShooters: "", growthRate: "" },
      accountDetails: { bankName: "", accountTitle: "", accountNumber: "", iban: "", branchCode: "" },
      championMoments: [],
      heroSlides: [],
      aims: [],
    },
  });

  const { fields: championFields, append: appendChampion, remove: removeChampion } = useFieldArray({
    control: form.control,
    name: "championMoments",
  });

  const { fields: heroFields, append: appendHero, remove: removeHero } = useFieldArray({
    control: form.control,
    name: "heroSlides",
  });

  const { fields: aimFields, append: appendAim, remove: removeAim } = useFieldArray({
    control: form.control,
    name: "aims",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success) {
          form.reset({
            plraIntro: data.data.plraIntro,
            stats: data.data.stats,
            accountDetails: data.data.accountDetails || { bankName: "", accountTitle: "", accountNumber: "", iban: "", branchCode: "" },
            championMoments: data.data.championMoments || [],
            heroSlides: data.data.heroSlides || [],
            aims: data.data.aims || [],
          });
        }
      } catch (error) {
        toast.error("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [form]);

  const stagePendingImage = (
    fieldId: string,
    file: File,
    bucket: 'hero' | 'champion'
  ) => {
    const setter = bucket === 'hero' ? setPendingHeroImages : setPendingChampionImages;
    setter((prev) => {
      const existing = prev[fieldId];
      if (existing) URL.revokeObjectURL(existing.previewUrl);
      return { ...prev, [fieldId]: { file, previewUrl: URL.createObjectURL(file) } };
    });
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldId: string,
    bucket: 'hero' | 'champion'
  ) => {
    if (e.target.files?.[0]) {
      stagePendingImage(fieldId, e.target.files[0], bucket);
    }
    e.target.value = '';
  };

  // Revoke object URLs on unmount.
  useEffect(() => {
    return () => {
      Object.values(pendingHeroImages).forEach((p) => URL.revokeObjectURL(p.previewUrl));
      Object.values(pendingChampionImages).forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: z.infer<typeof contentSchema>) {
    setIsSaving(true);
    try {
      // Upload any pending hero images, replacing imageBase64 with the uploaded URL.
      const heroSlides = await Promise.all(
        values.heroSlides.map(async (slide, idx) => {
          const fieldId = heroFields[idx]?.id;
          const pending = fieldId ? pendingHeroImages[fieldId] : undefined;
          if (pending) {
            const url = await uploadImage(pending.file, {
              folder: 'site',
              maxSizeMB: 0.5,
              maxWidthOrHeight: 1920,
            });
            return { ...slide, imageBase64: url };
          }
          return slide;
        })
      );

      const championMoments = await Promise.all(
        values.championMoments.map(async (moment, idx) => {
          const fieldId = championFields[idx]?.id;
          const pending = fieldId ? pendingChampionImages[fieldId] : undefined;
          if (pending) {
            const url = await uploadImage(pending.file, {
              folder: 'site',
              maxSizeMB: 0.5,
              maxWidthOrHeight: 1920,
            });
            return { ...moment, imageBase64: url };
          }
          return moment;
        })
      );

      const payload = { ...values, heroSlides, championMoments };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Site content updated successfully!");
        Object.values(pendingHeroImages).forEach((p) => URL.revokeObjectURL(p.previewUrl));
        Object.values(pendingChampionImages).forEach((p) => URL.revokeObjectURL(p.previewUrl));
        setPendingHeroImages({});
        setPendingChampionImages({});
      } else {
        console.error('Save failed:', data);
        toast.error(data.message || "Failed to save changes");
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="text-center py-20">Loading content...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 pb-20">
        
        {/* Section 1: Introduction */}
        <Reveal direction="up">
          <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Info className="text-admin-accent" /> PLRA Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <FormField
                control={form.control}
                name="plraIntro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">About Section Text</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-admin-bg border-none min-h-[150px] rounded-2xl focus:ring-2 focus:ring-admin-accent" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </Reveal>

        {/* Section 1.5: Our Aims */}
        <Reveal direction="up" delay={0.05}>
          <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Info className="text-admin-accent" /> Our Aims
              </CardTitle>
              <Button type="button" onClick={() => appendAim({ title: "", description: "", iconName: "Target" })} className="bg-admin-accent text-white rounded-xl">
                <Plus size={18} className="mr-2" /> Add Aim
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {aimFields.length === 0 && (
                <p className="text-sm text-admin-text-secondary italic text-center py-6">
                  No aims yet. Click &ldquo;Add Aim&rdquo; to start (e.g., Development, Representation, Collaboration, Safety).
                </p>
              )}
              {aimFields.map((field, index) => (
                <div key={field.id} className="p-6 bg-admin-bg/30 rounded-[1.5rem] border border-admin-border relative">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAim(index)} className="absolute top-3 right-3 text-red-500 hover:bg-red-50 rounded-full">
                    <Trash2 size={18} />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <FormField control={form.control} name={`aims.${index}.iconName`} render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel className="font-bold">Icon</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full bg-white border-none h-12 rounded-xl px-4 text-sm">
                            <option value="">— None —</option>
                            {AIM_ICON_OPTIONS.map((name) => (
                              <option key={name} value={name}>{name}</option>
                            ))}
                          </select>
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`aims.${index}.title`} render={({ field }) => (
                      <FormItem className="md:col-span-9">
                        <FormLabel className="font-bold">Title</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g., Development" className="bg-white border-none h-12 rounded-xl" /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`aims.${index}.description`} render={({ field }) => (
                      <FormItem className="md:col-span-12">
                        <FormLabel className="font-bold">Description</FormLabel>
                        <FormControl><Textarea {...field} placeholder="e.g., Encouraging participation and growth in Long-Range Rifle Shooting across Pakistan." className="bg-white border-none min-h-[80px] rounded-xl" /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Reveal>

        {/* Section 2: Statistics */}
        <Reveal direction="up" delay={0.1}>
          <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Trophy className="text-admin-accent" /> Site Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="stats.nationalRecords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">National Records</FormLabel>
                    <FormControl><Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stats.internationalMedals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">International Medals</FormLabel>
                    <FormControl><Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stats.eliteShooters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Elite Shooters</FormLabel>
                    <FormControl><Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stats.growthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Growth Rate</FormLabel>
                    <FormControl><Input {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </Reveal>

        {/* Section 3: Account Details */}
        <Reveal direction="up" delay={0.15}>
          <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Landmark className="text-admin-accent" /> Bank Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="accountDetails.bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Bank Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Habib Bank Limited (HBL)" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountDetails.accountTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Account Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Pakistan Long Range Rifle Association" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountDetails.accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Account Number</FormLabel>
                    <FormControl><Input placeholder="e.g., 1234567890" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountDetails.iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">IBAN</FormLabel>
                    <FormControl><Input placeholder="e.g., PK36HABB0012345678901234" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountDetails.branchCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Branch Code</FormLabel>
                    <FormControl><Input placeholder="e.g., 0123" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </Reveal>

        {/* Section 4: Hero Carousel */}
        <Reveal direction="up" delay={0.2}>
          <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Layout className="text-admin-accent" /> Hero Carousel Slides
              </CardTitle>
              <Button type="button" onClick={() => appendHero({ title: "", subtitle: "", description: "", imageBase64: "" })} className="bg-admin-accent text-white rounded-xl">
                <Plus size={18} className="mr-2" /> Add Slide
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {heroFields.map((field, index) => {
                const pendingPreview = pendingHeroImages[field.id]?.previewUrl;
                const existing = form.watch(`heroSlides.${index}.imageBase64`);
                const previewSrc = pendingPreview || existing;
                return (
                <div key={field.id} className="p-8 bg-admin-bg/30 rounded-[2rem] border border-admin-border relative group">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeHero(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 rounded-full">
                    <Trash2 size={20} />
                  </Button>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                      <div className="relative aspect-video bg-white rounded-2xl border-2 border-dashed border-admin-border flex items-center justify-center overflow-hidden">
                        {previewSrc ? (
                          <Image src={previewSrc} alt="Hero" fill className="object-cover" unoptimized={!!pendingPreview} />
                        ) : (
                          <ImageIcon size={40} className="text-gray-300" />
                        )}
                        <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="text-white" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, field.id, 'hero')} />
                        </label>
                      </div>
                    </div>
                    <div className="lg:col-span-8 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name={`heroSlides.${index}.subtitle`} render={({ field }) => (
                          <FormItem><FormLabel className="font-bold">Subtitle (Gold Text)</FormLabel><FormControl><Input {...field} className="bg-white border-none h-12 rounded-xl" /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name={`heroSlides.${index}.title`} render={({ field }) => (
                          <FormItem><FormLabel className="font-bold">Main Title</FormLabel><FormControl><Input {...field} className="bg-white border-none h-12 rounded-xl" /></FormControl></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name={`heroSlides.${index}.description`} render={({ field }) => (
                        <FormItem><FormLabel className="font-bold">Description</FormLabel><FormControl><Textarea {...field} className="bg-white border-none h-24 rounded-xl" /></FormControl></FormItem>
                      )} />
                    </div>
                  </div>
                </div>
                );
              })}
            </CardContent>
          </Card>
        </Reveal>

        {/* Section 4: Champion Moments */}
        <Reveal direction="up" delay={0.3}>
          <Card className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <ImageIcon className="text-admin-accent" /> Champion Moments
              </CardTitle>
              <Button type="button" onClick={() => appendChampion({ title: "", imageBase64: "" })} className="bg-admin-accent text-white rounded-xl">
                <Plus size={18} className="mr-2" /> Add Moment
              </Button>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {championFields.map((field, index) => {
                const pendingPreview = pendingChampionImages[field.id]?.previewUrl;
                const existing = form.watch(`championMoments.${index}.imageBase64`);
                const previewSrc = pendingPreview || existing;
                return (
                <div key={field.id} className="relative group bg-admin-bg/30 p-4 rounded-2xl border border-admin-border">
                  <div className="relative aspect-square bg-white rounded-xl overflow-hidden mb-4 border border-admin-border">
                    {previewSrc ? (
                      <Image src={previewSrc} alt="Champion" fill className="object-cover" unoptimized={!!pendingPreview} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={32} /></div>
                    )}
                    <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, field.id, 'champion')} />
                    </label>
                  </div>
                  <FormField control={form.control} name={`championMoments.${index}.title`} render={({ field }) => (
                    <Input {...field} placeholder="Moment Title" className="bg-white border-none h-10 rounded-lg text-xs font-bold" />
                  )} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeChampion(index)} className="absolute -top-2 -right-2 bg-white shadow-lg text-red-500 rounded-full h-8 w-8">
                    <XCircle size={16} />
                  </Button>
                </div>
                );
              })}
            </CardContent>
          </Card>
        </Reveal>

        <Button type="submit" disabled={isSaving} className="w-full py-10 rounded-[2rem] bg-admin-accent text-white text-xl font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.01]">
          {isSaving ? "Saving Content..." : <><Save className="mr-3" /> Update Site Content</>}
        </Button>
      </form>
    </Form>
  );
};