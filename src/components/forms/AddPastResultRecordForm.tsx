"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { CalendarIcon, Upload, PlusCircle, XCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/lib/uploadFile';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
];

const pdfFileSchema = z.any()
  .refine((file) => file?.length > 0, "File is required.")
  .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
    "Only .pdf and .docx formats are supported."
  );

const matchResultSchema = z.object({
  name: z.string().min(3, { message: "Match name must be at least 3 characters." }),
  pdf: pdfFileSchema,
  details: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().min(3, { message: "Competition title must be at least 3 characters." }),
  date: z.date({
    required_error: "Competition date is required.",
  }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  matches: z.array(matchResultSchema).min(1, "At least one match result is required."),
});

export const AddPastResultRecordForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fileNames, setFileNames] = useState<Record<number, string>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      matches: [{ name: "", details: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "matches",
  });

  const convertFileToBase64 = (file: File): Promise<string> =>
    uploadFile(file, 'past-results');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void, index: number) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileNames(prev => ({ ...prev, [index]: event.target.files![0].name }));
      onChange(event.target.files);
    } else {
      setFileNames(prev => {
        const newNames = { ...prev };
        delete newNames[index];
        return newNames;
      });
      onChange(null);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const matchesWithBase64 = await Promise.all(
        values.matches.map(async (match) => {
          const pdfBase64 = await convertFileToBase64(match.pdf[0]);
          return {
            name: match.name,
            pdfBase64: pdfBase64,
            details: match.details,
          };
        })
      );

      const res = await fetch('/api/admin/past-results-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, matches: matchesWithBase64 }),
      });

      if (res.ok) {
        toast.success("Past result added successfully!");
        router.push('/admin/events/past-results-records/manage');
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6 max-w-3xl mx-auto">
      <CardHeader className="pb-6 text-center">
        <h2 className="text-4xl font-extrabold text-admin-text-primary">Add Past Result</h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Competition Title</FormLabel>
                  <FormControl><Input placeholder="e.g., 42nd PARA Cen Meet" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">Date</FormLabel>
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Location</FormLabel>
                    <FormControl><Input placeholder="e.g., Jhelum" {...field} className="bg-admin-bg border-none h-12 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-admin-accent">Match Results</h3>
              {fields.map((item, index) => (
                <Card key={item.id} className="bg-admin-bg/30 border border-admin-border p-6 relative rounded-2xl">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`matches.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Match Name</FormLabel>
                          <FormControl><Input placeholder="e.g., 1000m F Open" {...field} className="bg-white border-none h-12 rounded-xl" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`matches.${index}.pdf`}
                      render={({ field: { onChange } }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Document (PDF or DOCX)</FormLabel>
                          <FormControl>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-white border-admin-border hover:border-admin-accent transition-all">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {fileNames[index] ? (
                                  <>
                                    <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500" />
                                    <p className="text-xs text-emerald-600 font-bold">{fileNames[index]}</p>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="text-xs text-gray-500 font-bold">Upload PDF/DOCX</p>
                                  </>
                                )}
                              </div>
                              <Input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileChange(e, onChange, index)} />
                            </label>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2 text-red-500"><XCircle size={20} /></Button>
                  )}
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={() => append({ name: "", details: "" })} className="w-full rounded-xl border-dashed"><PlusCircle className="mr-2 h-4 w-4" /> Add Match</Button>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-8 rounded-xl bg-admin-accent text-white font-black uppercase tracking-widest">
              {isLoading ? "Saving..." : "Save Past Result"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};