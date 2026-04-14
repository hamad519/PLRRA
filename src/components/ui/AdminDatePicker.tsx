"use client";

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AdminDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export const AdminDatePicker = ({ value, onChange, placeholder = 'Select date', className }: AdminDatePickerProps) => {
  return (
    <div className={cn('admin-datepicker', className)}>
      <ReactDatePicker
        selected={value || null}
        onChange={onChange}
        dateFormat="dd MMM yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={15}
        scrollableYearDropdown
        popperClassName="admin-datepicker-popper"
        popperPlacement="bottom-start"
        customInput={
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-2 px-4 h-11 rounded-xl border-none bg-admin-input-bg",
              "text-sm font-semibold text-left transition-all",
              value ? "text-admin-text-primary" : "text-admin-text-secondary"
            )}
          >
            <CalendarIcon className="h-4 w-4 text-admin-accent shrink-0" />
            <span>{value ? format(value, 'dd MMM yyyy') : placeholder}</span>
          </button>
        }
      />
    </div>
  );
};
