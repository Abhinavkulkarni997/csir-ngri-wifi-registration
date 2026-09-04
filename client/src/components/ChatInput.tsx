import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  placeholder?: string;
  type?: 'text' | 'email' | 'tel'|'date';
  min?:string;
   max?: string;
   initialValue?: string;
  onSubmit: (value: string) => void;
}

export default function ChatInput({
  placeholder = 'Type your answer...',
  type = 'text',
  min,
   max,
   initialValue='',
  onSubmit,
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    // Send exactly once
    onSubmit(trimmedValue);

    // Clear input after successful submission
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-3"
    >
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="
          flex-1
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          text-sm
          sm:text-base
          text-slate-900
          placeholder:text-slate-400
          outline-none
          focus:border-indigo-500
          focus:ring-4
          focus:ring-indigo-100
        "
      />

      <button
        type="submit"
        disabled={!value.trim()}
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-indigo-600
          text-white
          shadow-sm
          transition
          hover:bg-indigo-700
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        aria-label="Send"
      >
        <ArrowUp size={22} />
      </button>
    </form>
  );
}