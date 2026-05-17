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
import { useRouter } from 'next/navigation';
import { AdminDatePicker } from '@/components/ui/AdminDatePicker';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  fromDate: z.date({ required_error: "From date is required." }),
  toDate: z.date({ required_error: "To date is required." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  description: z.string().optional(),
});

interface EditUpcomingEventFormProps {
  eventId: string;
}

export const EditUpcomingEventForm = ({ eventId }: EditUpcomingEventFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/events/${eventId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.success) {
          const event = data.data;
          form.reset({
            title: event.title,
            fromDate: new Date(event.fromDate || event.date),
            toDate: new Date(event.toDate || event.date),
            location: event.location,
            description: event.description,
          });
          setExistingMainImageUrl(event.mainImageBase64 || null);
        } else {
          toast.error(data.message || 'Failed to fetch event details.');
          router.push('/admin/events/upcoming/manage');
        }
      } catch (err: any) {
        console.error('Fetch event error:', err);
        toast.error(`Error: ${err.message}`);
        router.push('/admin/events/upcoming/manage');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload = {
        title: values.title,
        fromDate: values.fromDate.toISOString(),
        toDate: values.toDate.toISOString(),
        location: values.location,
        description: values.description,
        mainImageBase64: existingMainImageUrl,
      };

      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
            <Button type="submit" variant="default" className="mx-auto flex h-10 px-6 rounded-lg text-sm font-semibold shadow-sm transition-colors bg-admin-accent text-white hover:bg-admin-accent/90 items-center justify-center" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Update Event'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
