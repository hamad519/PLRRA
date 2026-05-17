"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Rss, CalendarIcon, Upload, CheckCircle2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { uploadImage } from '@/lib/uploadImage';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.date(),
  imageBase64: z.string().min(1, "Featured image is required"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  mode: 'add' | 'edit';
  initialData?: Partial<FormValues> & { id?: number };
}

export const BlogForm = ({ mode, initialData }: BlogFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      imageBase64: initialData?.imageBase64 ?? "",
      shortDescription: initialData?.shortDescription ?? "",
      content: initialData?.content ?? "",
      isActive: initialData?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title ?? "",
        date: initialData.date ? new Date(initialData.date) : new Date(),
        imageBase64: initialData.imageBase64 ?? "",
        shortDescription: initialData.shortDescription ?? "",
        content: initialData.content ?? "",
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, form]);

  const imageBase64 = form.watch("imageBase64");

  const handleImageChange = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file, { folder: 'blogs' });
      form.setValue("imageBase64", url, { shouldValidate: true });
    } catch (err: any) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const url = mode === 'add'
        ? '/api/admin/blogs'
        : `/api/admin/blogs/${initialData?.id}`;
      const method = mode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(mode === 'add' ? "Blog published!" : "Blog updated!");
        router.push('/admin/blogs/manage');
      } else {
        toast.error(data.message || "Failed to save blog");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save blog");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto bg-white border-admin-border shadow-xl rounded-[2rem]">
      <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
        <CardTitle className="text-2xl font-black flex items-center gap-3">
          <Rss className="text-admin-accent" /> {mode === 'add' ? 'New Blog Article' : 'Edit Blog Article'}
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
                  <FormLabel className="font-bold">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., New Season Championship Announcement"
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
                  <FormLabel className="font-bold">Publish Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left h-12 rounded-xl bg-admin-bg border-none",
                            !field.value && "text-muted-foreground",
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
              name="imageBase64"
              render={() => (
                <FormItem>
                  <FormLabel className="font-bold">Featured Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full min-h-[180px] border-2 border-dashed rounded-xl cursor-pointer bg-admin-bg border-admin-border hover:border-admin-accent transition-all overflow-hidden">
                        {imageBase64 ? (
                          <div className="relative w-full">
                            <img src={imageBase64} alt="Featured" className="w-full max-h-64 object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  form.setValue("imageBase64", "", { shouldValidate: true });
                                }}
                                className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600"
                                title="Remove image"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ) : isUploading ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-admin-accent border-t-transparent rounded-full animate-spin mb-2" />
                            <p className="text-sm text-gray-500 font-bold">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="text-sm text-gray-500 font-bold">Click to upload featured image</p>
                            <p className="text-xs text-gray-400">JPG, PNG, WEBP — compressed automatically</p>
                          </div>
                        )}
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e.target.files?.[0])}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief 1–2 sentence summary shown on the listing card."
                      {...field}
                      className="bg-admin-bg border-none rounded-xl min-h-[90px] resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Article Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your article here. Use the toolbar for headings, lists, links, images, and formatting."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between bg-admin-bg rounded-xl px-4 py-3">
                  <FormLabel className="font-bold cursor-pointer">Published</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="mx-auto flex h-10 px-6 rounded-lg bg-admin-accent hover:bg-admin-accent/90 text-white text-sm font-semibold shadow-sm transition-colors items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> {mode === 'add' ? 'Publish Blog' : 'Update Blog'}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
