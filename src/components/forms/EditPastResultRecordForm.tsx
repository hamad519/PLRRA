"use client";

import React, { useState, useEffect } from 'react';
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
import { CalendarIcon, Upload, PlusCircle, XCircle, FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/lib/uploadFile';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_PDF_TYPES = ["application/pdf"];

const pdfFileSchema = z.any()
  .refine((file) => !file || file.length === 0 || file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => !file || file.length === 0 || ACCEPTED_PDF_TYPES.includes(file?.[0]?.type),
    "Only .pdf format is supported."
  ).optional();

const matchResultSchema = z.object({
  name: z.string().min(3, { message: "Match name must be at least 3 characters." }),
  pdf: pdfFileSchema, // For new PDF upload
  pdfBase64: z.string().optional(), // For existing PDF Base64
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

interface EditPastResultRecordFormProps {
  recordId: string;
}

export const EditPastResultRecordForm = ({ recordId }: EditPastResultRecordFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pdfPreviews, setPdfPreviews] = useState<Record<number, string | null>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "matches",
  });

  useEffect(() => {
    const fetchRecord = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/past-results-records/${recordId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          const record = data.data;
          const initialMatches = record.matches.map((match: any, index: number) => {
            setPdfPreviews((prev) => ({ ...prev, [index]: match.pdfBase64 }));
            return {
              name: match.name,
              pdf: undefined,
              pdfBase64: match.pdfBase64,
              details: match.details,
            };
          });

          form.reset({
            title: record.title,
            date: new Date(record.date),
            location: record.location,
            matches: initialMatches,
          });
        } else {
          toast.error(data.message || 'Failed to fetch past result/record details.');
          router.push('/admin/events/past-results-records/manage');
        }
      } catch (err: any) {
        console.error('Fetch past result/record error:', err);
        toast.error(`Error: ${err.message}`);
        router.push('/admin/events/past-results-records/manage');
      } finally {
        setIsLoading(false);
      }
    };

    if (recordId) {
      fetchRecord();
    }
  }, [recordId, form, router]);

  const convertFileToBase64 = (file: File): Promise<string> =>
    uploadFile(file, 'past-results');

  const handlePdfChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void,
    index: number
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const url = await uploadFile(file, 'past-results');
        setPdfPreviews((prev) => ({ ...prev, [index]: url }));
        form.setValue(`matches.${index}.pdfBase64`, url);
        onChange(event.target.files);
      } catch (err: any) {
        toast.error(err.message || 'Failed to upload document');
      }
    } else {
      const currentMatch = form.getValues(`matches.${index}`);
      setPdfPreviews((prev) => ({ ...prev, [index]: currentMatch.pdfBase64 || null }));
      onChange(null);
    }
  };

  const removePdf = (index: number) => {
    setPdfPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
    form.setValue(`matches.${index}.pdf`, undefined);
    form.setValue(`matches.${index}.pdfBase64`, undefined);
    const input = document.getElementById(`match-${index}-pdf-upload`) as HTMLInputElement;
    if (input) input.value = '';
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const matchesWithBase64 = await Promise.all(
        values.matches.map(async (match, index) => {
          // pdfBase64 was set (to a URL path) when the file was selected, so use it directly
          let finalPdfBase64: string | undefined = match.pdfBase64;

          if (pdfPreviews[index] === null) {
            finalPdfBase64 = undefined;
          }

          if (!finalPdfBase64) {
            throw new Error(`PDF for match "${match.name}" is required.`);
          }

          return {
            name: match.name,
            pdfBase64: finalPdfBase64,
            details: match.details,
          };
        })
      );

      const payload = {
        title: values.title,
        date: values.date.toISOString(),
        location: values.location,
        matches: matchesWithBase64,
      };

      const res = await fetch(`/api/admin/past-results-records/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Past result/record updated successfully!");
        router.push('/admin/events/past-results-records/manage');
      } else {
        toast.error(data.message || 'Failed to update past result/record.');
      }
    } catch (error: any) {
      console.error('Update past result/record error:', error);
      toast.error(error.message || 'Network error or server unreachable.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !form.formState.isSubmitted) {
    return <div className="text-center text-admin-text-primary text-xl">Loading record details...</div>;
  }

  return (
    <Card className="bg-admin-card-bg border border-admin-border text-admin-text-primary shadow-xl rounded-xl p-6 max-w-3xl mx-auto">
      <CardHeader className="pb-6 text-center">
        <CardTitle className="text-admin-accent text-lg font-semibold uppercase tracking-wider mb-2">
          Edit Entry
        </CardTitle>
        <h2 className="text-4xl md:text-5xl font-extrabold text-admin-text-primary">
          Update Past Result / Record
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
                  <FormLabel className="text-admin-text-primary text-lg">Competition Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 42nd PARA Cen Meet 2022" {...field} className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
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
                        fromYear={new Date().getFullYear() - 20}
                        toYear={new Date().getFullYear() + 5}
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
                    <Input placeholder="e.g., Army Marksmanship Unit, Jhelum" {...field} className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-admin-accent border-b border-admin-border pb-2 mb-4">Match Results</h3>
              {fields.map((item, index) => (
                <Card key={item.id} className="bg-admin-card-bg/50 border border-admin-border p-6 relative">
                  <CardContent className="p-0 space-y-4">
                    <FormField
                      control={form.control}
                      name={`matches.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-admin-text-primary text-lg">Match Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1000 Meter F Open Rifle Match" {...field} className="bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`matches.${index}.pdf`}
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel className="text-admin-text-primary text-lg">Result PDF (Upload New)</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label htmlFor={`match-${index}-pdf-upload`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-admin-input-bg border-admin-input-border hover:border-admin-accent transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-3 text-admin-text-secondary" />
                                  <p className="mb-2 text-sm text-admin-text-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                  <p className="text-xs text-admin-text-secondary">PDF (MAX. 5MB)</p>
                                  {value?.[0] && <p className="text-xs text-admin-accent mt-1">{value[0].name}</p>}
                                </div>
                                <Input
                                  id={`match-${index}-pdf-upload`}
                                  type="file"
                                  className="hidden"
                                  {...fieldProps}
                                  onChange={(e) => handlePdfChange(e, onChange, index)}
                                />
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                          {pdfPreviews[index] && (
                            <div className="relative w-32 h-20 mt-2 rounded-md overflow-hidden border border-admin-border flex items-center justify-center bg-gray-100">
                              <FileText className="h-10 w-10 text-red-500" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePdf(index)}
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
                      name={`matches.${index}.details`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-admin-text-primary text-lg">Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Any specific details about this match" {...field} className="resize-y min-h-[60px] bg-admin-input-bg border-admin-input-border text-admin-text-primary focus:border-admin-accent placeholder:text-admin-text-secondary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="absolute top-4 right-4 text-red-500 hover:bg-red-900/20"
                    >
                      <XCircle className="h-6 w-6" />
                    </Button>
                  )}
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", pdf: undefined, details: "" })}
                className="w-full bg-admin-input-bg border-admin-input-border text-admin-accent hover:bg-admin-hover-bg hover:text-admin-accent"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Match Result
              </Button>
            </div>

            <Button type="submit" variant="default" className="w-full py-3 text-lg font-semibold shadow-lg hover:scale-[1.01] transition-transform duration-300 bg-admin-accent text-white hover:bg-admin-accent/90" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Past Result / Record'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};