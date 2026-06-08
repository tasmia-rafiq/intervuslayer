import {
  Control,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
}

export default function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-[#A8B3AD]">
            {label}
          </FormLabel>

          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className="h-12 rounded-xl border-white/8 bg-white/[0.035] px-4 text-[#F4F1EA] placeholder:text-[#69756F] focus-visible:border-[#2DD4BF]/50 focus-visible:ring-[#2DD4BF]/15"
            />
          </FormControl>

          <FormMessage className="text-sm text-[#FCA5A5]" />
        </FormItem>
      )}
    />
  );
}