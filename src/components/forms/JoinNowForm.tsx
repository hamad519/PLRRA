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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon, PlusCircle, XCircle, Upload, User, MapPin, Shield, CreditCard, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

const fileSchema = z.any()
  .refine((file) => file?.length > 0, "File is required.")
  .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
    "Only .jpg, .jpeg, .png, .webp, and .pdf formats are supported."
  );

const weaponSchema = z.object({
  nomenclature: z.string().min(1, "Nomenclature is required."),
  caliber: z.string().min(1, "Caliber is required."),
  bodyNumber: z.string().min(1, "Body Number is required."),
  madeBy: z.string().min(1, "Manufacturer is required."),
});

const formSchema = z.object({
  membershipPlan: z.string().min(1, "Please select a membership plan."),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters."),
  religion: z.string().min(2, "Religion is required."),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  profession: z.string().min(2, "Profession is required."),
  addressLine1: z.string().min(5, "Address Line 1 is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  jobBusinessAddress: z.string().min(5, "Job/Business address is required."),
  presentHomeAddress: z.string().min(5, "Present home address is required."),
  permanentHomeAddress: z.string().min(5, "Permanent home address is required."),
  cnicNo: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, "Invalid CNIC format (e.g., 12345-1234567-1)"),
  cnicCopy: fileSchema,
  passportNo: z.string().optional(),
  passportCopy: z.any().optional().refine((file) => !file?.length || file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`).refine(
    (file) => !file?.length || ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
    "Only .jpg, .jpeg, .png, .webp, and .pdf formats are supported."
  ),
  phoneNo: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number format."),
  email: z.string().email("Please enter a valid email address."),
  weapons: z.array(weaponSchema).min(1, "At least one weapon detail is required."),
  weaponLicenseCopy: fileSchema,
  membershipFeeYear: z.string().regex(/^\d{4}$/, "Please enter a valid year (e.g., 2024)."),
  bankChallanCopy: fileSchema,
});

export const JoinNowForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membershipPlan: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      religion: "",
      profession: "",
      addressLine1: "",
      city: "",
      state: "",
      jobBusinessAddress: "",
      presentHomeAddress: "",
      permanentHomeAddress: "",
      cnicNo: "",
      passportNo: "",
      phoneNo: "",
      email: "",
      weapons: [{ nomenclature: "", caliber: "", bodyNumber: "", madeBy: "" }],
      membershipFeeYear: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "weapons",
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
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
      const cnicCopyBase64 = values.cnicCopy && values.cnicCopy.length > 0
        ? await convertFileToBase64(values.cnicCopy[0])
        : '';
      const passportCopyBase64 = values.passportCopy && values.passportCopy.length > 0
        ? await convertFileToBase64(values.passportCopy[0])
        : undefined;
      const weaponLicenseCopyBase64 = values.weaponLicenseCopy && values.weaponLicenseCopy.length > 0
        ? await convertFileToBase64(values.weaponLicenseCopy[0])
        : '';
      const bankChallanCopyBase64 = values.bankChallanCopy && values.bankChallanCopy.length > 0
        ? await convertFileToBase64(values.bankChallanCopy[0])
        : '';

      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth.toISOString(),
        cnicCopyBase64,
        passportCopyBase64,
        weaponLicenseCopyBase64,
        bankChallanCopyBase64,
        cnicCopy: undefined,
        passportCopy: undefined,
        weaponLicenseCopy: undefined,
        bankChallanCopy: undefined,
      };

      const res = await fetch('/api/admin/membership-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Your application has been submitted!");
        form.reset();
      } else {
        toast.error(data.message || 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Membership application submission error:', error);
      toast.error('Network error or server unreachable.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="container mx-auto py-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Section 1: Membership Plan */}
            <Reveal direction="up">
              <Card className="bg-white border border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 bg-plra-bg-soft/50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-plra-gold/10 flex items-center justify-center text-plra-gold">
                      <Shield size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-plra-black">Membership Plan</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-10">
                  <FormField
                    control={form.control}
                    name="membershipPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-plra-black">Select Your Plan <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple">
                              <SelectValue placeholder="Choose a membership category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-100 rounded-2xl shadow-2xl">
                            <SelectItem value="annual">Annual Membership</SelectItem>
                            <SelectItem value="lifetime">Lifetime Membership</SelectItem>
                            <SelectItem value="junior">Junior Membership</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </Reveal>

            {/* Section 2: Personal Information */}
            <Reveal direction="up" delay={0.1}>
              <Card className="bg-white border border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 bg-plra-bg-soft/50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-plra-accent-purple/10 flex items-center justify-center text-plra-accent-purple">
                      <User size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-plra-black">Personal Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">First Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">Last Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">Father's Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Father's full name" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="religion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">Religion <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Islam" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-bold text-plra-black">Date of Birth <span className="text-red-500">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal bg-plra-bg-soft border-none h-14 rounded-2xl hover:bg-gray-100",
                                    !field.value && "text-gray-400"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-plra-accent-purple" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border-gray-100 rounded-2xl shadow-2xl" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">Profession <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Your occupation" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            {/* Section 3: Address & Contact */}
            <Reveal direction="up" delay={0.2}>
              <Card className="bg-white border border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 bg-plra-bg-soft/50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-plra-accent-pink/10 flex items-center justify-center text-plra-accent-pink">
                      <MapPin size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-plra-black">Address & Contact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-plra-black">Address Line 1 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Street address, P.O. box, etc." {...field} className="bg-plra-bg-soft border-none min-h-[100px] rounded-2xl focus:ring-2 focus:ring-plra-accent-purple resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">City <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Lahore" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">Province/State <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple">
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-gray-100 rounded-2xl shadow-2xl">
                              <SelectItem value="punjab">Punjab</SelectItem>
                              <SelectItem value="sindh">Sindh</SelectItem>
                              <SelectItem value="kpk">Khyber Pakhtunkhwa</SelectItem>
                              <SelectItem value="balochistan">Balochistan</SelectItem>
                              <SelectItem value="islamabad">Islamabad</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">Phone Number <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+92 3XX XXXXXXX" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-plra-black">Email Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            {/* Section 4: Identification & Documents */}
            <Reveal direction="up" delay={0.3}>
              <Card className="bg-white border border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 bg-plra-bg-soft/50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Briefcase size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-plra-black">Identification & Documents</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="cnicNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-plra-black">CNIC Number <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="12345-1234567-1" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cnicCopy"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-plra-black">Copy of CNIC <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2rem] cursor-pointer bg-plra-bg-soft border-gray-200 hover:border-plra-accent-purple transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-plra-accent-purple transition-colors" />
                                    <p className="mb-2 text-sm text-gray-500 font-bold">Click to upload CNIC</p>
                                    <p className="text-xs text-gray-400">PNG, JPG, PDF (MAX. 5MB)</p>
                                    {value?.[0] && <p className="text-xs text-plra-accent-purple mt-2 font-black">{value[0].name}</p>}
                                  </div>
                                  <Input type="file" className="hidden" {...fieldProps} onChange={(e) => onChange(e.target.files)} />
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="passportNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-plra-black">Passport Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter passport number" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="passportCopy"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-plra-black">Copy of Passport (Optional)</FormLabel>
                            <FormControl>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2rem] cursor-pointer bg-plra-bg-soft border-gray-200 hover:border-plra-accent-purple transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-plra-accent-purple transition-colors" />
                                    <p className="mb-2 text-sm text-gray-500 font-bold">Click to upload Passport</p>
                                    <p className="text-xs text-gray-400">PNG, JPG, PDF (MAX. 5MB)</p>
                                    {value?.[0] && <p className="text-xs text-plra-accent-purple mt-2 font-black">{value[0].name}</p>}
                                  </div>
                                  <Input type="file" className="hidden" {...fieldProps} onChange={(e) => onChange(e.target.files)} />
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            {/* Section 5: Weapon Details */}
            <Reveal direction="up" delay={0.4}>
              <Card className="bg-white border border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 bg-plra-bg-soft/50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Shield size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-plra-black">Weapon Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  {fields.map((item, index) => (
                    <div key={item.id} className="relative p-8 bg-plra-bg-soft rounded-[2rem] border border-gray-100 group">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name={`weapons.${index}.nomenclature`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-plra-black">Nomenclature <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Rifle" {...field} className="bg-white border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`weapons.${index}.caliber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-plra-black">Caliber <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., .308 Win" {...field} className="bg-white border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`weapons.${index}.bodyNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-plra-black">Body Number <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Serial number" {...field} className="bg-white border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`weapons.${index}.madeBy`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-plra-black">Manufacturer <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Remington" {...field} className="bg-white border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="absolute -top-3 -right-3 bg-white shadow-lg text-red-500 hover:bg-red-50 rounded-full h-10 w-10"
                        >
                          <XCircle size={20} />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ nomenclature: "", caliber: "", bodyNumber: "", madeBy: "" })}
                    className="w-full py-8 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-bold hover:border-plra-accent-purple hover:text-plra-accent-purple hover:bg-plra-accent-purple/5 transition-all"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Another Weapon
                  </Button>

                  <FormField
                    control={form.control}
                    name="weaponLicenseCopy"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-plra-black">Weapon License (Attach Copy) <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2rem] cursor-pointer bg-plra-bg-soft border-gray-200 hover:border-plra-accent-purple transition-all group">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-plra-accent-purple transition-colors" />
                                <p className="mb-2 text-sm text-gray-500 font-bold">Click to upload License</p>
                                <p className="text-xs text-gray-400">PNG, JPG, PDF (MAX. 5MB)</p>
                                {value?.[0] && <p className="text-xs text-plra-accent-purple mt-2 font-black">{value[0].name}</p>}
                              </div>
                              <Input type="file" className="hidden" {...fieldProps} onChange={(e) => onChange(e.target.files)} />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </Reveal>

            {/* Section 6: Payment Information */}
            <Reveal direction="up" delay={0.5}>
              <Card className="bg-white border border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 bg-plra-bg-soft/50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-plra-gold/10 flex items-center justify-center text-plra-gold">
                      <CreditCard size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-plra-black">Payment Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <FormField
                    control={form.control}
                    name="membershipFeeYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-plra-black">Fee Paid For Year <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2024" {...field} className="bg-plra-bg-soft border-none h-14 rounded-2xl focus:ring-2 focus:ring-plra-accent-purple" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankChallanCopy"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-plra-black">Proof of Payment (Challan/Screenshot) <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2rem] cursor-pointer bg-plra-bg-soft border-gray-200 hover:border-plra-accent-purple transition-all group">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-plra-accent-purple transition-colors" />
                                <p className="mb-2 text-sm text-gray-500 font-bold">Click to upload Proof</p>
                                <p className="text-xs text-gray-400">PNG, JPG, PDF (MAX. 5MB)</p>
                                {value?.[0] && <p className="text-xs text-plra-accent-purple mt-2 font-black">{value[0].name}</p>}
                              </div>
                              <Input type="file" className="hidden" {...fieldProps} onChange={(e) => onChange(e.target.files)} />
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center p-6 bg-plra-bg-soft rounded-2xl border border-gray-100">
                    <p className="text-gray-500 font-medium mb-2">Need our bank account details?</p>
                    <Link href="/account-details" className="text-plra-accent-purple font-black hover:underline flex items-center justify-center gap-2">
                      <CreditCard size={18} /> View Official Account Details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal direction="up" delay={0.6}>
              <Button 
                type="submit" 
                className="w-full py-10 rounded-[2rem] bg-plra-black hover:bg-plra-black/90 text-white text-xl font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Application...
                  </div>
                ) : (
                  "Submit Membership Application"
                )}
              </Button>
            </Reveal>
          </form>
        </Form>
      </div>
    </section>
  );
};