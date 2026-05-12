"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Upload, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AdminDatePicker } from '@/components/ui/AdminDatePicker';
import { uploadImage } from '@/lib/uploadImage';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z.any()
  .refine((file) => file?.length > 0, "Main image is required.") // Made required
  .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
    "Only .jpg, .jpeg, .png, .webp formats are supported."
  );

const multipleFilesSchema = z.array(z.any())
  .refine((files) => files.every(file => file.size <= MAX_FILE_SIZE), `Max file size for each image is 5MB.`)
  .refine(
    (files) => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
    "Only .jpg, .jpeg, .png, .webp formats are supported for gallery images."
  ).optional();

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  fromDate: z.date({ required_error: "From date is required." }),
  toDate: z.date({ required_error: "To date is required." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  mainImage: fileSchema,
  galleryImages: multipleFilesSchema,
  description: z.string().optional(),
});

export const AddCompetitionForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
    },
  });

  // For preview only (not sent to server) — quick base64 read
  const fileToPreviewDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Upload to /api/upload — returns public path like /uploads/competitions/xxx.jpg
  const uploadCompetitionImage = (file: File, isMain = false): Promise<string> =>
    uploadImage(file, {
      folder: 'competitions',
      maxSizeMB: isMain ? 0.5 : 0.25,
      maxWidthOrHeight: isMain ? 1920 : 1280,
    });

  const handleMainImageChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const preview = await fileToPreviewDataUrl(file);
      setMainImagePreview(preview);
      onChange(event.target.files);
    } else {
      setMainImagePreview(null);
      onChange(null);
    }
  };

  const handleGalleryImagesChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const previews = await Promise.all(files.map(file => fileToPreviewDataUrl(file)));
      setGalleryImagePreviews(prev => [...prev, ...previews]);
      onChange(files);
    } else {
      // If the user clears the file input, we don't want to clear existing gallery images
      // The removeGalleryImage function handles explicit removal.
      onChange(null);
    }
  };

  const removeMainImage = () => {
    setMainImagePreview(null);
    form.setValue('mainImage', null); // Clear the form field value
    const input = document.getElementById('main-image-upload') as HTMLInputElement;
    if (input) input.value = ''; // Clear the file input
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    const currentFiles = form.getValues('galleryImages');
    if (currentFiles) {
      const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove);
      // Fix: Change null to undefined to match z.array().optional() schema
      form.setValue('galleryImages', updatedFiles.length > 0 ? updatedFiles : undefined); 
    }
    // Note: Clearing individual files from a multiple file input is complex.
    // For simplicity, if all are removed, we clear the input. Otherwise, the input state might not perfectly reflect previews.
    if (galleryImagePreviews.length === 1) { // If this was the last one
      const input = document.getElementById('gallery-images-upload') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Upload main image — receive public URL path
      const mainImageBase64 = values.mainImage && values.mainImage.length > 0
        ? await uploadCompetitionImage(values.mainImage[0], true)
        : undefined;

      // Upload each gallery image
      const galleryImagesBase64: string[] = [];
      if (values.galleryImages && values.galleryImages.length > 0) {
        for (const file of values.galleryImages) {
          galleryImagesBase64.push(await uploadCompetitionImage(file));
        }
      }

      const payload = {
        title: values.title,
        fromDate: values.fromDate.toISOString(),
        toDate: values.toDate.toISOString(),
        location: values.location,
        description: values.description,
        mainImageBase64,
        galleryImagesBase64: galleryImagesBase64.length > 0 ? galleryImagesBase64 : undefined,
      };

      const res = await fetch('/api/admin/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Competition added successfully!");
        form.reset();
        setMainImagePreview(null);
        setGalleryImagePreviews([]);
        router.push('/admin/competitions/manage');
      } else {
        toast.error(data.message || 'Failed to add competition.');
      }
    } catch (error) {
      console.error('Add competition error:', error);
      toast.error('Network error or server unreachable.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6 max-w-2xl mx-auto">
      <CardHeader className="pb-6 text-center">
        <CardTitle className="text-admin-accent text-lg font-semibold uppercase tracking-wider mb-2">
          New Competition
        </CardTitle>
        <h2 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary">
          Add Competition
        </h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., National Long Range Championship" {...field} className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-admin-text-primary text-lg">From Date</FormLabel>
                    <FormControl>
                      <AdminDatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholder="From date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-admin-text-primary text-lg">To Date</FormLabel>
                    <FormControl>
                      <AdminDatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        placeholder="To date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lahore Shooting Range, Pakistan" {...field} className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Main Image Upload Field (now required) */}
            <FormField
              control={form.control}
              name="mainImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Main Image (Upload)</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="main-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-admin-input-bg border-admin-input-border hover:border-admin-accent transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-admin-text-secondary" />
                          <p className="mb-2 text-sm text-admin-text-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-admin-text-secondary">PNG, JPG, WEBP (MAX. 5MB)</p>
                          {value?.[0] && <p className="text-xs text-admin-accent mt-1">{value[0].name}</p>}
                        </div>
                        <Input
                          id="main-image-upload"
                          type="file"
                          className="hidden"
                          {...fieldProps}
                          onChange={(e) => handleMainImageChange(e, onChange)}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {mainImagePreview && (
                    <div className="relative w-32 h-20 mt-2 rounded-md overflow-hidden border border-admin-border">
                      <Image src={mainImagePreview} alt="Main Image Preview" layout="fill" objectFit="cover" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeMainImage}
                        className="absolute top-0 right-0 h-6 w-6 text-red-500 hover:bg-red-900/20"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </FormItem>
              )}
            />
            {/* New Gallery Images Upload Field */}
            <FormField
              control={form.control}
              name="galleryImages"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Gallery Images (Upload Multiple)</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="gallery-images-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-admin-input-bg border-admin-input-border hover:border-admin-accent transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-admin-text-secondary" />
                          <p className="mb-2 text-sm text-admin-text-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-admin-text-secondary">PNG, JPG, WEBP (MAX. 5MB each)</p>
                          {value && value.length > 0 && (
                            <p className="text-xs text-admin-accent mt-1">{value.length} file(s) selected</p>
                          )}
                        </div>
                        <Input
                          id="gallery-images-upload"
                          type="file"
                          multiple
                          className="hidden"
                          {...fieldProps}
                          onChange={(e) => handleGalleryImagesChange(e, onChange)}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {galleryImagePreviews.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {galleryImagePreviews.map((preview, index) => (
                        <div key={index} className="relative w-full h-20 rounded-md overflow-hidden border border-admin-border">
                          <Image src={preview} alt={`Gallery Image Preview ${index + 1}`} layout="fill" objectFit="cover" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-0 right-0 h-6 w-6 text-red-500 hover:bg-red-900/20"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the competition"
                      className="resize-y min-h-[80px] bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default" className="w-full py-3 text-lg font-semibold shadow-lg hover:scale-[1.01] transition-transform duration-300 bg-admin-accent text-white hover:bg-admin-accent/90" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Competition'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};