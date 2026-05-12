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
import { CalendarIcon, Upload, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/lib/uploadImage';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z.any()
  .refine((file) => !file || file.length === 0 || file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
  .refine(
    (file) => !file || file.length === 0 || ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
    "Only .jpg, .jpeg, .png, .webp formats are supported."
  ).optional();

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  date: z.date({
    required_error: "Event date is required.",
  }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  mainImage: fileSchema, // For new main image upload
  description: z.string().optional(),
});

interface EditUpcomingEventFormProps {
  eventId: string;
}

export const EditUpcomingEventForm = ({ eventId }: EditUpcomingEventFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialMainImageBase64, setInitialMainImageBase64] = useState<string | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/events/${eventId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          const event = data.data;
          form.reset({
            title: event.title,
            date: new Date(event.date),
            location: event.location,
            description: event.description,
            mainImage: undefined, // Clear file input for new upload
          });
          setInitialMainImageBase64(event.mainImageBase64 || null);
          setMainImagePreview(event.mainImageBase64 || null);
        } else {
          toast.error(data.message || 'Failed to fetch event details.');
          router.push('/admin/events/upcoming/manage'); // Redirect if not found
        }
      } catch (err: any) {
        console.error('Fetch event error:', err);
        toast.error(`Error: ${err.message}`);
        router.push('/admin/events/upcoming/manage'); // Redirect on error
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, form, router]);

  const uploadEventImage = (file: File): Promise<string> =>
    uploadImage(file, { folder: 'events', maxSizeMB: 0.5, maxWidthOrHeight: 1920 });

  const handleMainImageChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const url = await uploadEventImage(file);
        setMainImagePreview(url);
        setInitialMainImageBase64(url);
        onChange(event.target.files);
      } catch (err: any) {
        toast.error(err.message || 'Failed to upload image');
      }
    } else {
      setMainImagePreview(initialMainImageBase64);
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // mainImagePreview already holds either the initial DB URL or the freshly uploaded URL
      const finalMainImageBase64 = mainImagePreview;

      if (!finalMainImageBase64) {
        toast.error("Main image is required.");
        setIsLoading(false);
        return;
      }

      const payload = {
        title: values.title,
        date: values.date.toISOString(),
        location: values.location,
        description: values.description,
        mainImageBase64: finalMainImageBase64,
      };

      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Event updated successfully!");
        router.push('/admin/events/upcoming/manage');
      } else {
        toast.error(data.message || 'Failed to update event.');
      }
    } catch (error) {
      console.error('Update event error:', error);
      toast.error('Network error or server unreachable.');
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
          Edit Event
        </CardTitle>
        <h2 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary">
          Update Event
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-admin-text-primary text-lg">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-admin-input-bg border-admin-input-border text-admin-text-primary hover:bg-admin-hover-bg hover:text-admin-text-primary",
                            !field.value && "text-admin-text-secondary"
                          )}
                        >
                          <span className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-admin-accent" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </span>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-admin-card-bg border-admin-border" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={new Date().getFullYear() - 10}
                        toYear={new Date().getFullYear() + 10}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                          <p className="text-xs text-admin-text-secondary">PNG, JPG, WEBP (MAX. 20MB)</p>
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-admin-text-primary text-lg">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the event"
                      className="resize-y min-h-[80px] bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default" className="w-full py-3 text-lg font-semibold shadow-lg hover:scale-[1.01] transition-transform duration-300 bg-admin-accent text-white hover:bg-admin-accent/90" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Event'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};