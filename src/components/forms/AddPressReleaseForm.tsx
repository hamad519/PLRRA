"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, FileText, CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/lib/uploadFile';

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
];

const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  date: z.date(),
  pdf: z.any()
    .refine((file) => file?.length > 0, "File is required")
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf and .docx formats are supported."
    ),
});

export const AddPressReleaseForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", date: new Date() },
  });

  const selectedFiles = form.watch("pdf");
  const fileName = selectedFiles?.[0]?.name;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Upload the file first — returns a public URL like /uploads/press-releases/xxx.pdf
      const pdfBase64 = await uploadFile(values.pdf[0], 'press-releases');

      const res = await fetch('/api/admin/press-releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: values.title, date: values.date, pdfBase64 }),
      });
      if (res.ok) {
        toast.success("Press Release added!");
        router.push('/admin/press-releases/manage');
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to add press release");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add press release");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white border-admin-border shadow-xl rounded-[2rem]">
      <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
        <CardTitle className="text-2xl font-black flex items-center gap-3">
          <FileText className="text-admin-accent" /> New Press Release
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
                  <FormLabel className="font-bold">Release Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Annual Championship Announcement" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">Release Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full justify-start text-left h-12 rounded-xl bg-admin-bg border-none", !field.value && "text-muted-foreground")}>
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
              name="pdf"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel className="font-bold">Document (PDF or DOCX)</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-admin-bg border-admin-border hover:border-admin-accent transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {fileName ? (
                            <>
                              <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-500" />
                              <p className="text-sm text-emerald-600 font-bold">{fileName}</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="text-sm text-gray-500 font-bold">Click to upload</p>
                              <p className="text-xs text-gray-400">PDF or DOCX only</p>
                            </>
                          )}
                        </div>
                        <Input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => onChange(e.target.files)} />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full py-8 rounded-xl bg-admin-accent text-white font-black uppercase tracking-widest">
              {isLoading ? "Uploading..." : "Save Press Release"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};