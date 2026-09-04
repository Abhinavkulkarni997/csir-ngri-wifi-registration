import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import {
  CheckCircle2,
  Network,
} from 'lucide-react';

interface MacAddressInputProps {
     initialValue?: string;
  onSubmit: (macAddress: string) => void;
}

export default function MacAddressInput({
     initialValue="",
  onSubmit,
}: MacAddressInputProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const formatMacAddress = (input: string) => {
    const cleaned = input
      .replace(/[^a-fA-F0-9]/g, '')
      .slice(0, 12)
      .toUpperCase();

    return cleaned.match(/.{1,2}/g)?.join(':') ?? '';
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatMacAddress(
      event.target.value
    );

    setValue(formatted);
    setError('');
  };

  const handleSubmit = () => {
    const cleaned = value.replace(
      /[^A-Fa-f0-9]/g,
      ''
    );

    if (cleaned.length !== 12) {
      setError(
        'Please enter a valid MAC address like AA:BB:CC:DD:EE:FF.'
      );
      return;
    }

    setError('');
    onSubmit(value);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Network size={22} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Wi-Fi MAC Address
            </h3>

            <p className="text-sm text-slate-500">
              Enter the MAC address of your device.
            </p>
          </div>
        </div>

        {/* INPUT */}
        <div className="mt-5">
          <label
            htmlFor="mac-address-input"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            MAC Address
          </label>

          <div className="relative">
            <input
              id="mac-address-input"
              name="macAddress"
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="AA:BB:CC:DD:EE:FF"
              maxLength={17}
              autoComplete="off"
              autoFocus
              spellCheck={false}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                pr-12
                font-mono
                text-base
                tracking-widest
                text-slate-900
                placeholder:text-slate-400
                outline-none
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100
              "
            />

            {value.length === 17 && (
              <CheckCircle2
                size={20}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-green-600
                "
              />
            )}
          </div>

          {error && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <p className="mt-2 text-xs text-slate-400">
            Example: AA:BB:CC:DD:EE:FF
          </p>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleSubmit}
          className="
            mt-5
            w-full
            rounded-xl
            bg-indigo-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            hover:bg-indigo-700
            active:scale-[0.99]
            transition
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}