"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Upload, XCircle, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AdminDatePicker } from '@/components/ui/AdminDatePicker';
import { uploadImage } from '@/lib/uploadImage';

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const MAX_VIDEO_SIZE = 25 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

const mainImageSchema = z.any()
  .refine(
    (file) => !file || file.length === 0 || file?.[0]?.size <= MAX_IMAGE_SIZE,
    'Max file size is 20MB.'
  )
  .refine(
    (file) => !file || file.length === 0 || ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
    'Only .jpg, .jpeg, .png, .webp formats are supported.'
  )
  .optional();

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  date: z.date({ required_error: 'Event date is required.' }),
  mainImage: mainImageSchema,
});

type GalleryItem =
  | { kind: 'existing'; type: 'image' | 'video'; url: string }
  | { kind: 'pending'; type: 'image' | 'video'; file: File; previewUrl: string };

interface EditNationalGalleryEventFormProps {
  eventId: string;
}

export const EditNationalGalleryEventForm = ({ eventId }: EditNationalGalleryEventFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string | null>(null);
  const [pendingMainImageFile, setPendingMainImageFile] = useState<File | null>(null);
  const [pendingMainImagePreview, setPendingMainImagePreview] = useState<string | null>(null);
  const [galleryMedia, setGalleryMedia] = useState<GalleryItem[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/national-gallery/${eventId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.success) {
          const event = data.data;
          form.reset({
            title: event.title,
            date: new Date(event.date),
            mainImage: undefined,
          });
          setExistingMainImageUrl(event.mainImageBase64 || null);
          const media: GalleryItem[] = Array.isArray(event.galleryMedia)
            ? event.galleryMedia
                .filter((m: any) => m && (m.type === 'image' || m.type === 'video') && typeof m.url === 'string')
                .map((m: any) => ({ kind: 'existing' as const, type: m.type, url: m.url }))
            : [];
          setGalleryMedia(media);
        } else {
          toast.error(data.message || 'Failed to fetch gallery event.');
          router.push('/admin/national-gallery/manage');
        }
      } catch (err: any) {
        console.error('Fetch gallery event error:', err);
        toast.error(`Error: ${err.message}`);
        router.push('/admin/national-gallery/manage');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId, form, router]);

  useEffect(() => {
    return () => {
      if (pendingMainImagePreview) URL.revokeObjectURL(pendingMainImagePreview);
      galleryMedia.forEach((m) => {
        if (m.kind === 'pending') URL.revokeObjectURL(m.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainImagePreview = pendingMainImagePreview ?? existingMainImageUrl;

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (pendingMainImagePreview) URL.revokeObjectURL(pendingMainImagePreview);
      setPendingMainImageFile(file);
      setPendingMainImagePreview(URL.createObjectURL(file));
      onChange(event.target.files);
    } else {
      if (pendingMainImagePreview) URL.revokeObjectURL(pendingMainImagePreview);
      setPendingMainImageFile(null);
      setPendingMainImagePreview(null);
      onChange(null);
    }
  };

  const handleGalleryMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const files = Array.from(event.target.files);
    const added: GalleryItem[] = [];
    for (const file of files) {
      const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);
      const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
      if (!isImage && !isVideo) {
        toast.error(`Unsupported file type: ${file.name}`);
        continue;
      }
      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        toast.error(`Video too large (max 25MB): ${file.name}`);
        continue;
      }
      if (isImage && file.size > MAX_IMAGE_SIZE) {
        toast.error(`Image too large (max 20MB): ${file.name}`);
        continue;
      }
      added.push({
        kind: 'pending',
        type: isVideo ? 'video' : 'image',
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
    setGalleryMedia((prev) => [...prev, ...added]);
    event.target.value = '';
  };

  const removeMainImage = () => {
    if (pendingMainImagePreview) URL.revokeObjectURL(pendingMainImagePreview);
    setPendingMainImageFile(null);
    setPendingMainImagePreview(null);
    setExistingMainImageUrl(null);
    form.setValue('mainImage', null);
    const input = document.getElementById('ng-main-image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const removeGalleryMedia = (indexToRemove: number) => {
    setGalleryMedia((prev) => {
      const removed = prev[indexToRemove];
      if (removed && removed.kind === 'pending') URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!existingMainImageUrl && !pendingMainImageFile) {
      toast.error('Main image is required.');
      return;
    }
    setIsLoading(true);
    try {
      let finalMainImageBase64: string | null = existingMainImageUrl;
      if (pendingMainImageFile) {
        try {
          finalMainImageBase64 = await uploadImage(pendingMainImageFile, {
            folder: 'national-gallery',
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
          });
        } catch (err: any) {
          toast.error(err.message || 'Failed to upload main image');
          setIsLoading(false);
          return;
        }
      }

      const finalGalleryMedia: { type: 'image' | 'video'; url: string }[] = [];
      for (const item of galleryMedia) {
        if (item.kind === 'existing') {
          finalGalleryMedia.push({ type: item.type, url: item.url });
        } else {
          const url = await uploadImage(item.file, {
            folder: 'national-gallery',
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
          });
          finalGalleryMedia.push({ type: item.type, url });
        }
      }

      const payload = {
        title: values.title,
        date: values.date.toISOString(),
        mainImageBase64: finalMainImageBase64,
        galleryMedia: finalGalleryMedia,
      };

      const res = await fetch(`/api/admin/national-gallery/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Gallery event updated successfully!');
        galleryMedia.forEach((m) => {
          if (m.kind === 'pending') URL.revokeObjectURL(m.previewUrl);
        });
        router.push('/admin/national-gallery/manage');
      } else {
        toast.error(data.message || 'Failed to update gallery event.');
      }
    } catch (error: any) {
      console.error('Update gallery event error:', error);
      toast.error(error?.message || 'Network error or server unreachable.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !form.formState.isSubmitted) {
    return <div className="text-center text-admin-text-primary text-xl">Loading event details...</div>;
  }

  return (
    <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6 max-w-2xl mx-auto">
      <CardHeader className="pb-6 text-center">
        <CardTitle className="text-admin-accent text-lg font-semibold uppercase tracking-wider mb-2">
          Edit Gallery Event
        </CardTitle>
        <h2 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary">
          Update National Gallery Event
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
                  <FormLabel className="text-admin-text-primary text-lg">Event Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary"
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
                  <FormLabel className="text-admin-text-primary text-lg">Event Date</FormLabel>
                  <FormControl>
                    <AdminDatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholder="Select event date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Main Image (Upload New)</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="ng-main-image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-admin-input-bg border-admin-input-border hover:border-admin-accent transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-admin-text-secondary" />
                          <p className="mb-2 text-sm text-admin-text-secondary">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-admin-text-secondary">PNG, JPG, WEBP (MAX. 20MB)</p>
                          {value?.[0] && <p className="text-xs text-admin-accent mt-1">{value[0].name}</p>}
                        </div>
                        <Input
                          id="ng-main-image-upload"
                          type="file"
                          accept="image/*"
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
                      <Image
                        src={mainImagePreview}
                        alt="Main Image Preview"
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                      />
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

            <div>
              <label className="text-admin-text-primary text-lg block mb-2">
                Additional Images &amp; Videos
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="ng-gallery-media-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-admin-input-bg border-admin-input-border hover:border-admin-accent transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-admin-text-secondary" />
                    <p className="mb-2 text-sm text-admin-text-secondary">
                      <span className="font-semibold">Click to select</span> images and videos
                    </p>
                    <p className="text-xs text-admin-text-secondary">
                      Images: PNG/JPG/WEBP (20MB) • Videos: MP4/WEBM/MOV (25MB)
                    </p>
                    <p className="text-xs text-admin-text-secondary mt-1">Files upload when you click Update Gallery Event</p>
                  </div>
                  <Input
                    id="ng-gallery-media-upload"
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/ogg,video/quicktime"
                    className="hidden"
                    onChange={handleGalleryMediaChange}
                  />
                </label>
              </div>
              {galleryMedia.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {galleryMedia.map((item, index) => {
                    const src = item.kind === 'existing' ? item.url : item.previewUrl;
                    return (
                    <div
                      key={index}
                      className="relative w-full h-20 rounded-md overflow-hidden border border-admin-border bg-black"
                    >
                      {item.type === 'image' ? (
                        <Image
                          src={src}
                          alt={`Media ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <video src={src} className="absolute inset-0 w-full h-full object-cover" muted />
                          <PlayCircle className="relative h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGalleryMedia(index)}
                        className="absolute top-0 right-0 h-6 w-6 text-red-500 hover:bg-red-900/20"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full py-3 text-lg font-semibold shadow-lg hover:scale-[1.01] transition-transform duration-300 bg-admin-accent text-white hover:bg-admin-accent/90"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading & saving...' : 'Update Gallery Event'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
