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
import { MessageSquareQuote, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { Reveal } from '@/components/animations/Reveal';
import { uploadImage } from '@/lib/uploadImage';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  designation: z.string().optional(),
  message: z.string().min(10, "Testimonial must be at least 10 characters"),
  rating: z.number().min(1).max(5),
  isActive: z.boolean(),
});

export default function AddTestimonialPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", designation: "", message: "", rating: 5, isActive: true },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, { folder: 'testimonials', maxSizeMB: 0.3, maxWidthOrHeight: 400 });
      }

      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, imageUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Testimonial added!");
        router.push('/admin/testimonials/manage');
      } else {
        toast.error(data.message || "Failed to add");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add testimonial");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <header>
        <Reveal direction="down">
          <h1 className="text-4xl font-black text-admin-text-primary tracking-tight">
            Add <span className="text-admin-accent">Senior Member</span>
          </h1>
          <p className="text-admin-text-secondary font-medium mt-1">Add a senior or key member of PLRA to showcase on the website.</p>
        </Reveal>
      </header>

      <Card className="max-w-2xl mx-auto bg-white border-admin-border shadow-xl rounded-[2rem]">
        <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <MessageSquareQuote className="text-admin-accent" /> New Senior Member
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Col. Hamad Khan" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="designation" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Designation / Rank</FormLabel>
                    <FormControl><Input placeholder="e.g., President PLRA, Brigadier (Retd)" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Message / Quote</FormLabel>
                  <FormControl><Textarea placeholder="Their message or quote about PLRA..." {...field} className="bg-admin-bg border-none min-h-[120px] rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Photo upload */}
              <div>
                <label className="font-bold text-sm block mb-2">Photo (Optional)</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-admin-accent" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-admin-bg flex items-center justify-center text-admin-text-secondary text-xs font-bold">No photo</div>
                  )}
                  <label className="cursor-pointer bg-admin-bg hover:bg-admin-hover-bg transition-colors px-4 py-2 rounded-xl text-sm font-bold">
                    Choose Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {/* Rating */}
              <FormField control={form.control} name="rating" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => field.onChange(star)} className="focus:outline-none">
                          <Star size={28} className={star <= field.value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between bg-admin-bg rounded-xl px-4 py-3">
                  <FormLabel className="font-bold cursor-pointer">Show on Website</FormLabel>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />

              <Button type="submit" disabled={isLoading} className="w-full py-8 rounded-xl bg-admin-accent text-white font-black uppercase tracking-widest">
                {isLoading ? "Saving..." : "Save Testimonial"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
