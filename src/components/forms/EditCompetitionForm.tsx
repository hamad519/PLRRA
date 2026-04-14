"use client";

import React, { useState, useEffect } from 'react';
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
import { AdminDatePicker } from '@/components/ui/AdminDatePicker';
import { useRouter } from 'next/navigation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z.any()
  .refine((file) => !file || file.length === 0 || file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => !file || file.length === 0 || ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
    "Only .jpg, .jpeg, .png, .webp formats are supported."
  ).optional();

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

interface EditCompetitionFormProps {
  competitionId: string;
}

export const EditCompetitionForm = ({ competitionId }: EditCompetitionFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialMainImageBase64, setInitialMainImageBase64] = useState<string | null>(null);
  const [initialGalleryImagesBase64, setInitialGalleryImagesBase64] = useState<string[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchCompetition = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/competitions/${competitionId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          const competition = data.data;
          form.reset({
            title: competition.title,
            fromDate: new Date(competition.fromDate || competition.date),
            toDate: new Date(competition.toDate || competition.date),
            location: competition.location,
            description: competition.description,
            mainImage: undefined,
            galleryImages: undefined,
          });
          setInitialMainImageBase64(competition.mainImageBase64 || null);
          setMainImagePreview(competition.mainImageBase64 || null);
          setInitialGalleryImagesBase64(competition.galleryImagesBase64 || []);
          setGalleryImagePreviews(competition.galleryImagesBase64 || []);
        } else {
          toast.error(data.message || 'Failed to fetch competition details.');
          router.push('/admin/competitions/manage'); // Redirect if not found
        }
      } catch (err: any) {
        console.error('Fetch competition error:', err);
        toast.error(`Error: ${err.message}`);
        router.push('/admin/competitions/manage'); // Redirect on error
      } finally {
        setIsLoading(false);
      }
    };

    if (competitionId) {
      fetchCompetition();
    }
  }, [competitionId, form, router]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleMainImageChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const base64 = await convertFileToBase64(file);
      setMainImagePreview(base64);
      onChange(event.target.files);
    } else {
      setMainImagePreview(initialMainImageBase64); // Revert to initial if cleared
      onChange(null);
    }
  };

  const handleGalleryImagesChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const base64Previews = await Promise.all(files.map(file => convertFileToBase64(file)));
      setGalleryImagePreviews(prev => [...prev, ...base64Previews]); // Add new to existing previews
      onChange(files); // Pass the new files to react-hook-form
    } else {
      // If the user clears the file input, we don't want to clear existing gallery images
      // The removeGalleryImage function handles explicit removal.
      onChange(null);
    }
  };

  const removeMainImage = () => {
    setMainImagePreview(null);
    setInitialMainImageBase64(null); // Also clear initial
    form.setValue('mainImage', null);
    const input = document.getElementById('main-image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    // No need to update form.setValue('galleryImages') directly here for individual removals
    // as the final payload will be constructed from galleryImagePreviews state.
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      let finalMainImageBase64 = initialMainImageBase64;
      if (values.mainImage && values.mainImage.length > 0) {
        finalMainImageBase64 = await convertFileToBase64(values.mainImage[0]);
      } else if (mainImagePreview === null) {
        finalMainImageBase64 = null; // Explicitly set to null if removed
      }

      // The galleryImagePreviews state already holds the combined list of
      // initial images and newly added images (as Base64 strings).
      // We use this state directly for the final payload.
      const finalGalleryImagesBase64 = galleryImagePreviews;

      const payload = {
        title: values.title,
        fromDate: values.fromDate.toISOString(),
        toDate: values.toDate.toISOString(),
        location: values.location,
        description: values.description,
        mainImageBase64: finalMainImageBase64,
        galleryImagesBase64: finalGalleryImagesBase64.length > 0 ? finalGalleryImagesBase64 : undefined,
      };

      const res = await fetch(`/api/admin/competitions/${competitionId}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Competition updated successfully!");
        router.push('/admin/competitions/manage');
      } else {
        toast.error(data.message || 'Failed to update competition.');
      }
    } catch (error) {
      console.error('Update competition error:', error);
      toast.error('Network error or server unreachable.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !form.formState.isSubmitted) {
    return <div className="text-center text-admin-text-primary text-xl">Loading competition details...</div>;
  }

  return (
    <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6 max-w-2xl mx-auto">
      <CardHeader className="pb-6 text-center">
        <CardTitle className="text-admin-accent text-lg font-semibold uppercase tracking-wider mb-2">
          Edit Competition
        </CardTitle>
        <h2 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary">
          Update Competition
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
            {/* Main Image Upload Field */}
            <FormField
              control={form.control}
              name="mainImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Main Image (Upload New)</FormLabel>
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
            {/* Gallery Images Upload Field */}
            <FormField
              control={form.control}
              name="galleryImages"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Gallery Images (Upload New)</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="gallery-images-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-admin-input-bg border-admin-input-border hover:border-admin-accent transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-admin-text-secondary" />
                          <p className="mb-2 text-sm text-admin-text-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-admin-text-secondary">PNG, JPG, WEBP (MAX. 5MB each)</p>
                          {value && value.length > 0 && (
                            <p className="text-xs text-admin-accent mt-1">{value.length} new file(s) selected</p>
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
              {isLoading ? 'Updating...' : 'Update Competition'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};