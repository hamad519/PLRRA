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
import { Upload, Trophy, FileText, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
];

const formSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Must be a 4-digit year"),
  title: z.string().min(3, "Title is required"),
  pdf: z.any()
    .refine((files) => files?.length > 0, "File is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf and .docx formats are supported."
    ),
});

export const AddNationalRecordForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", year: new Date().getFullYear().toString() },
  });

  const selectedFiles = form.watch("pdf");
  const fileName = selectedFiles?.[0]?.name;

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const pdfBase64 = await convertToBase64(values.pdf[0]);
      const res = await fetch('/api/admin/national-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          year: parseInt(values.year), 
          title: values.title, 
          pdfBase64 
        }),
      });

      if (res.ok) {
        toast.success("Record added successfully!");
        form.reset();
        router.push('/admin/records/manage');
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save record");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white border-admin-border shadow-xl rounded-[2rem]">
      <CardHeader className="p-8 bg-admin-bg/50 border-b border-admin-border">
        <CardTitle className="text-2xl font-black flex items-center gap-3">
          <Trophy className="text-admin-accent" /> New National Record
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024" {...field} className="bg-admin-bg border-none h-12 rounded-xl font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Record Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., FTR Ranking 2024" {...field} className="bg-admin-bg border-none h-12 rounded-xl font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pdf"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel className="font-bold">Document (PDF or DOCX)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2rem] cursor-pointer bg-admin-bg border-admin-border hover:border-admin-accent transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {fileName ? (
                            <>
                              <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-500 animate-in zoom-in duration-300" />
                              <p className="text-sm text-emerald-600 font-black">{fileName}</p>
                              <p className="text-xs text-gray-400 mt-1">Click to change file</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 mb-3 text-gray-400 group-hover:text-admin-accent transition-colors" />
                              <p className="text-sm text-gray-500 font-bold">Click to upload</p>
                              <p className="text-xs text-gray-400">PDF or DOCX only (Max 10MB)</p>
                            </>
                          )}
                        </div>
                        <Input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          className="hidden" 
                          onChange={(e) => onChange(e.target.files)} 
                          {...rest}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-8 rounded-2xl bg-admin-accent text-white text-lg font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.01]"
            >
              {isLoading ? "Saving..." : "Save National Record"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};